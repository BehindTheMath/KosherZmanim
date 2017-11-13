import {DateUtils, TimeZone} from "./polyfills/Utils";
import GeoLocation from "./util/GeoLocation";
import AstronomicalCalculator from "./util/AstronomicalCalculator";
import SunTimesCalculator from "./util/SunTimesCalculator";

import {Big} from "big.js";

import * as MomentTimezone from "moment-timezone";
import Moment = MomentTimezone.Moment;

/**
 * A Java calendar that calculates astronomical times such as {@link #getSunrise() sunrise} and {@link #getSunset()
 * sunset} times. This class contains a {@link #getCalendar() Calendar} and can therefore use the standard Calendar
 * functionality to change dates etc... The calculation engine used to calculate the astronomical times can be changed
 * to a different implementation by implementing the abstract {@link AstronomicalCalculator} and setting it with the
 * {@link #setAstronomicalCalculator(AstronomicalCalculator)}. A number of different calculation engine implementations
 * are included in the util package.
 * <b>Note:</b> There are times when the algorithms can't calculate proper values for sunrise, sunset and twilight. This
 * is usually caused by trying to calculate times for areas either very far North or South, where sunrise / sunset never
 * happen on that date. This is common when calculating twilight with a deep dip below the horizon for locations as far
 * south of the North Pole as London, in the northern hemisphere. The sun never reaches this dip at certain times of the
 * year. When the calculations encounter this condition a null will be returned when a
 * <code>{@link java.util.Date}</code> is expected and {@link Long#MIN_VALUE} when a <code>long</code> is expected. The
 * reason that <code>Exception</code>s are not thrown in these cases is because the lack of a rise/set or twilight is
 * not an exception, but an expected condition in many parts of the world.
 *
 * Here is a simple example of how to use the API to calculate sunrise.
 * First create the Calendar for the location you would like to calculate sunrise or sunset times for:
 *
 * <pre>
 * String locationName = &quot;Lakewood, NJ&quot;;
 * double latitude = 40.0828; // Lakewood, NJ
 * double longitude = -74.2094; // Lakewood, NJ
 * double elevation = 20; // optional elevation correction in Meters
 * // the String parameter in getTimeZone() has to be a valid timezone listed in
 * // {@link java.util.TimeZone#getAvailableIDs()}
 * TimeZone timeZone = TimeZone.getTimeZone(&quot;America/New_York&quot;);
 * GeoLocation location = new GeoLocation(locationName, latitude, longitude, elevation, timeZone);
 * AstronomicalCalendar ac = new AstronomicalCalendar(location);
 * </pre>
 *
 * To get the time of sunrise, first set the date you want (if not set, the date will default to today):
 *
 * <pre>
 * ac.getCalendar().set(Calendar.MONTH, Calendar.FEBRUARY);
 * ac.getCalendar().set(Calendar.DAY_OF_MONTH, 8);
 * Date sunrise = ac.getSunrise();
 * </pre>
 *
 *
 * @author &copy; Eliyahu Hershfeld 2004 - 2016
 */
export default class AstronomicalCalendar {
    /**
     * 90&deg; below the vertical. Used as a basis for most calculations since the location of the sun is 90&deg; below
     * the horizon at sunrise and sunset.
     * <b>Note </b>: it is important to note that for sunrise and sunset the {@link AstronomicalCalculator#adjustZenith
     * adjusted zenith} is required to account for the radius of the sun and refraction. The adjusted zenith should not
     * be used for calculations above or below 90&deg; since they are usuallyes are calculated as an offset to 90&deg;.
     */
    public static readonly GEOMETRIC_ZENITH: number = 90;

    /**
     * Default value for Sun's zenith and true rise/set Zenith (used in this class and subclasses) is the angle that the
     * center of the Sun makes to a line perpendicular to the Earth's surface. If the Sun were a point and the Earth
     * were without an atmosphere, true sunset and sunrise would correspond to a 90&deg; zenith. Because the Sun is not
     * a point, and because the atmosphere refracts light, this 90&deg; zenith does not, in fact, correspond to true
     * sunset or sunrise, instead the center of the Sun's disk must lie just below the horizon for the upper edge to be
     * obscured. This means that a zenith of just above 90&deg; must be used. The Sun subtends an angle of 16 minutes of
     * arc (this can be changed via the {@link #setSunRadius(double)} method , and atmospheric refraction accounts for
     * 34 minutes or so (this can be changed via the {@link #setRefraction(double)} method), giving a total of 50
     * arcminutes. The total value for ZENITH is 90+(5/6) or 90.8333333&deg; for true sunrise/sunset.
     */
    // const ZENITH: number = GEOMETRIC_ZENITH + 5.0 / 6.0;

    /** Sun's zenith at civil twilight (96&deg;). */
    public static readonly CIVIL_ZENITH: number = 96;

    /** Sun's zenith at nautical twilight (102&deg;). */
    public static readonly NAUTICAL_ZENITH: number = 102;

    /** Sun's zenith at astronomical twilight (108&deg;). */
    public static readonly ASTRONOMICAL_ZENITH: number = 108;

    /** constant for milliseconds in a minute (60,000) */
    protected static readonly MINUTE_MILLIS: number = 60 * 1000;

    /** constant for milliseconds in an hour (3,600,000) */
    protected static readonly HOUR_MILLIS: number = AstronomicalCalendar.MINUTE_MILLIS * 60;

    /**
     * The Java Calendar encapsulated by this class to track the current date used by the class
     */
    private moment: Moment = MomentTimezone();

    private geoLocation: GeoLocation;

    private astronomicalCalculator: AstronomicalCalculator;

    /**
     * The getSunrise method Returns a <code>Date</code> representing the
     * {@link AstronomicalCalculator#getElevationAdjustment(double) elevation adjusted} sunrise time. The zenith used
     * for the calculation uses {@link #GEOMETRIC_ZENITH geometric zenith} of 90&deg; plus
     * {@link AstronomicalCalculator#getElevationAdjustment(double)}. This is adjusted by the
     * {@link AstronomicalCalculator} to add approximately 50/60 of a degree to account for 34 archminutes of refraction
     * and 16 archminutes for the sun's radius for a total of {@link AstronomicalCalculator#adjustZenith 90.83333&deg;}.
     * See documentation for the specific implementation of the {@link AstronomicalCalculator} that you are using.
     *
     * @return the <code>Date</code> representing the exact sunrise time. If the calculation can't be computed such as
     *         in the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
     *         does not set, a null will be returned. See detailed explanation on top of the page.
     * @see AstronomicalCalculator#adjustZenith
     * @see #getSeaLevelSunrise()
     * @see AstronomicalCalendar#getUTCSunrise
     */
    public getSunrise(): Date {
        const sunrise: number = this.getUTCSunrise(AstronomicalCalendar.GEOMETRIC_ZENITH);
        if (Number.isNaN(sunrise)) {
            return null;
        } else {
            return this.getDateFromTime(sunrise);
        }
    }

    /**
     * A method that returns the sunrise without {@link AstronomicalCalculator#getElevationAdjustment(double) elevation
     * adjustment}. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
     * something that is not affected by elevation. This method returns sunrise calculated at sea level. This forms the
     * base for dawn calculations that are calculated as a dip below the horizon before sunrise.
     *
     * @return the <code>Date</code> representing the exact sea-level sunrise time. If the calculation can't be computed
     *         such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
     *         where it does not set, a null will be returned. See detailed explanation on top of the page.
     * @see AstronomicalCalendar#getSunrise
     * @see AstronomicalCalendar#getUTCSeaLevelSunrise
     * @see #getSeaLevelSunset()
     */
    public getSeaLevelSunrise(): Date {
        const sunrise: number = this.getUTCSeaLevelSunrise(AstronomicalCalendar.GEOMETRIC_ZENITH);
        if (Number.isNaN(sunrise)) {
            return null;
        } else {
            return this.getDateFromTime(sunrise);
        }
    }

    /**
     * A method that returns the beginning of civil twilight (dawn) using a zenith of {@link #CIVIL_ZENITH 96&deg;}.
     *
     * @return The <code>Date</code> of the beginning of civil twilight using a zenith of 96&deg;. If the calculation
     *         can't be computed, null will be returned. See detailed explanation on top of the page.
     * @see #CIVIL_ZENITH
     */
    public getBeginCivilTwilight(): Date {
        return this.getSunriseOffsetByDegrees(AstronomicalCalendar.CIVIL_ZENITH);
    }

    /**
     * A method that returns the beginning of nautical twilight using a zenith of {@link #NAUTICAL_ZENITH 102&deg;}.
     *
     * @return The <code>Date</code> of the beginning of nautical twilight using a zenith of 102&deg;. If the
     *         calculation can't be computed null will be returned. See detailed explanation on top of the page.
     * @see #NAUTICAL_ZENITH
     */
    public getBeginNauticalTwilight(): Date {
        return this.getSunriseOffsetByDegrees(AstronomicalCalendar.NAUTICAL_ZENITH);
    }

    /**
     * A method that returns the beginning of astronomical twilight using a zenith of {@link #ASTRONOMICAL_ZENITH
     * 108&deg;}.
     *
     * @return The <code>Date</code> of the beginning of astronomical twilight using a zenith of 108&deg;. If the
     *         calculation can't be computed, null will be returned. See detailed explanation on top of the page.
     * @see #ASTRONOMICAL_ZENITH
     */
    public getBeginAstronomicalTwilight(): Date {
        return this.getSunriseOffsetByDegrees(AstronomicalCalendar.ASTRONOMICAL_ZENITH);
    }

    /**
     * The getSunset method Returns a <code>Date</code> representing the
     * {@link AstronomicalCalculator#getElevationAdjustment(double) elevation adjusted} sunset time. The zenith used for
     * the calculation uses {@link #GEOMETRIC_ZENITH geometric zenith} of 90&deg; plus
     * {@link AstronomicalCalculator#getElevationAdjustment(double)}. This is adjusted by the
     * {@link AstronomicalCalculator} to add approximately 50/60 of a degree to account for 34 archminutes of refraction
     * and 16 archminutes for the sun's radius for a total of {@link AstronomicalCalculator#adjustZenith 90.83333&deg;}.
     * See documentation for the specific implementation of the {@link AstronomicalCalculator} that you are using. Note:
     * In certain cases the calculates sunset will occur before sunrise. This will typically happen when a timezone
     * other than the local timezone is used (calculating Los Angeles sunset using a GMT timezone for example). In this
     * case the sunset date will be incremented to the following date.
     *
     * @return the <code>Date</code> representing the exact sunset time. If the calculation can't be computed such as in
     *         the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
     *         does not set, a null will be returned. See detailed explanation on top of the page.
     * @see AstronomicalCalculator#adjustZenith
     * @see #getSeaLevelSunset()
     * @see AstronomicalCalendar#getUTCSunset
     */
    public getSunset(): Date {
        const sunset: number = this.getUTCSunset(AstronomicalCalendar.GEOMETRIC_ZENITH);
        if (Number.isNaN(sunset)) {
            return null;
        } else {
            return this.getAdjustedSunsetDate(this.getDateFromTime(sunset), this.getSunrise());
        }
    }

    /**
     * A method that will roll the sunset time forward a day if sunset occurs before sunrise. This is a rare occurrence
     * and will typically happen when calculating very early and late twilights in a location with a time zone far off
     * from its natural 15&deg; boundaries. This method will ensure that in this case, the sunset will be incremented to
     * the following date. An example of this is Marquette, Michigan that far west of the natural boundaries for EST.
     * When you add in DST this pushes it an additional hour off. Calculating the extreme 26&deg;twilight on March 6th
     * it start at 2:34:30 on the 6th and end at 1:01:46 on the following day March 7th. Occurrences are more common in
     * the polar region for dips as low as 3&deg; (Tested for Hooper Bay, Alaska). TODO: Since the occurrences are rare,
     * look for optimization to avoid relatively expensive calls to this method.
     *
     * @param sunset
     *            the sunset date to adjust if needed
     * @param sunrise
     *            the sunrise to compare to the sunset
     * @return the adjusted sunset date. If the calculation can't be computed such as in the Arctic Circle where there
     *         is at least one day a year where the sun does not rise, and one where it does not set, a null will be
     *         returned. See detailed explanation on top of the page.
     */
    private getAdjustedSunsetDate(sunset: Date, sunrise: Date): Date {
        if (sunset != null && sunrise != null && DateUtils.compareTo(sunrise, sunset) >= 0) {
            const moment: Moment = MomentTimezone(sunset).add({days: 1});
            return moment.toDate();
        } else {
            return sunset;
        }
    }

    /**
     * A method that returns the sunset without {@link AstronomicalCalculator#getElevationAdjustment(double) elevation
     * adjustment}. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
     * something that is not affected by elevation. This method returns sunset calculated at sea level. This forms the
     * base for dusk calculations that are calculated as a dip below the horizon after sunset.
     *
     * @return the <code>Date</code> representing the exact sea-level sunset time. If the calculation can't be computed
     *         such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
     *         where it does not set, a null will be returned. See detailed explanation on top of the page.
     * @see AstronomicalCalendar#getSunset
     * @see AstronomicalCalendar#getUTCSeaLevelSunset 2see {@link #getSunset()}
     */
    public getSeaLevelSunset(): Date {
        const sunset: number = this.getUTCSeaLevelSunset(AstronomicalCalendar.GEOMETRIC_ZENITH);
        if (Number.isNaN(sunset)) {
            return null;
        } else {
            return this.getAdjustedSunsetDate(this.getDateFromTime(sunset), this.getSeaLevelSunrise());
        }
    }

    /**
     * A method that returns the end of civil twilight using a zenith of {@link #CIVIL_ZENITH 96&deg;}.
     *
     * @return The <code>Date</code> of the end of civil twilight using a zenith of {@link #CIVIL_ZENITH 96&deg;}. If
     *         the calculation can't be computed, null will be returned. See detailed explanation on top of the page.
     * @see #CIVIL_ZENITH
     */
    public getEndCivilTwilight(): Date {
        return this.getSunsetOffsetByDegrees(AstronomicalCalendar.CIVIL_ZENITH);
    }

    /**
     * A method that returns the end of nautical twilight using a zenith of {@link #NAUTICAL_ZENITH 102&deg;}.
     *
     * @return The <code>Date</code> of the end of nautical twilight using a zenith of {@link #NAUTICAL_ZENITH 102&deg;}
     *         . If the calculation can't be computed, null will be returned. See detailed explanation on top of the
     *         page.
     * @see #NAUTICAL_ZENITH
     */
    public getEndNauticalTwilight(): Date {
        return this.getSunsetOffsetByDegrees(AstronomicalCalendar.NAUTICAL_ZENITH);
    }

    /**
     * A method that returns the end of astronomical twilight using a zenith of {@link #ASTRONOMICAL_ZENITH 108&deg;}.
     *
     * @return the <code>Date</code> of the end of astronomical twilight using a zenith of {@link #ASTRONOMICAL_ZENITH
     *         108&deg;}. If the calculation can't be computed, null will be returned. See detailed explanation on top
     *         of the page.
     * @see #ASTRONOMICAL_ZENITH
     */
    public getEndAstronomicalTwilight(): Date {
        return this.getSunsetOffsetByDegrees(AstronomicalCalendar.ASTRONOMICAL_ZENITH);
    }

    /**
     * A utility method that returns a date offset by the offset time passed in as a parameter. This method casts the
     * offset as a <code>long</code> and calls {@link #getTimeOffset(Date, long)}.
     *
     * @param time
     *            the start time
     * @param offset
     *            the offset in milliseconds to add to the time
     * @return the {@link java.util.Date}with the offset added to it
     */
/*
    public getTimeOffset(time: Date, offset: number): Date {
        return this.getTimeOffset(time, offset);
    }
*/

    /**
     * A utility method that returns a date offset by the offset time passed in. Please note that the level of light
     * during twilight is not affected by elevation, so if this is being used to calculate an offset before sunrise or
     * after sunset with the intent of getting a rough "level of light" calculation, the sunrise or sunset time passed
     * to this method should be sea level sunrise and sunset.
     *
     * @param time
     *            the start time
     * @param offset
     *            the offset in milliseconds to add to the time.
     * @return the {@link java.util.Date} with the offset in milliseconds added to it
     */
    public getTimeOffset(time: Date, offset: number): Date {
        if (time === null || offset === null) {
            return null;
        }

        return new Date(time.getTime() + offset);
    }

    /**
     * A utility method that returns the time of an offset by degrees below or above the horizon of
     * {@link #getSunrise() sunrise}. Note that the degree offset is from the vertical, so for a calculation of 14&deg;
     * before sunrise, an offset of 14 + {@link #GEOMETRIC_ZENITH} = 104 would have to be passed as a parameter.
     *
     * @param offsetZenith
     *            the degrees before {@link #getSunrise()} to use in the calculation. For time after sunrise use
     *            negative numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg;
     *            before sunrise, an offset of 14 + {@link #GEOMETRIC_ZENITH} = 104 would have to be passed as a
     *            parameter.
     * @return The {@link java.util.Date} of the offset after (or before) {@link #getSunrise()}. If the calculation
     *         can't be computed such as in the Arctic Circle where there is at least one day a year where the sun does
     *         not rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
     *         page.
     */
    public getSunriseOffsetByDegrees(offsetZenith: number): Date {
        const dawn: number = this.getUTCSunrise(offsetZenith);
        if (Number.isNaN(dawn)) {
            return null;
        } else {
            return this.getDateFromTime(dawn);
        }
    }

    /**
     * A utility method that returns the time of an offset by degrees below or above the horizon of {@link #getSunset()
     * sunset}. Note that the degree offset is from the vertical, so for a calculation of 14&deg; after sunset, an
     * offset of 14 + {@link #GEOMETRIC_ZENITH} = 104 would have to be passed as a parameter.
     *
     * @param offsetZenith
     *            the degrees after {@link #getSunset()} to use in the calculation. For time before sunset use negative
     *            numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg; after
     *            sunset, an offset of 14 + {@link #GEOMETRIC_ZENITH} = 104 would have to be passed as a parameter.
     * @return The {@link java.util.Date}of the offset after (or before) {@link #getSunset()}. If the calculation can't
     *         be computed such as in the Arctic Circle where there is at least one day a year where the sun does not
     *         rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
     *         page.
     */
    public getSunsetOffsetByDegrees(offsetZenith: number): Date {
        const sunset: number = this.getUTCSunset(offsetZenith);
        if (Number.isNaN(sunset)) {
            return null;
        } else {
            return this.getAdjustedSunsetDate(this.getDateFromTime(sunset), this.getSunriseOffsetByDegrees(offsetZenith));
        }
    }

    /**
     * Default constructor will set a default {@link GeoLocation#GeoLocation()}, a default
     * {@link AstronomicalCalculator#getDefault() AstronomicalCalculator} and default the calendar to the current date.
     */

    /*
    constructor() {
        this(new GeoLocation());
    }
    */

    /**
     * A constructor that takes in <a href="http://en.wikipedia.org/wiki/Geolocation">geolocation</a> information as a
     * parameter.
     *
     * @param geoLocation
     *            The location information used for calculating astronomical sun times.
     */
    constructor(geoLocation: GeoLocation = new GeoLocation()) {
        this.setMoment(MomentTimezone.tz(geoLocation.getTimeZone()));
        this.setGeoLocation(geoLocation); // duplicate call
        this.setAstronomicalCalculator(new SunTimesCalculator());
    }

    /**
     * A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
     * daylight savings time.
     *
     * @param zenith
     *            the degrees below the horizon. For time after sunrise use negative numbers.
     * @return The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
     *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
     *         not set, {@link Double#NaN} will be returned. See detailed explanation on top of the page.
     */
    public getUTCSunrise(zenith: number): number {
        return this.getAstronomicalCalculator().getUTCSunrise(this.getMoment(), this.getGeoLocation(), zenith, true);
    }

    /**
     * A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
     * daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible
     * light, something that is not affected by elevation. This method returns UTC sunrise calculated at sea level. This
     * forms the base for dawn calculations that are calculated as a dip below the horizon before sunrise.
     *
     * @param zenith
     *            the degrees below the horizon. For time after sunrise use negative numbers.
     * @return The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
     *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
     *         not set, {@link Double#NaN} will be returned. See detailed explanation on top of the page.
     * @see AstronomicalCalendar#getUTCSunrise
     * @see AstronomicalCalendar#getUTCSeaLevelSunset
     */
    public getUTCSeaLevelSunrise(zenith: number): number {
        return this.getAstronomicalCalculator().getUTCSunrise(this.getMoment(), this.getGeoLocation(), zenith, false);
    }

    /**
     * A method that returns the sunset in UTC time without correction for time zone offset from GMT and without using
     * daylight savings time.
     *
     * @param zenith
     *            the degrees below the horizon. For time after sunset use negative numbers.
     * @return The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
     *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
     *         not set, {@link Double#NaN} will be returned. See detailed explanation on top of the page.
     * @see AstronomicalCalendar#getUTCSeaLevelSunset
     */
    public getUTCSunset(zenith: number): number {
        return this.getAstronomicalCalculator().getUTCSunset(this.getMoment(), this.getGeoLocation(), zenith, true);
    }

    /**
     * A method that returns the sunset in UTC time without correction for elevation, time zone offset from GMT and
     * without using daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the
     * amount of visible light, something that is not affected by elevation. This method returns UTC sunset calculated
     * at sea level. This forms the base for dusk calculations that are calculated as a dip below the horizon after
     * sunset.
     *
     * @param zenith
     *            the degrees below the horizon. For time before sunset use negative numbers.
     * @return The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
     *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
     *         not set, {@link Double#NaN} will be returned. See detailed explanation on top of the page.
     * @see AstronomicalCalendar#getUTCSunset
     * @see AstronomicalCalendar#getUTCSeaLevelSunrise
     */
    public getUTCSeaLevelSunset(zenith: number): number {
        return this.getAstronomicalCalculator().getUTCSunset(this.getMoment(), this.getGeoLocation(), zenith, false);
    }

    /**
     * A method that returns an {@link AstronomicalCalculator#getElevationAdjustment(double) elevation adjusted}
     * temporal (solar) hour. The day from {@link #getSunrise() sunrise} to {@link #getSunset() sunset} is split into 12
     * equal parts with each one being a temporal hour.
     *
     * @see #getSunrise()
     * @see #getSunset()
     * @see #getTemporalHour(Date, Date)
     *
     * @return the <code>long</code> millisecond length of a temporal hour. If the calculation can't be computed,
     *         {@link Long#MIN_VALUE} will be returned. See detailed explanation on top of the page.
     *
     * @see #getTemporalHour(Date, Date)
     */
/*
    public getTemporalHour(): number {
        return this.getTemporalHour(this.getSeaLevelSunrise(), this.getSeaLevelSunset());
    }
*/

    /**
     * A utility method that will allow the calculation of a temporal (solar) hour based on the sunrise and sunset
     * passed as parameters to this method. An example of the use of this method would be the calculation of a
     * non-elevation adjusted temporal hour by passing in {@link #getSeaLevelSunrise() sea level sunrise} and
     * {@link #getSeaLevelSunset() sea level sunset} as parameters.
     *
     * @param startOfday
     *            The start of the day.
     * @param endOfDay
     *            The end of the day.
     *
     * @return the <code>long</code> millisecond length of the temporal hour. If the calculation can't be computed a
     *         {@link Long#MIN_VALUE} will be returned. See detailed explanation on top of the page.
     *
     * @see #getTemporalHour()
     */
    public getTemporalHour(startOfday: Date = this.getSeaLevelSunrise(), endOfDay: Date = this.getSeaLevelSunset()): number {
        if (startOfday === null || endOfDay === null) {
            return null;
        }
        return (endOfDay.getTime() - startOfday.getTime()) / 12;
    }

    /**
     * A method that returns sundial or solar noon. It occurs when the Sun is <a href
     * ="http://en.wikipedia.org/wiki/Transit_%28astronomy%29">transitting</a> the <a
     * href="http://en.wikipedia.org/wiki/Meridian_%28astronomy%29">celestial meridian</a>. In this class it is
     * calculated as halfway between sea level sunrise and sea level sunset, which can be slightly off the real transit
     * time due to changes in declination (the lengthening or shortening day).
     *
     * @return the <code>Date</code> representing Sun's transit. If the calculation can't be computed such as in the
     *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
     *         not set, null will be returned. See detailed explanation on top of the page.
     * @see #getSunTransit(Date, Date)
     * @see #getTemporalHour()
     */
/*
    public getSunTransit(): Date {
        return this.getSunTransit(getSeaLevelSunrise(), this.getSeaLevelSunset());
    }
*/

    /**
     * A method that returns sundial or solar noon. It occurs when the Sun is <a href
     * ="http://en.wikipedia.org/wiki/Transit_%28astronomy%29">transitting</a> the <a
     * href="http://en.wikipedia.org/wiki/Meridian_%28astronomy%29">celestial meridian</a>. In this class it is
     * calculated as halfway between the sunrise and sunset passed to this method. This time can be slightly off the
     * real transit time due to changes in declination (the lengthening or shortening day).
     *
     * @param startOfDay
     *            the start of day for calculating the sun's transit. This can be sea level sunrise, visual sunrise (or
     *            any arbitrary start of day) passed to this method.
     * @param endOfDay
     *            the end of day for calculating the sun's transit. This can be sea level sunset, visual sunset (or any
     *            arbitrary end of day) passed to this method.
     *
     * @return the <code>Date</code> representing Sun's transit. If the calculation can't be computed such as in the
     *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
     *         not set, null will be returned. See detailed explanation on top of the page.
     */
    public getSunTransit(startOfDay: Date = this.getSeaLevelSunrise(), endOfDay: Date = this.getSeaLevelSunset()): Date {
        const temporalHour: number = this.getTemporalHour(startOfDay, endOfDay);
        return this.getTimeOffset(startOfDay, temporalHour * 6);
    }

    /**
     * A method that returns a <code>Date</code> from the time passed in as a parameter.
     *
     * @param time
     *            The time to be set as the time for the <code>Date</code>. The time expected is in the format: 18.75
     *            for 6:45:00 PM.
     * @return The Date.
     */
    protected getDateFromTime(time: number): Date {
        if (Number.isNaN(time)) {
            return null;
        }
        let calculatedTime: number = time;

        const moment: Moment = MomentTimezone.tz({
            year: this.moment.year(),
            month: this.moment.month(),
            date: this.moment.date()
        }, "UTC");

        // raw non DST offset in hours
        const gmtOffset: number = TimeZone.getRawOffset(this.moment) / (60 * AstronomicalCalendar.MINUTE_MILLIS);

        // Set the correct calendar date in UTC. For example Tokyo is 9 hours ahead of GMT. Sunrise at ~6 AM will be at
        // ~21 hours GMT of the previous day and has to be set accordingly. In the case of California USA that is 7
        // hours behind GMT, sunset at ~6 PM will be at ~1 GMT the following day and has to be set accordingly.
        if (time + gmtOffset > 24) {
            moment.subtract({days: 1});
        } else if (time + gmtOffset < 0) {
            moment.add( {days: 1});
        }

        const hours: number = Math.trunc(calculatedTime); // retain only the hours
        calculatedTime -= hours;
        const minutes: number = Math.trunc(calculatedTime *= 60); // retain only the minutes
        calculatedTime -= minutes;
        const seconds: number = Math.trunc(calculatedTime *= 60); // retain only the seconds
        calculatedTime -= seconds; // remaining milliseconds

        moment.set({
            hours,
            minutes,
            seconds,
            milliseconds: Math.trunc(calculatedTime * 1000)
        });

        return moment.toDate();
    }

    /**
     * Returns the dip below the horizon before sunrise that matches the offset minutes on passed in as a parameter. For
     * example passing in 72 minutes for a calendar set to the equinox in Jerusalem returns a value close to 16.1&deg;
     * Please note that this method is very slow and inefficient and should NEVER be used in a loop. TODO: Improve
     * efficiency.
     *
     * @param minutes
     *            offset
     * @return the degrees below the horizon before sunrise that match the offset in minutes passed it as a parameter.
     * @see #getSunsetSolarDipFromOffset(double)
     */
    public getSunriseSolarDipFromOffset(minutes: number): number {
        let offsetByDegrees: Date = this.getSeaLevelSunrise();
        const offsetByTime: Date = this.getTimeOffset(this.getSeaLevelSunrise(), -(minutes * AstronomicalCalendar.MINUTE_MILLIS));

        let degrees: Big = new Big(0);
        const incrementor: Big = new Big("0.0001");
        while (offsetByDegrees === null || offsetByDegrees.getTime() > offsetByTime.getTime()) {
            degrees = degrees.plus(incrementor);
            offsetByDegrees = this.getSunriseOffsetByDegrees(AstronomicalCalendar.GEOMETRIC_ZENITH + Number.parseFloat(degrees.valueOf()));
        }
        return Number.parseFloat(degrees.valueOf());
    }

    /**
     * Returns the dip below the horizon after sunset that matches the offset minutes on passed in as a parameter. For
     * example passing in 72 minutes for a calendar set to the equinox in Jerusalem returns a value close to 16.1&deg;
     * Please note that this method is very slow and inefficient and should NEVER be used in a loop. TODO: Improve
     * efficiency.
     *
     * @param minutes
     *            offset
     * @return the degrees below the horizon after sunset that match the offset in minutes passed it as a parameter.
     * @see #getSunriseSolarDipFromOffset(double)
     */
    public getSunsetSolarDipFromOffset(minutes: number): number {
        let offsetByDegrees: Date = this.getSeaLevelSunset();
        const offsetByTime: Date = this.getTimeOffset(this.getSeaLevelSunset(), minutes * AstronomicalCalendar.MINUTE_MILLIS);

        let degrees: Big = new Big(0);
        const incrementor: Big = new Big("0.001");
        while (offsetByDegrees === null || offsetByDegrees.getTime() < offsetByTime.getTime()) {
            degrees = degrees.plus(incrementor);
            offsetByDegrees = this.getSunsetOffsetByDegrees(AstronomicalCalendar.GEOMETRIC_ZENITH + Number.parseFloat(degrees.valueOf()));
        }
        return Number.parseFloat(degrees.valueOf());
    }

    /**
     * @return an XML formatted representation of the class. It returns the default output of the
     *         {@link net.sourceforge.zmanim.util.ZmanimFormatter#toXML(AstronomicalCalendar) toXML} method.
     * @see net.sourceforge.zmanim.util.ZmanimFormatter#toXML(AstronomicalCalendar)
     * @see java.lang.Object#toString()
     * @deprecated  This depends on a circular dependency. Use <pre>ZmanimFormatter.toXML(astronomicalCalendar)</pre> instead.
     */
    public toString(): void {
        throw new Error("This method is deprecated, due to the fact that it depends on a circular dependency.");
    }

    /**
     * @return a JSON formatted representation of the class. It returns the default output of the
     *         {@link net.sourceforge.zmanim.util.ZmanimFormatter#toJSON(AstronomicalCalendar) toJSON} method.
     * @see net.sourceforge.zmanim.util.ZmanimFormatter#toJSON(AstronomicalCalendar)
     * @see java.lang.Object#toString()
     * @deprecated  This depends on a circular dependency. Use <pre>ZmanimFormatter.toJSON(astronomicalCalendar)</pre> instead.
     */
    public toJSON(): void {
        throw new Error("This method is deprecated, due to the fact that it depends on a circular dependency.");
    }

    /**
     * @see java.lang.Object#equals(Object)
     */
    public equals(object: object): boolean {
        if (this === object) {
            return true;
        }
        if (!(object instanceof AstronomicalCalendar)) {
            return false;
        }
        const aCal: AstronomicalCalendar = object as AstronomicalCalendar;
        return this.getMoment() === aCal.getMoment() && this.getGeoLocation().equals(aCal.getGeoLocation())
            && this.getAstronomicalCalculator() === aCal.getAstronomicalCalculator();
    }

    /**
     * A method that returns the currently set {@link GeoLocation} which contains location information used for the
     * astronomical calculations.
     *
     * @return Returns the geoLocation.
     */
    public getGeoLocation(): GeoLocation {
        return this.geoLocation;
    }

    /**
     * Sets the {@link GeoLocation} <code>Object</code> to be used for astronomical calculations.
     *
     * @param geoLocation
     *            The geoLocation to set.
     */
    public setGeoLocation(geoLocation: GeoLocation): void {
        this.geoLocation = geoLocation;
        this.moment.tz(geoLocation.getTimeZone());
    }

    /**
     * A method that returns the currently set AstronomicalCalculator.
     *
     * @return Returns the astronomicalCalculator.
     * @see #setAstronomicalCalculator(AstronomicalCalculator)
     */
    public getAstronomicalCalculator(): AstronomicalCalculator {
        return this.astronomicalCalculator;
    }

    /**
     * A method to set the {@link AstronomicalCalculator} used for astronomical calculations. The Zmanim package ships
     * with a number of different implementations of the <code>abstract</code> {@link AstronomicalCalculator} based on
     * different algorithms, including {@link net.sourceforge.zmanim.util.SunTimesCalculator one implementation} based
     * on the <a href = "http://aa.usno.navy.mil/">US Naval Observatory's</a> algorithm, and
     * {@link net.sourceforge.zmanim.util.NOAACalculator another} based on <a href="http://noaa.gov">NOAA's</a>
     * algorithm. This allows easy runtime switching and comparison of different algorithms.
     *
     * @param astronomicalCalculator
     *            The astronomicalCalculator to set.
     */
    public setAstronomicalCalculator(astronomicalCalculator: AstronomicalCalculator): void {
        this.astronomicalCalculator = astronomicalCalculator;
    }

    /**
     * returns the Calendar object encapsulated in this class.
     *
     * @return Returns the calendar.
     */
    public getMoment(): MomentTimezone.Moment {
        return this.moment;
    }

    /**
     * @param calendar
     *            The calendar to set.
     */
    public setMoment(moment: Moment): void {
        this.moment = moment;
        if (this.getGeoLocation() != null) {
            // if available set the Calendar's timezone to the GeoLocation TimeZone
            this.moment = this.moment.tz(this.getGeoLocation().getTimeZone());
        }
    }

    /**
     * A method that creates a <a href="http://en.wikipedia.org/wiki/Object_copy#Deep_copy">deep copy</a> of the object.
     * <b>Note:</b> If the {@link java.util.TimeZone} in the cloned {@link net.sourceforge.zmanim.util.GeoLocation} will
     * be changed from the original, it is critical that
     * {@link net.sourceforge.zmanim.AstronomicalCalendar#getCalendar()}.
     * {@link java.util.Calendar#setTimeZone(TimeZone) setTimeZone(TimeZone)} be called in order for the
     * AstronomicalCalendar to output times in the expected offset after being cloned.
     *
     * @see java.lang.Object#clone()
     * @since 1.1
     */
    public clone(): AstronomicalCalendar {
        const clonedCalendar: AstronomicalCalendar = new AstronomicalCalendar();
        clonedCalendar.setMoment(this.moment);
        clonedCalendar.setAstronomicalCalculator(this.astronomicalCalculator);
        clonedCalendar.setGeoLocation(this.geoLocation);

        return clonedCalendar;
    }

    public getClassName() {
        return "net.sourceforge.zmanim.AstronomicalCalendar";
    }
}

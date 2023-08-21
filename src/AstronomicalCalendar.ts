import { Big } from 'big.js';
import { DateTime } from 'luxon';

import { Long_MIN_VALUE, TimeZone } from './polyfills/Utils';
import { GeoLocation } from './util/GeoLocation';
import { AstronomicalCalculator } from './util/AstronomicalCalculator';
import { NOAACalculator } from './util/NOAACalculator';
import { IllegalArgumentException, UnsupportedError } from './polyfills/errors';
import getRawOffset = TimeZone.getRawOffset;

/**
 * A Java calendar that calculates astronomical times such as {@link #getSunrise() sunrise} and {@link #getSunset()
 * sunset} times. This class contains a {@link #getCalendar() Calendar} and can therefore use the standard Calendar
 * functionality to change dates etc. The calculation engine used to calculate the astronomical times can be changed
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
export class AstronomicalCalendar {
  /**
   * 90&deg; below the vertical. Used as a basis for most calculations since the location of the sun is 90&deg; below
   * the horizon at sunrise and sunset.
   * <b>Note </b>: it is important to note that for sunrise and sunset the {@link AstronomicalCalculator#adjustZenith
   * adjusted zenith} is required to account for the radius of the sun and refraction. The adjusted zenith should not
   * be used for calculations above or below 90&deg; since they are usually calculated as an offset to 90&deg;.
   */
  public static readonly GEOMETRIC_ZENITH: number = 90;

  /** Sun's zenith at civil twilight (96&deg;). */
  public static readonly CIVIL_ZENITH: number = 96;

  /** Sun's zenith at nautical twilight (102&deg;). */
  public static readonly NAUTICAL_ZENITH: number = 102;

  /** Sun's zenith at astronomical twilight (108&deg;). */
  public static readonly ASTRONOMICAL_ZENITH: number = 108;

  /** constant for milliseconds in a minute (60,000) */
  public static readonly MINUTE_MILLIS: number = 60 * 1000;

  /** constant for milliseconds in an hour (3,600,000) */
  public static readonly HOUR_MILLIS: number = AstronomicalCalendar.MINUTE_MILLIS * 60;

  /**
   * The Java Calendar encapsulated by this class to track the current date used by the class
   */
  private date!: DateTime;

  /**
   * the {@link GeoLocation} used for calculations.
   */
  private geoLocation!: GeoLocation;

  /**
   * the internal {@link AstronomicalCalculator} used for calculating solar based times.
   */
  private astronomicalCalculator!: AstronomicalCalculator;

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
  public getSunrise(): DateTime | null {
    const sunrise: number = this.getUTCSunrise(AstronomicalCalendar.GEOMETRIC_ZENITH);
    if (Number.isNaN(sunrise)) return null;
    return this.getDateFromTime(sunrise, true);
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
  public getSeaLevelSunrise(): DateTime | null {
    const sunrise: number = this.getUTCSeaLevelSunrise(AstronomicalCalendar.GEOMETRIC_ZENITH);
    if (Number.isNaN(sunrise)) return null;
    return this.getDateFromTime(sunrise, true);
  }

  /**
   * A method that returns the beginning of <a href="https://en.wikipedia.org/wiki/Twilight#Civil_twilight">civil twilight</a>
   * (dawn) using a zenith of {@link #CIVIL_ZENITH 96&deg;}.
   *
   * @return The <code>Date</code> of the beginning of civil twilight using a zenith of 96&deg;. If the calculation
   *         can't be computed, null will be returned. See detailed explanation on top of the page.
   * @see #CIVIL_ZENITH
   */
  public getBeginCivilTwilight(): DateTime | null {
    return this.getSunriseOffsetByDegrees(AstronomicalCalendar.CIVIL_ZENITH);
  }

  /**
   * A method that returns the beginning of <a href=
   * "https://en.wikipedia.org/wiki/Twilight#Nautical_twilight">nautical twilight</a> using a zenith of {@link
   * #NAUTICAL_ZENITH 102&deg;}.
   *
   * @return The <code>Date</code> of the beginning of nautical twilight using a zenith of 102&deg;. If the
   *         calculation can't be computed null will be returned. See detailed explanation on top of the page.
   * @see #NAUTICAL_ZENITH
   */
  public getBeginNauticalTwilight(): DateTime | null {
    return this.getSunriseOffsetByDegrees(AstronomicalCalendar.NAUTICAL_ZENITH);
  }

  /**
   * A method that returns the beginning of <a href=
   * "https://en.wikipedia.org/wiki/Twilight#Astronomical_twilight">astronomical twilight</a> using a zenith of
   * {@link #ASTRONOMICAL_ZENITH 108&deg;}.
   *
   * @return The <code>Date</code> of the beginning of astronomical twilight using a zenith of 108&deg;. If the
   *         calculation can't be computed, null will be returned. See detailed explanation on top of the page.
   * @see #ASTRONOMICAL_ZENITH
   */
  public getBeginAstronomicalTwilight(): DateTime | null {
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
  public getSunset(): DateTime | null {
    const sunset: number = this.getUTCSunset(AstronomicalCalendar.GEOMETRIC_ZENITH);
    if (Number.isNaN(sunset)) return null;
    return this.getDateFromTime(sunset, false);
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
  public getSeaLevelSunset(): DateTime | null {
    const sunset: number = this.getUTCSeaLevelSunset(AstronomicalCalendar.GEOMETRIC_ZENITH);
    if (Number.isNaN(sunset)) return null;
    return this.getDateFromTime(sunset, false);
  }

  /**
   * A method that returns the end of <a href="https://en.wikipedia.org/wiki/Twilight#Civil_twilight">civil twilight</a>
   * using a zenith of {@link #CIVIL_ZENITH 96&deg;}.
   *
   * @return The <code>Date</code> of the end of civil twilight using a zenith of {@link #CIVIL_ZENITH 96&deg;}. If
   *         the calculation can't be computed, null will be returned. See detailed explanation on top of the page.
   * @see #CIVIL_ZENITH
   */
  public getEndCivilTwilight(): DateTime | null {
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
  public getEndNauticalTwilight(): DateTime | null {
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
  public getEndAstronomicalTwilight(): DateTime | null {
    return this.getSunsetOffsetByDegrees(AstronomicalCalendar.ASTRONOMICAL_ZENITH);
  }

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
  public static getTimeOffset(time: DateTime | null, offset: number): DateTime | null {
    if (time === null || offset === Long_MIN_VALUE || Number.isNaN(offset)) {
      return null;
    }

    return time.plus({ milliseconds: offset });
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
  public getSunriseOffsetByDegrees(offsetZenith: number): DateTime | null {
    const dawn: number = this.getUTCSunrise(offsetZenith);
    if (Number.isNaN(dawn)) return null;
    return this.getDateFromTime(dawn, true);
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
  public getSunsetOffsetByDegrees(offsetZenith: number): DateTime | null {
    const sunset: number = this.getUTCSunset(offsetZenith);
    if (Number.isNaN(sunset)) return null;
    return this.getDateFromTime(sunset, false);
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
   * A constructor that takes in <a href="https://en.wikipedia.org/wiki/Geolocation">geolocation</a> information as a
   * parameter. The default {@link AstronomicalCalculator#getDefault() AstronomicalCalculator} used for solar
   * calculations is the the {@link NOAACalculator}.
   *
   * @param geoLocation
   *            The location information used for calculating astronomical sun times.
   *
   * @see #setAstronomicalCalculator(AstronomicalCalculator) for changing the calculator class.
   */
  constructor(geoLocation: GeoLocation = new GeoLocation()) {
    this.setDate(DateTime.fromObject({ zone: geoLocation.getTimeZone() }));
    this.setGeoLocation(geoLocation); // duplicate call
    this.setAstronomicalCalculator(new NOAACalculator());
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
    return this.getAstronomicalCalculator()
      .getUTCSunrise(this.getAdjustedDate(), this.getGeoLocation(), zenith, true);
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
    return this.getAstronomicalCalculator()
      .getUTCSunrise(this.getAdjustedDate(), this.getGeoLocation(), zenith, false);
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
    return this.getAstronomicalCalculator()
      .getUTCSunset(this.getAdjustedDate(), this.getGeoLocation(), zenith, true);
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
    return this.getAstronomicalCalculator()
      .getUTCSunset(this.getAdjustedDate(), this.getGeoLocation(), zenith, false);
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
  public getTemporalHour(startOfday: DateTime | null = this.getSeaLevelSunrise(),
                         endOfDay: DateTime | null = this.getSeaLevelSunset()): number {
    if (startOfday === null || endOfDay === null) {
      return Long_MIN_VALUE;
    }
    return (endOfDay.valueOf() - startOfday.valueOf()) / 12;
  }

  /**
   * A method that returns sundial or solar noon. It occurs when the Sun is <a href
   * ="https://en.wikipedia.org/wiki/Transit_%28astronomy%29">transiting</a> the <a
   * href="https://en.wikipedia.org/wiki/Meridian_%28astronomy%29">celestial meridian</a>. In this class it is
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
   * A method that returns sundial or solar noon. It occurs when the Sun is <a href=
   * "https://en.wikipedia.org/wiki/Transit_%28astronomy%29">transiting</a> the <a
   * href="https://en.wikipedia.org/wiki/Meridian_%28astronomy%29">celestial meridian</a>. The calculations used by
   * this class depend on the {@link AstronomicalCalculator} used. If this calendar instance is {@link
   * #setAstronomicalCalculator(AstronomicalCalculator) set} to use the {@link com.kosherjava.zmanim.util.NOAACalculator}
   * (the default) it will calculate astronomical noon. If the calendar instance is  to use the
   * {@link com.kosherjava.zmanim.util.SunTimesCalculator}, that does not have code to calculate astronomical noon, the
   * sun transit is calculated as halfway between sea level sunrise and sea level sunset, which can be slightly off the
   * real transit time due to changes in declination (the lengthening or shortening day). See <a href=
   * "https://kosherjava.com/2020/07/02/definition-of-chatzos/">The Definition of Chatzos</a> for details on the proper
   * definition of solar noon / midday.
   *
   * @return the <code>Date</code> representing Sun's transit. If the calculation can't be computed such as in the
   *         Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
   *         not set, null will be returned. See detailed explanation on top of the page.
   * @see #getSunTransit(Date, Date)
   * @see #getTemporalHour()
   */
  public getSunTransit(): DateTime | null;
  public getSunTransit(startOfDay: DateTime | null, endOfDay: DateTime | null): DateTime | null;
  public getSunTransit(startOfDay?: DateTime | null, endOfDay?: DateTime | null): DateTime | null {
    if (startOfDay === undefined && endOfDay === undefined) {
      const noon = this.getAstronomicalCalculator().getUTCNoon(this.getAdjustedDate(), this.getGeoLocation());
      return this.getDateFromTime(noon, false);
    }

    const temporalHour: number = this.getTemporalHour(startOfDay, endOfDay);
    return AstronomicalCalendar.getTimeOffset(startOfDay as DateTime | null, temporalHour * 6);
  }

  /**
   * A method that returns a <code>Date</code> from the time passed in as a parameter.
   *
   * @param time
   *            The time to be set as the time for the <code>Date</code>. The time expected is in the format: 18.75
   *            for 6:45:00 PM.
   * @param isSunrise true if the time is sunrise, and false if it is sunset
   * @return The Date.
   */
  protected getDateFromTime(time: number, isSunrise: boolean): DateTime | null {
    if (Number.isNaN(time)) {
      return null;
    }
    let calculatedTime: number = time;

    const adjustedDate: DateTime = this.getAdjustedDate();
    let cal = DateTime.utc(adjustedDate.year, adjustedDate.month, adjustedDate.day);

    const hours: number = Math.trunc(calculatedTime); // retain only the hours
    calculatedTime -= hours;
    const minutes: number = Math.trunc(calculatedTime *= 60); // retain only the minutes
    calculatedTime -= minutes;
    const seconds: number = Math.trunc(calculatedTime *= 60); // retain only the seconds
    calculatedTime -= seconds; // remaining milliseconds

    // Check if a date transition has occurred, or is about to occur - this indicates the date of the event is
    // actually not the target date, but the day prior or after
    const localTimeHours: number = Math.trunc(this.getGeoLocation().getLongitude() / 15);
    if (isSunrise && localTimeHours + hours > 18) {
      cal = cal.minus({ days: 1 });
    } else if (!isSunrise && localTimeHours + hours < 6) {
      cal = cal.plus({ days: 1 });
    }

    return cal.set({
      hour: hours,
      minute: minutes,
      second: seconds,
      millisecond: Math.trunc(calculatedTime * 1000),
    });
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
  public getSunriseSolarDipFromOffset(minutes: number): number | null {
    if (Number.isNaN(minutes)) return null;

    let offsetByDegrees: DateTime | null = this.getSeaLevelSunrise();
    const offsetByTime: DateTime | null = AstronomicalCalendar.getTimeOffset(this.getSeaLevelSunrise(), -(minutes * AstronomicalCalendar.MINUTE_MILLIS));

    let degrees: Big = new Big(0);
    const incrementor: Big = new Big('0.0001');

    // If `minutes` is not `NaN` and `offsetByDegrees` is not null, `offsetByTime` should not be null
    while (offsetByDegrees === null || ((minutes < 0 && offsetByDegrees < offsetByTime!)
      || (minutes > 0 && offsetByDegrees > offsetByTime!))) {
      if (minutes > 0) {
        degrees = degrees.add(incrementor);
      } else {
        degrees = degrees.sub(incrementor);
      }

      offsetByDegrees = this.getSunriseOffsetByDegrees(AstronomicalCalendar.GEOMETRIC_ZENITH + degrees.toNumber());
    }

    return degrees.toNumber();
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
  public getSunsetSolarDipFromOffset(minutes: number): number | null {
    if (Number.isNaN(minutes)) return null;

    let offsetByDegrees: DateTime | null = this.getSeaLevelSunset();
    const offsetByTime: DateTime | null = AstronomicalCalendar.getTimeOffset(this.getSeaLevelSunset(), minutes * AstronomicalCalendar.MINUTE_MILLIS);

    let degrees: Big = new Big(0);
    const incrementor: Big = new Big('0.001');

    // If `minutes` is not `NaN` and `offsetByDegrees` is not null, `offsetByTime` should not be null
    while (offsetByDegrees == null || ((minutes > 0 && offsetByDegrees < offsetByTime!)
      || (minutes < 0 && offsetByDegrees > offsetByTime!))) {
      if (minutes > 0) {
        degrees = degrees.add(incrementor);
      } else {
        degrees = degrees.sub(incrementor);
      }

      offsetByDegrees = this.getSunsetOffsetByDegrees(AstronomicalCalendar.GEOMETRIC_ZENITH + degrees.toNumber());
    }

    return degrees.toNumber();
  }

  /**
   * A method that returns <a href="https://en.wikipedia.org/wiki/Local_mean_time">local mean time (LMT)</a> time
   * converted to regular clock time for the number of hours (0.0 to 23.999...) passed to this method. This time is
   * adjusted from standard time to account for the local latitude. The 360&deg; of the globe divided by 24 calculates
   * to 15&deg; per hour with 4 minutes per degree, so at a longitude of 0 , 15, 30 etc... noon is at exactly 12:00pm.
   * Lakewood, N.J., with a longitude of -74.222, is 0.7906 away from the closest multiple of 15 at -75&deg;. This is
   * multiplied by 4 clock minutes (per degree) to yield 3 minutes and 7 seconds for a noon time of 11:56:53am. This
   * method is not tied to the theoretical 15&deg; time zones, but will adjust to the actual time zone and <a href=
   * "https://en.wikipedia.org/wiki/Daylight_saving_time">Daylight saving time</a> to return LMT.
   *
   * @param hours
   * 			the hour (such as 12.0 for noon and 0.0 for midnight) to calculate as LMT. Valid values are in the range of
   * 			0.0 to 23.999.... An IllegalArgumentException will be thrown if the value does not fit in the expected range.
   * @return the Date representing the local mean time (LMT) for the number of hours passed in. In Lakewood, NJ, passing 12
   *         (noon) will return 11:56:50am.
   * @see GeoLocation#getLocalMeanTimeOffset()
   */
  public getLocalMeanTime(hours: number): DateTime | null {
    if (hours < 0 || hours >= 24) {
      throw new IllegalArgumentException('Hours must between 0 and 23.9999...');
    }

    return AstronomicalCalendar.getTimeOffset(this.getDateFromTime(hours - getRawOffset(this.getGeoLocation().getTimeZone())
        / AstronomicalCalendar.HOUR_MILLIS, true), -this.getGeoLocation().getLocalMeanTimeOffset());
  }

  /**
   * Adjusts the <code>Calendar</code> to deal with edge cases where the location crosses the antimeridian.
   *
   * @see GeoLocation#getAntimeridianAdjustment()
   * @return the adjusted Calendar
   */
  private getAdjustedDate(): DateTime {
    const offset: -1 | 0 | 1 = this.getGeoLocation().getAntimeridianAdjustment();
    if (offset === 0) return this.getDate();
    return this.getDate().plus({ days: offset });
  }

  /**
   * @return an XML formatted representation of the class. It returns the default output of the
   *         {@link ZmanimFormatter#toXML(AstronomicalCalendar) toXML} method.
   * @see ZmanimFormatter#toXML(AstronomicalCalendar)
   * @see java.lang.Object#toString()
   * @deprecated (This depends on a circular dependency).
   */
  // eslint-disable-next-line class-methods-use-this
  public toString(): void {
    throw new UnsupportedError('This method is unsupported, due to the fact that it depends on a circular dependency.');
  }

  /**
   * @return a JSON formatted representation of the class. It returns the default output of the
   *         {@link ZmanimFormatter#toJSON(AstronomicalCalendar) toJSON} method.
   * @see ZmanimFormatter#toJSON(AstronomicalCalendar)
   * @see java.lang.Object#toString()
   * @deprecated  This depends on a circular dependency. Use <pre>ZmanimFormatter.toJSON(astronomicalCalendar)</pre> instead.
   */
  // eslint-disable-next-line class-methods-use-this
  public toJSON(): void {
    throw new UnsupportedError('This method is unsupported, due to the fact that it depends on a circular dependency. '
      + 'Use `ZmanimFormatter.toJSON(astronomicalCalendar)` instead.');
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
    return this.getDate().equals(aCal.getDate()) && this.getGeoLocation().equals(aCal.getGeoLocation())
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
   * @todo Possibly adjust for horizon elevation. It may be smart to just have the calculator check the GeoLocation
   *       though it doesn't really belong there.
   */
  public setGeoLocation(geoLocation: GeoLocation): void {
    this.geoLocation = geoLocation;
    this.date = this.date.setZone(geoLocation.getTimeZone());
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
   * different algorithms, including the default {@link com.kosherjava.zmanim.util.NOAACalculator} based on <a href=
   * "https://noaa.gov">NOAA's</a> implementation of Jean Meeus's algorithms as well as {@link
   * com.kosherjava.zmanim.util.SunTimesCalculator} based on the <a href = "https://www.cnmoc.usff.navy.mil/usno/">US
   * Naval Observatory's</a> algorithm. This allows easy runtime switching and comparison of different algorithms.
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
  public getDate(): DateTime {
    return this.date;
  }

  /**
   * @param calendar
   *            The calendar to set.
   */
  public setDate(date: DateTime | Date | string | number): void {
    if (DateTime.isDateTime(date)) {
      this.date = date;
    } else if (date instanceof Date) {
      this.date = DateTime.fromJSDate(date);
    } else if (typeof date === 'string') {
      this.date = DateTime.fromISO(date);
    } else if (typeof date === 'number') {
      this.date = DateTime.fromMillis(date);
    }
  }

  /**
   * A method that creates a <a href="https://en.wikipedia.org/wiki/Object_copy#Deep_copy">deep copy</a> of the object.
   * <b>Note:</b> If the {@link java.util.TimeZone} in the cloned {@link GeoLocation} will
   * be changed from the original, it is critical that
   * {@link AstronomicalCalendar#getCalendar()}.
   * {@link java.util.Calendar#setTimeZone(TimeZone) setTimeZone(TimeZone)} be called in order for the
   * AstronomicalCalendar to output times in the expected offset after being cloned.
   *
   * @see java.lang.Object#clone()
   */
  public clone(): AstronomicalCalendar {
    const clonedCalendar: AstronomicalCalendar = new AstronomicalCalendar();
    clonedCalendar.setDate(this.date);
    clonedCalendar.setAstronomicalCalculator(this.astronomicalCalculator);
    clonedCalendar.setGeoLocation(this.geoLocation);

    return clonedCalendar;
  }

  // eslint-disable-next-line class-methods-use-this
  public getClassName() {
    return 'com.kosherjava.zmanim.AstronomicalCalendar';
  }
}

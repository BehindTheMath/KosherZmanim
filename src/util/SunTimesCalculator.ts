import Calendar from "../polyfills/Calendar";
import GregorianCalendar from "../polyfills/GregorianCalendar";
import GeoLocation from "./GeoLocation";
import AstronomicalCalculator from "./AstronomicalCalculator";

/**
 * Implementation of sunrise and sunset methods to calculate astronomical times. This calculator uses the Java algorithm
 * written by <a href="http://web.archive.org/web/20090531215353/http://www.kevinboone.com/suntimes.html">Kevin
 * Boone</a> that is based on the <a href = "http://aa.usno.navy.mil/">US Naval Observatory's</a><a
 * href="http://aa.usno.navy.mil/publications/docs/asa.php">Almanac</a> for Computer algorithm ( <a
 * href="http://www.amazon.com/exec/obidos/tg/detail/-/0160515106/">Amazon</a>, <a
 * href="http://search.barnesandnoble.com/booksearch/isbnInquiry.asp?isbn=0160515106">Barnes &amp; Noble</a>) and is
 * used with his permission. Added to Kevin's code is adjustment of the zenith to account for elevation.
 *
 * @author &copy; Eliyahu Hershfeld 2004 - 2011
 * @author &copy; Kevin Boone 2000
 * @version 1.1
 */
export default class SunTimesCalculator extends AstronomicalCalculator {
    /**
     * @see net.sourceforge.zmanim.util.AstronomicalCalculator#getCalculatorName()
     */
    public getCalculatorName(): string {
        return "US Naval Almanac Algorithm";
    }

    /**
     * @see net.sourceforge.zmanim.util.AstronomicalCalculator#getUTCSunrise(Calendar, GeoLocation, double, boolean)
     */
    public getUTCSunrise(calendar: GregorianCalendar, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean): number {
        let doubleTime: number = Number.NaN;
        const elevation: number = adjustForElevation ? geoLocation.getElevation() : 0;
        const adjustedZenith: number = this.adjustZenith(zenith, elevation);

        doubleTime = SunTimesCalculator.getTimeUTC(calendar, geoLocation.getLongitude(), geoLocation.getLatitude(),
                adjustedZenith, true);
        return doubleTime;
    }

    /**
     * @see net.sourceforge.zmanim.util.AstronomicalCalculator#getUTCSunset(Calendar, GeoLocation, double, boolean)
     */
    public getUTCSunset(calendar: GregorianCalendar, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean): number {
        let doubleTime: number = Number.NaN;
        const elevation: number = adjustForElevation ? geoLocation.getElevation() : 0;
        const adjustedZenith: number = this.adjustZenith(zenith, elevation);

        doubleTime = SunTimesCalculator.getTimeUTC(calendar, geoLocation.getLongitude(), geoLocation.getLatitude(),
                adjustedZenith, false);
        return doubleTime;
    }

    /**
     * The number of degrees of longitude that corresponds to one hour time difference.
     */
    private static readonly DEG_PER_HOUR: number = 360 / 24;

    /**
     * sin of an angle in degrees
     */
    private static sinDeg(deg: number): number {
        return Math.sin(deg * 2 * Math.PI / 360);
    }

    /**
     * acos of an angle, result in degrees
     */
    private static acosDeg(x: number): number {
        return Math.acos(x) * 360 / (2 * Math.PI);
    }

    /**
     * asin of an angle, result in degrees
     */
    private static asinDeg(x: number): number {
        return Math.asin(x) * 360 / (2 * Math.PI);
    }

    /**
     * tan of an angle in degrees
     */
    private static tanDeg(deg: number): number {
        return Math.tan(deg * 2 * Math.PI / 360);
    }

    /**
     * cos of an angle in degrees
     */
    private static cosDeg(deg: number): number {
        return Math.cos(deg * 2 * Math.PI / 360);
    }

    /**
     * Get time difference between location's longitude and the Meridian, in hours. West of Meridian has a negative time
     * difference
     */
    private static getHoursFromMeridian(longitude: number): number {
        return longitude / SunTimesCalculator.DEG_PER_HOUR;
    }

    /**
     * Gets the approximate time of sunset or sunrise In _days_ since midnight Jan 1st, assuming 6am and 6pm events. We
     * need this figure to derive the Sun's mean anomaly
     */
    private static getApproxTimeDays(dayOfYear: number, hoursFromMeridian: number, isSunrise: boolean): number {
        if (isSunrise) {
            return dayOfYear + ((6 - hoursFromMeridian) / 24);
        } else { // sunset
            return dayOfYear + ((18 - hoursFromMeridian) / 24);
        }
    }

    /**
     * Calculate the Sun's mean anomaly in degrees, at sunrise or sunset, given the longitude in degrees
     */
    private static getMeanAnomaly(dayOfYear: number, longitude: number, isSunrise: boolean): number {
        return (0.9856 * SunTimesCalculator.getApproxTimeDays(dayOfYear, SunTimesCalculator.getHoursFromMeridian(longitude), isSunrise)) - 3.289;
    }

    /**
     * Calculates the Sun's true longitude in degrees. The result is an angle gte 0 and lt 360. Requires the Sun's mean
     * anomaly, also in degrees
     */
    private static getSunTrueLongitude(sunMeanAnomaly: number): number {
        let l: number = sunMeanAnomaly + (1.916 * SunTimesCalculator.sinDeg(sunMeanAnomaly)) + (0.020 * SunTimesCalculator.sinDeg(2 * sunMeanAnomaly)) + 282.634;

        // get longitude into 0-360 degree range
        if (l >= 360) {
            l = l - 360;
        }
        if (l < 0) {
            l = l + 360;
        }
        return l;
    }

    /**
     * Calculates the Sun's right ascension in hours, given the Sun's true longitude in degrees. Input and output are
     * angles gte 0 and lt 360.
     */
    private static getSunRightAscensionHours(sunTrueLongitude: number): number {
        const a: number = 0.91764 * SunTimesCalculator.tanDeg(sunTrueLongitude);
        let ra: number = 360 / (2 * Math.PI) * Math.atan(a);

        const lQuadrant: number = Math.trunc(sunTrueLongitude / 90) * 90;
        const raQuadrant: number = Math.trunc(ra / 90) * 90;
        ra = ra + (lQuadrant - raQuadrant);

        return ra / SunTimesCalculator.DEG_PER_HOUR; // convert to hours
    }

    /**
     * Gets the cosine of the Sun's local hour angle
     */
    private static getCosLocalHourAngle(sunTrueLongitude: number, latitude: number, zenith: number): number {
        const sinDec: number = 0.39782 * SunTimesCalculator.sinDeg(sunTrueLongitude);
        const cosDec: number = SunTimesCalculator.cosDeg(SunTimesCalculator.asinDeg(sinDec));
        return (SunTimesCalculator.cosDeg(zenith) - (sinDec * SunTimesCalculator.sinDeg(latitude))) / (cosDec * SunTimesCalculator.cosDeg(latitude));
    }

    /**
     * Calculate local mean time of rising or setting. By `local' is meant the exact time at the location, assuming that
     * there were no time zone. That is, the time difference between the location and the Meridian depended entirely on
     * the longitude. We can't do anything with this time directly; we must convert it to UTC and then to a local time.
     * The result is expressed as a fractional number of hours since midnight
     */
    private static getLocalMeanTime(localHour: number, sunRightAscensionHours: number, approxTimeDays: number): number {
        return localHour + sunRightAscensionHours - (0.06571 * approxTimeDays) - 6.622;
    }

    /**
     * Get sunrise or sunset time in UTC, according to flag.
     *
     * @param year
     *            4-digit year
     * @param month
     *            month, 1-12 (not the zero based Java month
     * @param day
     *            day of month, 1-31
     * @param longitude
     *            in degrees, longitudes west of Meridian are negative
     * @param latitude
     *            in degrees, latitudes south of equator are negative
     * @param zenith
     *            Sun's zenith, in degrees
     * @param type
     *            type of calculation to carry out {@link #TYPE_SUNRISE} or {@link #TYPE_SUNRISE}.
     *
     * @return the time as a double. If an error was encountered in the calculation (expected behavior for some
     *         locations such as near the poles, {@link Double.NaN} will be returned.
     */
    private static getTimeUTC(calendar: GregorianCalendar, longitude: number, latitude: number, zenith: number,
            isSunrise: boolean): number {
        const dayOfYear: number = calendar.get(Calendar.DAY_OF_YEAR);
        const sunMeanAnomaly: number = SunTimesCalculator.getMeanAnomaly(dayOfYear, longitude, isSunrise);
        const sunTrueLong: number = SunTimesCalculator.getSunTrueLongitude(sunMeanAnomaly);
        const sunRightAscensionHours: number = SunTimesCalculator.getSunRightAscensionHours(sunTrueLong);
        const cosLocalHourAngle: number = SunTimesCalculator.getCosLocalHourAngle(sunTrueLong, latitude, zenith);

        let localHourAngle: number = 0;
        if (isSunrise) {
            localHourAngle = 360 - SunTimesCalculator.acosDeg(cosLocalHourAngle);
        } else { // sunset
            localHourAngle = SunTimesCalculator.acosDeg(cosLocalHourAngle);
        }
        const localHour: number = localHourAngle / SunTimesCalculator.DEG_PER_HOUR;

        const localMeanTime: number = SunTimesCalculator.getLocalMeanTime(localHour, sunRightAscensionHours,
                SunTimesCalculator.getApproxTimeDays(dayOfYear, SunTimesCalculator.getHoursFromMeridian(longitude), isSunrise));
        let pocessedTime: number = localMeanTime - SunTimesCalculator.getHoursFromMeridian(longitude);
        while (pocessedTime < 0) {
            pocessedTime += 24;
        }
        while (pocessedTime >= 24) {
            pocessedTime -= 24;
        }
        return pocessedTime;
    }
}

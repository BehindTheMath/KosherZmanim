import AstronomicalCalculator from "./AstronomicalCalculator";
import Calendar from "../polyfills/Calendar";
import GeoLocation from "./GeoLocation";
import GregorianCalendar from "../polyfills/GregorianCalendar";

/**
 * Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
 * href="http://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
 * href="http://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>'s <a href =
 * "http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA's <a
 * href="http://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
 * href="http://www.willbell.com/math/mc1.htm">Astronomical Algorithms</a> by <a
 * href="http://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
 * to account for elevation. The algorithm can be found in the <a
 * href="http://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.
 * 
 * @author &copy; Eliyahu Hershfeld 2011 - 2014
 * @version 0.1
 */
export default class NOAACalculator extends AstronomicalCalculator {
    /**
     * The <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a> of January 1, 2000
     */
    private static readonly JULIAN_DAY_JAN_1_2000: number = 2451545.0;

    /**
     * Julian days per century
     */
    private static readonly JULIAN_DAYS_PER_CENTURY: number = 36525.0;

    /**
     * @see net.sourceforge.zmanim.util.AstronomicalCalculator#getCalculatorName()
     */
    public getCalculatorName(): string {
        return "US National Oceanic and Atmospheric Administration Algorithm";
    }

    /**
     * @see net.sourceforge.zmanim.util.AstronomicalCalculator#getUTCSunrise(Calendar, GeoLocation, double, boolean)
     */
    public getUTCSunrise(calendar: GregorianCalendar, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean): number {
        const elevation: number = adjustForElevation ? geoLocation.getElevation() : 0;
        const adjustedZenith: number = this.adjustZenith(zenith, elevation);

        let sunrise: number = NOAACalculator.getSunriseUTC(NOAACalculator.getJulianDay(calendar), geoLocation.getLatitude(), -geoLocation.getLongitude(),
                adjustedZenith);
        sunrise = sunrise / 60;

        // ensure that the time is >= 0 and < 24
        while (sunrise < 0.0) {
            sunrise += 24.0;
        }
        while (sunrise >= 24.0) {
            sunrise -= 24.0;
        }
        return sunrise;
    }

    /**
     * @see net.sourceforge.zmanim.util.AstronomicalCalculator#getUTCSunset(Calendar, GeoLocation, double, boolean)
     */
    public getUTCSunset(calendar: GregorianCalendar, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean): number {
        const elevation: number = adjustForElevation ? geoLocation.getElevation() : 0;
        const adjustedZenith: number = this.adjustZenith(zenith, elevation);

        let sunset: number = NOAACalculator.getSunsetUTC(NOAACalculator.getJulianDay(calendar), geoLocation.getLatitude(), -geoLocation.getLongitude(),
                adjustedZenith);
        sunset = sunset / 60;

        // ensure that the time is >= 0 and < 24
        while (sunset < 0.0) {
            sunset += 24.0;
        }
        while (sunset >= 24.0) {
            sunset -= 24.0;
        }
        return sunset;
    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a> from a Java Calendar
     *
     * @param calendar
     *            The Java Calendar
     * @return the Julian day corresponding to the date Note: Number is returned for start of day. Fractional days
     *         should be added later.
     */
    private static getJulianDay(calendar: GregorianCalendar): number {
        let year: number = calendar.get(Calendar.YEAR);
        let month: number = calendar.get(Calendar.MONTH) + 1;
        const day: number = calendar.get(Calendar.DAY_OF_MONTH);
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        const a: number = year / 100;
        const b: number = 2 - a + a / 4;

        return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
    }

    /**
     * Convert <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a> to centuries since J2000.0.
     *
     * @param julianDay
     *            the Julian Day to convert
     * @return the centuries since 2000 Julian corresponding to the Julian Day
     */
    private static getJulianCenturiesFromJulianDay(julianDay: number): number {
        return (julianDay - NOAACalculator.JULIAN_DAY_JAN_1_2000) / NOAACalculator.JULIAN_DAYS_PER_CENTURY;
    }

    /**
     * Convert centuries since J2000.0 to <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a>.
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @return the Julian Day corresponding to the Julian centuries passed in
     */
    private static getJulianDayFromJulianCenturies(julianCenturies: number): number {
        return julianCenturies * NOAACalculator.JULIAN_DAYS_PER_CENTURY + NOAACalculator.JULIAN_DAY_JAN_1_2000;
    }

    /**
     * Returns the Geometric <a href="http://en.wikipedia.org/wiki/Mean_longitude">Mean Longitude</a> of the Sun.
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @return the Geometric Mean Longitude of the Sun in degrees
     */
    private static getSunGeometricMeanLongitude(julianCenturies: number): number {
        let longitude: number = 280.46646 + julianCenturies * (36000.76983 + 0.0003032 * julianCenturies);
        while (longitude > 360.0) {
            longitude -= 360.0;
        }
        while (longitude < 0.0) {
            longitude += 360.0;
        }

        return longitude; // in degrees
    }

    /**
     * Returns the Geometric <a href="http://en.wikipedia.org/wiki/Mean_anomaly">Mean Anomaly</a> of the Sun.
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @return the Geometric Mean Anomaly of the Sun in degrees
     */
    private static getSunGeometricMeanAnomaly(julianCenturies: number): number {
        return 357.52911 + julianCenturies * (35999.05029 - 0.0001537 * julianCenturies); // in degrees
    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Eccentricity_%28orbit%29">eccentricity of earth's orbit</a>.
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @return the unitless eccentricity
     */
    private static getEarthOrbitEccentricity(julianCenturies: number): number {
        return 0.016708634 - julianCenturies * (0.000042037 + 0.0000001267 * julianCenturies); // unitless
    }

    /**
     * Returns the <a href="http://en.wikipedia.org/wiki/Equation_of_the_center">equation of center</a> for the sun.
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @return the equation of center for the sun in degrees
     */
    private static getSunEquationOfCenter(julianCenturies: number): number {
        const m: number = NOAACalculator.getSunGeometricMeanAnomaly(julianCenturies);

        const mrad: number = Math.toRadians(m);
        const sinm: number = Math.sin(mrad);
        const sin2m: number = Math.sin(mrad + mrad);
        const sin3m: number = Math.sin(mrad + mrad + mrad);

        return sinm * (1.914602 - julianCenturies * (0.004817 + 0.000014 * julianCenturies)) + sin2m
                * (0.019993 - 0.000101 * julianCenturies) + sin3m * 0.000289; // in degrees
    }

    /**
     * Return the true longitude of the sun
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @return the sun's true longitude in degrees
     */
    private static getSunTrueLongitude(julianCenturies: number): number {
        const sunLongitude: number = NOAACalculator.getSunGeometricMeanLongitude(julianCenturies);
        const center: number = NOAACalculator.getSunEquationOfCenter(julianCenturies);

        return sunLongitude + center; // in degrees
    }

    // /**
    // * Returns the <a href="http://en.wikipedia.org/wiki/True_anomaly">true anamoly</a> of the sun.
    // *
    // * @param julianCenturies
    // * the number of Julian centuries since J2000.0
    // * @return the sun's true anamoly in degrees
    // */
    // private static double getSunTrueAnomaly(double julianCenturies) {
    // double meanAnomaly = getSunGeometricMeanAnomaly(julianCenturies);
    // double equationOfCenter = getSunEquationOfCenter(julianCenturies);
    //
    // return meanAnomaly + equationOfCenter; // in degrees
    // }

    /**
     * Return the apparent longitude of the sun
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @return sun's apparent longitude in degrees
     */
    private static getSunApparentLongitude(julianCenturies: number): number {
        const sunTrueLongitude: number = NOAACalculator.getSunTrueLongitude(julianCenturies);

        const omega: number = 125.04 - 1934.136 * julianCenturies;
        const lambda: number = sunTrueLongitude - 0.00569 - 0.00478 * Math.sin(Math.toRadians(omega));
        return lambda; // in degrees
    }

    /**
     * Returns the mean <a href="http://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial tilt).
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @return the mean obliquity in degrees
     */
    private static getMeanObliquityOfEcliptic(julianCenturies: number): number {
        const seconds: number = 21.448 - julianCenturies
                * (46.8150 + julianCenturies * (0.00059 - julianCenturies * (0.001813)));
        return 23.0 + (26.0 + (seconds / 60.0)) / 60.0; // in degrees
    }

    /**
     * Returns the corrected <a href="http://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial
     * tilt).
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @return the corrected obliquity in degrees
     */
    private static getObliquityCorrection(julianCenturies: number): number {
        const obliquityOfEcliptic: number = NOAACalculator.getMeanObliquityOfEcliptic(julianCenturies);

        const omega: number = 125.04 - 1934.136 * julianCenturies;
        return obliquityOfEcliptic + 0.00256 * Math.cos(Math.toRadians(omega)); // in degrees
    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Declination">declination</a> of the sun.
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @param sun
     *            's declination in degrees
     */
    private static getSunDeclination(julianCenturies: number): number {
        const obliquityCorrection: number = NOAACalculator.getObliquityCorrection(julianCenturies);
        const lambda: number = NOAACalculator.getSunApparentLongitude(julianCenturies);

        const sint: number = Math.sin(Math.toRadians(obliquityCorrection)) * Math.sin(Math.toRadians(lambda));
        const theta: number = Math.toDegrees(Math.asin(sint));
        return theta; // in degrees
    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Equation_of_time">Equation of Time</a> - the difference between
     * true solar time and mean solar time
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @return equation of time in minutes of time
     */
    private static getEquationOfTime(julianCenturies: number): number {
        const epsilon: number = NOAACalculator.getObliquityCorrection(julianCenturies);
        const geomMeanLongSun: number = NOAACalculator.getSunGeometricMeanLongitude(julianCenturies);
        const eccentricityEarthOrbit: number = NOAACalculator.getEarthOrbitEccentricity(julianCenturies);
        const geomMeanAnomalySun: number = NOAACalculator.getSunGeometricMeanAnomaly(julianCenturies);

        let y: number = Math.tan(Math.toRadians(epsilon) / 2.0);
        y *= y;

        const sin2l0: number = Math.sin(2.0 * Math.toRadians(geomMeanLongSun));
        const sinm: number = Math.sin(Math.toRadians(geomMeanAnomalySun));
        const cos2l0: number = Math.cos(2.0 * Math.toRadians(geomMeanLongSun));
        const sin4l0: number = Math.sin(4.0 * Math.toRadians(geomMeanLongSun));
        const sin2m: number = Math.sin(2.0 * Math.toRadians(geomMeanAnomalySun));

        const equationOfTime: number = y * sin2l0 - 2.0 * eccentricityEarthOrbit * sinm + 4.0 * eccentricityEarthOrbit * y
                * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * eccentricityEarthOrbit * eccentricityEarthOrbit * sin2m;
        return Math.toDegrees(equationOfTime) * 4.0; // in minutes of time
    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Hour_angle">hour angle</a> of the sun at sunrise for the
     * latitude.
     *
     * @param lat
     *            , the latitude of observer in degrees
     * @param solarDec
     *            the declination angle of sun in degrees
     * @return hour angle of sunrise in radians
     */
    private static getSunHourAngleAtSunrise(lat: number, solarDec: number, zenith: number): number {
        const latRad: number = Math.toRadians(lat);
        const sdRad: number = Math.toRadians(solarDec);

        return (Math.acos(Math.cos(Math.toRadians(zenith)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad)
                * Math.tan(sdRad))); // in radians
    }

    /**
     * Returns the <a href="http://en.wikipedia.org/wiki/Hour_angle">hour angle</a> of the sun at sunset for the
     * latitude. TODO: use - {@link #getSunHourAngleAtSunrise(double, double, double)} implementation to avoid
     * duplication of code.
     *
     * @param lat
     *            the latitude of observer in degrees
     * @param solarDec
     *            the declination angle of sun in degrees
     * @return the hour angle of sunset in radians
     */
    private static getSunHourAngleAtSunset(lat: number, solarDec: number, zenith: number): number {
        const latRad: number = Math.toRadians(lat);
        const sdRad: number = Math.toRadians(solarDec);

        const hourAngle: number = (Math.acos(Math.cos(Math.toRadians(zenith)) / (Math.cos(latRad) * Math.cos(sdRad))
                - Math.tan(latRad) * Math.tan(sdRad)));
        return -hourAngle; // in radians
    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Elevation</a> for the
     * horizontal coordinate system at the given location at the given time. Can be negative if the sun is below the
     * horizon. Not corrected for altitude.
     *
     * @param cal
     *            time of calculation
     * @param lat
     *            latitude of location for calculation
     * @param lon
     *            longitude of location for calculation
     * @return solar elevation in degrees - horizon is 0 degrees, civil twilight is -6 degrees
     */

    public static getSolarElevation(cal: GregorianCalendar, lat: number, lon: number): number {
        const julianDay: number = NOAACalculator.getJulianDay(cal);
        const julianCenturies: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

        const eot: number = NOAACalculator.getEquationOfTime(julianCenturies);

        let longitude: number = (cal.get(Calendar.HOUR_OF_DAY) + 12.0)
                + (cal.get(Calendar.MINUTE) + eot + cal.get(Calendar.SECOND) / 60.0) / 60.0;

        longitude = -(longitude * 360.0 / 24.0) % 360.0;
        const hourAngleRad: number = Math.toRadians(lon - longitude);
        const declination: number = NOAACalculator.getSunDeclination(julianCenturies);
        const decRad: number = Math.toRadians(declination);
        const latRad: number = Math.toRadians(lat);
        return Math.toDegrees(Math.asin((Math.sin(latRad) * Math.sin(decRad))
                + (Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad))));

    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Azimuth</a> for the
     * horizontal coordinate system at the given location at the given time. Not corrected for altitude. True south is 0
     * degrees.
     *
     * @param cal
     *            time of calculation
     * @param lat
     *            latitude of location for calculation
     * @param lon
     *            longitude of location for calculation
     * @return FIXME
     */

    public static getSolarAzimuth(cal: GregorianCalendar, lat: number, lon: number): number {
        const julianDay: number = NOAACalculator.getJulianDay(cal);
        const julianCenturies: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

        const eot: number = NOAACalculator.getEquationOfTime(julianCenturies);

        let longitude: number = (cal.get(Calendar.HOUR_OF_DAY) + 12.0)
                + (cal.get(Calendar.MINUTE) + eot + cal.get(Calendar.SECOND) / 60.0) / 60.0;

        longitude = -(longitude * 360.0 / 24.0) % 360.0;
        const hourAngleRad: number = Math.toRadians(lon - longitude);
        const declination: number = NOAACalculator.getSunDeclination(julianCenturies);
        const decRad: number = Math.toRadians(declination);
        const latRad: number = Math.toRadians(lat);

        return Math.toDegrees(Math.atan(Math.sin(hourAngleRad)
                / ((Math.cos(hourAngleRad) * Math.sin(latRad)) - (Math.tan(decRad) * Math.cos(latRad))))) + 180;

    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
     * of sunrise for the given day at the given location on earth
     *
     * @param julianDay
     *            the Julian day
     * @param latitude
     *            the latitude of observer in degrees
     * @param longitude
     *            the longitude of observer in degrees
     * @return the time in minutes from zero UTC
     */
    private static getSunriseUTC(julianDay: number, latitude: number, longitude: number, zenith: number): number {
        const julianCenturies: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

        // Find the time of solar noon at the location, and use that declination. This is better than start of the
        // Julian day

        const noonmin: number = NOAACalculator.getSolarNoonUTC(julianCenturies, longitude);
        const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + noonmin / 1440.0);

        // First pass to approximate sunrise (using solar noon)

        let eqTime: number = NOAACalculator.getEquationOfTime(tnoon);
        let solarDec: number = NOAACalculator.getSunDeclination(tnoon);
        let hourAngle: number = NOAACalculator.getSunHourAngleAtSunrise(latitude, solarDec, zenith);

        let delta: number = longitude - Math.toDegrees(hourAngle);
        let timeDiff: number = 4 * delta; // in minutes of time
        let timeUTC: number = 720 + timeDiff - eqTime; // in minutes

        // Second pass includes fractional Julian Day in gamma calc

        const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) + timeUTC
                / 1440.0);
        eqTime = NOAACalculator.getEquationOfTime(newt);
        solarDec = NOAACalculator.getSunDeclination(newt);
        hourAngle = NOAACalculator.getSunHourAngleAtSunrise(latitude, solarDec, zenith);
        delta = longitude - Math.toDegrees(hourAngle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqTime; // in minutes
        return timeUTC;
    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
     * of <a href="http://en.wikipedia.org/wiki/Noon#Solar_noon">solar noon</a> for the given day at the given location
     * on earth.
     *
     * @param julianCenturies
     *            the number of Julian centuries since J2000.0
     * @param longitude
     *            the longitude of observer in degrees
     * @return the time in minutes from zero UTC
     */
    private static getSolarNoonUTC(julianCenturies: number, longitude: number): number {
        // First pass uses approximate solar noon to calculate eqtime
        const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) + longitude
                / 360.0);
        let eqTime: number = NOAACalculator.getEquationOfTime(tnoon);
        const solNoonUTC: number = 720 + (longitude * 4) - eqTime; // min

        const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) - 0.5
                + solNoonUTC / 1440.0);

        eqTime = NOAACalculator.getEquationOfTime(newt);
        return 720 + (longitude * 4) - eqTime; // min
    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
     * of sunset for the given day at the given location on earth
     *
     * @param julianDay
     *            the Julian day
     * @param latitude
     *            the latitude of observer in degrees
     * @param longitude
     *            : longitude of observer in degrees
     * @param zenith
     * @return the time in minutes from zero Universal Coordinated Time (UTC)
     */
    private static getSunsetUTC(julianDay: number, latitude: number, longitude: number, zenith: number): number {
        const julianCenturies: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

        // Find the time of solar noon at the location, and use that declination. This is better than start of the
        // Julian day

        const noonmin: number = NOAACalculator.getSolarNoonUTC(julianCenturies, longitude);
        const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + noonmin / 1440.0);

        // First calculates sunrise and approx length of day

        let eqTime: number = NOAACalculator.getEquationOfTime(tnoon);
        let solarDec: number = NOAACalculator.getSunDeclination(tnoon);
        let hourAngle: number = NOAACalculator.getSunHourAngleAtSunset(latitude, solarDec, zenith);

        let delta: number = longitude - Math.toDegrees(hourAngle);
        let timeDiff: number = 4 * delta;
        let timeUTC: number = 720 + timeDiff - eqTime;

        // Second pass includes fractional Julian Day in gamma calc

        const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) + timeUTC
                / 1440.0);
        eqTime = NOAACalculator.getEquationOfTime(newt);
        solarDec = NOAACalculator.getSunDeclination(newt);
        hourAngle = NOAACalculator.getSunHourAngleAtSunset(latitude, solarDec, zenith);

        delta = longitude - Math.toDegrees(hourAngle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqTime; // in minutes
        return timeUTC;
    }
}

import { DateTime } from 'luxon';

import { GeoLocation } from './GeoLocation.ts';
import { AstronomicalCalculator } from './AstronomicalCalculator.ts';
import { MathUtils } from '../polyfills/Utils.ts';

/**
 * Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
 * href="http://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
 * href="http://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>'s <a href =
 * "http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA's <a
 * href="http://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
 * href="http://www.willbell.com/math/mc1.htm">Astronomical Algorithms</a> by <a
 * href="https://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
 * to account for elevation. The algorithm can be found in the <a
 * href="https://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.
 *
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 */
export class NOAACalculator extends AstronomicalCalculator {
  /**
   * The <a href="https://en.wikipedia.org/wiki/Julian_day">Julian day</a> of January 1, 2000
   */
  private static readonly JULIAN_DAY_JAN_1_2000: number = 2451545;

  /**
   * Julian days per century
   */
  private static readonly JULIAN_DAYS_PER_CENTURY: number = 36525;

  /**
   * @see AstronomicalCalculator#getCalculatorName()
   */
  // eslint-disable-next-line class-methods-use-this
  public getCalculatorName(): string {
    return 'US National Oceanic and Atmospheric Administration Algorithm';
  }

  /**
   * @see AstronomicalCalculator#getUTCSunrise(Calendar, GeoLocation, double, boolean)
   */
  public getUTCSunrise(date: DateTime, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean): number {
    const elevation: number = adjustForElevation ? geoLocation.getElevation() : 0;
    const adjustedZenith: number = this.adjustZenith(zenith, elevation);

    let sunrise: number = NOAACalculator.getSunriseUTC(NOAACalculator.getJulianDay(date), geoLocation.getLatitude(), -geoLocation.getLongitude(),
      adjustedZenith);
    sunrise = sunrise / 60;

    // ensure that the time is >= 0 and < 24
    while (sunrise < 0) {
      sunrise += 24;
    }
    while (sunrise >= 24) {
      sunrise -= 24;
    }
    return sunrise;
  }

  /**
   * @see AstronomicalCalculator#getUTCSunset(Calendar, GeoLocation, double, boolean)
   */
  public getUTCSunset(date: DateTime, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean): number {
    const elevation: number = adjustForElevation ? geoLocation.getElevation() : 0;
    const adjustedZenith: number = this.adjustZenith(zenith, elevation);

    let sunset: number = NOAACalculator.getSunsetUTC(NOAACalculator.getJulianDay(date), geoLocation.getLatitude(), -geoLocation.getLongitude(),
      adjustedZenith);
    sunset = sunset / 60;

    // ensure that the time is >= 0 and < 24
    while (sunset < 0) {
      sunset += 24;
    }
    while (sunset >= 24) {
      sunset -= 24;
    }
    return sunset;
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Julian_day">Julian day</a> from a Java Calendar
   *
   * @param calendar
   *            The Java Calendar
   * @return the Julian day corresponding to the date Note: Number is returned for start of day. Fractional days
   *         should be added later.
   */
  private static getJulianDay(date: DateTime): number {
    let { year, month } = date;
    const { day } = date;
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const a: number = Math.trunc(year / 100);
    const b: number = Math.trunc(2 - a + a / 4);

    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  }

  /**
   * Convert <a href="https://en.wikipedia.org/wiki/Julian_day">Julian day</a> to centuries since J2000.0.
   *
   * @param julianDay
   *            the Julian Day to convert
   * @return the centuries since 2000 Julian corresponding to the Julian Day
   */
  private static getJulianCenturiesFromJulianDay(julianDay: number): number {
    return (julianDay - NOAACalculator.JULIAN_DAY_JAN_1_2000) / NOAACalculator.JULIAN_DAYS_PER_CENTURY;
  }

  /**
   * Convert centuries since J2000.0 to <a href="https://en.wikipedia.org/wiki/Julian_day">Julian day</a>.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the Julian Day corresponding to the Julian centuries passed in
   */
  private static getJulianDayFromJulianCenturies(julianCenturies: number): number {
    return julianCenturies * NOAACalculator.JULIAN_DAYS_PER_CENTURY + NOAACalculator.JULIAN_DAY_JAN_1_2000;
  }

  /**
   * Returns the Geometric <a href="https://en.wikipedia.org/wiki/Mean_longitude">Mean Longitude</a> of the Sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the Geometric Mean Longitude of the Sun in degrees
   */
  private static getSunGeometricMeanLongitude(julianCenturies: number): number {
    let longitude: number = 280.46646 + julianCenturies * (36000.76983 + 0.0003032 * julianCenturies);
    while (longitude > 360) {
      longitude -= 360;
    }
    while (longitude < 0) {
      longitude += 360;
    }

    return longitude; // in degrees
  }

  /**
   * Returns the Geometric <a href="https://en.wikipedia.org/wiki/Mean_anomaly">Mean Anomaly</a> of the Sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the Geometric Mean Anomaly of the Sun in degrees
   */
  private static getSunGeometricMeanAnomaly(julianCenturies: number): number {
    return 357.52911 + julianCenturies * (35999.05029 - 0.0001537 * julianCenturies); // in degrees
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Eccentricity_%28orbit%29">eccentricity of earth's orbit</a>.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the unitless eccentricity
   */
  private static getEarthOrbitEccentricity(julianCenturies: number): number {
    return 0.016708634 - julianCenturies * (0.000042037 + 0.0000001267 * julianCenturies); // unitless
  }

  /**
   * Returns the <a href="https://en.wikipedia.org/wiki/Equation_of_the_center">equation of center</a> for the sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the equation of center for the sun in degrees
   */
  private static getSunEquationOfCenter(julianCenturies: number): number {
    const m: number = NOAACalculator.getSunGeometricMeanAnomaly(julianCenturies);

    const mrad: number = MathUtils.degreesToRadians(m);
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
  // * Returns the <a href="https://en.wikipedia.org/wiki/True_anomaly">true anamoly</a> of the sun.
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
    const lambda: number = sunTrueLongitude - 0.00569 - 0.00478 * Math.sin(MathUtils.degreesToRadians(omega));
    return lambda; // in degrees
  }

  /**
   * Returns the mean <a href="https://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial tilt).
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the mean obliquity in degrees
   */
  private static getMeanObliquityOfEcliptic(julianCenturies: number): number {
    const seconds: number = 21.448 - julianCenturies
      * (46.8150 + julianCenturies * (0.00059 - julianCenturies * (0.001813)));
    return 23 + (26 + (seconds / 60)) / 60; // in degrees
  }

  /**
   * Returns the corrected <a href="https://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial
   * tilt).
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return the corrected obliquity in degrees
   */
  private static getObliquityCorrection(julianCenturies: number): number {
    const obliquityOfEcliptic: number = NOAACalculator.getMeanObliquityOfEcliptic(julianCenturies);

    const omega: number = 125.04 - 1934.136 * julianCenturies;
    return obliquityOfEcliptic + 0.00256 * Math.cos(MathUtils.degreesToRadians(omega)); // in degrees
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Declination">declination</a> of the sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since J2000.0
   * @return
   *            the sun's declination in degrees
   */
  private static getSunDeclination(julianCenturies: number): number {
    const obliquityCorrection: number = NOAACalculator.getObliquityCorrection(julianCenturies);
    const lambda: number = NOAACalculator.getSunApparentLongitude(julianCenturies);

    const sint: number = Math.sin(MathUtils.degreesToRadians(obliquityCorrection)) * Math.sin(MathUtils.degreesToRadians(lambda));
    const theta: number = MathUtils.radiansToDegrees(Math.asin(sint));
    return theta; // in degrees
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Equation_of_time">Equation of Time</a> - the difference between
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

    let y: number = Math.tan(MathUtils.degreesToRadians(epsilon) / 2);
    y *= y;

    const sin2l0: number = Math.sin(2 * MathUtils.degreesToRadians(geomMeanLongSun));
    const sinm: number = Math.sin(MathUtils.degreesToRadians(geomMeanAnomalySun));
    const cos2l0: number = Math.cos(2 * MathUtils.degreesToRadians(geomMeanLongSun));
    const sin4l0: number = Math.sin(4 * MathUtils.degreesToRadians(geomMeanLongSun));
    const sin2m: number = Math.sin(2 * MathUtils.degreesToRadians(geomMeanAnomalySun));

    const equationOfTime: number = y * sin2l0 - 2 * eccentricityEarthOrbit * sinm + 4 * eccentricityEarthOrbit * y
      * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * eccentricityEarthOrbit * eccentricityEarthOrbit * sin2m;
    return MathUtils.radiansToDegrees(equationOfTime) * 4; // in minutes of time
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Hour_angle">hour angle</a> of the sun at sunrise for the
   * latitude.
   *
   * @param lat
   *            , the latitude of observer in degrees
   * @param solarDec
   *            the declination angle of sun in degrees
   * @param zenith
   *            the zenith
   * @return hour angle of sunrise in radians
   */
  private static getSunHourAngleAtSunrise(lat: number, solarDec: number, zenith: number): number {
    const latRad: number = MathUtils.degreesToRadians(lat);
    const sdRad: number = MathUtils.degreesToRadians(solarDec);

    return (Math.acos(Math.cos(MathUtils.degreesToRadians(zenith)) / (Math.cos(latRad) * Math.cos(sdRad))
      - Math.tan(latRad) * Math.tan(sdRad))); // in radians
  }

  /**
   * Returns the <a href="https://en.wikipedia.org/wiki/Hour_angle">hour angle</a> of the sun at sunset for the
   * latitude. TODO: use - {@link #getSunHourAngleAtSunrise(double, double, double)} implementation to avoid
   * duplication of code.
   *
   * @param lat
   *            the latitude of observer in degrees
   * @param solarDec
   *            the declination angle of sun in degrees
   * @param zenith
   *            the zenith
   * @return the hour angle of sunset in radians
   */
  private static getSunHourAngleAtSunset(lat: number, solarDec: number, zenith: number): number {
    const latRad: number = MathUtils.degreesToRadians(lat);
    const sdRad: number = MathUtils.degreesToRadians(solarDec);

    const hourAngle: number = (Math.acos(Math.cos(MathUtils.degreesToRadians(zenith)) / (Math.cos(latRad) * Math.cos(sdRad))
      - Math.tan(latRad) * Math.tan(sdRad)));
    return -hourAngle; // in radians
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Elevation</a> for the
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

  public static getSolarElevation(date: DateTime, lat: number, lon: number): number {
    const julianDay: number = NOAACalculator.getJulianDay(date);
    const julianCenturies: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

    const equationOfTime: number = NOAACalculator.getEquationOfTime(julianCenturies);

    let longitude: number = (date.hour + 12) + (date.minute + equationOfTime + date.second / 60) / 60;

    longitude = -(longitude * 360 / 24) % 360;
    const hourAngleRad: number = MathUtils.degreesToRadians(lon - longitude);
    const declination: number = NOAACalculator.getSunDeclination(julianCenturies);
    const decRad: number = MathUtils.degreesToRadians(declination);
    const latRad: number = MathUtils.degreesToRadians(lat);
    return MathUtils.radiansToDegrees(Math.asin((Math.sin(latRad) * Math.sin(decRad))
      + (Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad))));
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Azimuth</a> for the
   * horizontal coordinate system at the given location at the given time. Not corrected for altitude. True south is 0
   * degrees.
   *
   * @param cal
   *            time of calculation
   * @param latitude
   *            latitude of location for calculation
   * @param lon
   *            longitude of location for calculation
   * @return FIXME
   */

  public static getSolarAzimuth(date: DateTime, latitude: number, lon: number): number {
    const julianDay: number = NOAACalculator.getJulianDay(date);
    const julianCenturies: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

    const equationOfTime: number = NOAACalculator.getEquationOfTime(julianCenturies);

    let longitude: number = (date.hour + 12) + (date.minute + equationOfTime + date.second / 60) / 60;

    longitude = -(longitude * 360 / 24) % 360;
    const hourAngleRad: number = MathUtils.degreesToRadians(lon - longitude);
    const declination: number = NOAACalculator.getSunDeclination(julianCenturies);
    const decRad: number = MathUtils.degreesToRadians(declination);
    const latRad: number = MathUtils.degreesToRadians(latitude);

    return MathUtils.radiansToDegrees(Math.atan(Math.sin(hourAngleRad)
      / ((Math.cos(hourAngleRad) * Math.sin(latRad)) - (Math.tan(decRad) * Math.cos(latRad))))) + 180;
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of sunrise for the given day at the given location on earth
   *
   * @param julianDay
   *            the Julian day
   * @param latitude
   *            the latitude of observer in degrees
   * @param longitude
   *            the longitude of observer in degrees
   * @param zenith
   *            the zenith
   * @return the time in minutes from zero UTC
   */
  private static getSunriseUTC(julianDay: number, latitude: number, longitude: number, zenith: number): number {
    const julianCenturies: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

    // Find the time of solar noon at the location, and use that declination. This is better than start of the
    // Julian day

    const noonmin: number = NOAACalculator.getSolarNoonUTC(julianCenturies, longitude);
    const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + noonmin / 1440);

    // First pass to approximate sunrise (using solar noon)

    let eqTime: number = NOAACalculator.getEquationOfTime(tnoon);
    let solarDec: number = NOAACalculator.getSunDeclination(tnoon);
    let hourAngle: number = NOAACalculator.getSunHourAngleAtSunrise(latitude, solarDec, zenith);

    let delta: number = longitude - MathUtils.radiansToDegrees(hourAngle);
    let timeDiff: number = 4 * delta; // in minutes of time
    let timeUTC: number = 720 + timeDiff - eqTime; // in minutes

    // Second pass includes fractional Julian Day in gamma calc

    const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(
      NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) + timeUTC / 1440);
    eqTime = NOAACalculator.getEquationOfTime(newt);
    solarDec = NOAACalculator.getSunDeclination(newt);
    hourAngle = NOAACalculator.getSunHourAngleAtSunrise(latitude, solarDec, zenith);
    delta = longitude - MathUtils.radiansToDegrees(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - eqTime; // in minutes
    return timeUTC;
  }

  public getUTCNoon(calendar: DateTime, geoLocation: GeoLocation) {
    const julianDay = NOAACalculator.getJulianDay(calendar);
    const julianCenturies = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);
		
    let noon = NOAACalculator.getSolarNoonUTC(julianCenturies, -geoLocation.getLongitude());
    noon = noon / 60;

    // ensure that the time is >= 0 and < 24
    while (noon < 0.0) {
      noon += 24.0;
    }
    while (noon >= 24.0) {
      noon -= 24.0;
    }
    return noon;
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of <a href="https://en.wikipedia.org/wiki/Noon#Solar_noon">solar noon</a> for the given day at the given location
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
    const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(
      NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) + longitude / 360);
    let eqTime: number = NOAACalculator.getEquationOfTime(tnoon);
    const solNoonUTC: number = 720 + (longitude * 4) - eqTime; // min

    const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(
      NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) - 0.5 + solNoonUTC / 1440);

    eqTime = NOAACalculator.getEquationOfTime(newt);
    return 720 + (longitude * 4) - eqTime; // min
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of sunset for the given day at the given location on earth
   *
   * @param julianDay
   *            the Julian day
   * @param latitude
   *            the latitude of observer in degrees
   * @param longitude
   *            : longitude of observer in degrees
   * @param zenith
   *            the zenith
   * @return the time in minutes from zero Universal Coordinated Time (UTC)
   */
  private static getSunsetUTC(julianDay: number, latitude: number, longitude: number, zenith: number): number {
    const julianCenturies: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);

    // Find the time of solar noon at the location, and use that declination. This is better than start of the
    // Julian day

    const noonmin: number = NOAACalculator.getSolarNoonUTC(julianCenturies, longitude);
    const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + noonmin / 1440);

    // First calculates sunrise and approx length of day

    let eqTime: number = NOAACalculator.getEquationOfTime(tnoon);
    let solarDec: number = NOAACalculator.getSunDeclination(tnoon);
    let hourAngle: number = NOAACalculator.getSunHourAngleAtSunset(latitude, solarDec, zenith);

    let delta: number = longitude - MathUtils.radiansToDegrees(hourAngle);
    let timeDiff: number = 4 * delta;
    let timeUTC: number = 720 + timeDiff - eqTime;

    // Second pass includes fractional Julian Day in gamma calc

    const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(
      NOAACalculator.getJulianDayFromJulianCenturies(julianCenturies) + timeUTC / 1440);
    eqTime = NOAACalculator.getEquationOfTime(newt);
    solarDec = NOAACalculator.getSunDeclination(newt);
    hourAngle = NOAACalculator.getSunHourAngleAtSunset(latitude, solarDec, zenith);

    delta = longitude - MathUtils.radiansToDegrees(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - eqTime; // in minutes
    return timeUTC;
  }
}

import { DateTime } from 'luxon';

import { GeoLocation } from './GeoLocation';
import { AstronomicalCalculator } from './AstronomicalCalculator';
import { MathUtils, ValueOf } from '../polyfills/Utils';

/**
 * Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
 * href="https://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
 * href="https://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>'s <a href =
 * "https://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA's <a
 * href="https://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
 * href="https://www.willbell.com/math/mc1.htm">Astronomical Algorithms</a> by <a
 * href="https://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
 * to account for elevation. The algorithm can be found in the <a
 * href="https://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.
 *
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 */
export class NOAACalculator extends AstronomicalCalculator {
  /**
   * The <a href="https://en.wikipedia.org/wiki/Julian_day">Julian day</a> of January 1, 2000, known as
   * <a href="https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   */
  private static readonly JULIAN_DAY_JAN_1_2000: number = 2451545;

  /**
   * Julian days per century
   */
  private static readonly JULIAN_DAYS_PER_CENTURY: number = 36525;

  /**
   * An enum to indicate what type of solar event is being calculated.
   */
  protected static readonly SolarEvent = {
    /** SUNRISE A solar event related to sunrise */
    SUNRISE: 0,
    /** SUNSET A solar event related to sunset */
    SUNSET: 1,
    /** NOON A solar event related to noon */
    NOON: 2,
    /** MIDNIGHT A solar event related to midnight */
    MIDNIGHT: 3,
  } as const;

  /**
   * @see AstronomicalCalculator#getCalculatorName()
   */
  // eslint-disable-next-line class-methods-use-this
  public getCalculatorName(): string {
    return 'US National Oceanic and Atmospheric Administration Algorithm'; // Implementation of the Jean Meeus algorithm
  }

  /**
   * @see AstronomicalCalculator#getUTCSunrise(Calendar, GeoLocation, double, boolean)
   */
  public getUTCSunrise(date: DateTime, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean): number {
    const elevation: number = adjustForElevation ? geoLocation.getElevation() : 0;
    const adjustedZenith: number = this.adjustZenith(zenith, elevation);

    let sunrise: number = NOAACalculator.getSunRiseSetUTC(date, geoLocation.getLatitude(), -geoLocation.getLongitude(),
      adjustedZenith, NOAACalculator.SolarEvent.SUNRISE);
    sunrise = sunrise / 60;

    return sunrise > 0 ? sunrise % 24 : (sunrise % 24) + 24; // ensure that the time is >= 0 and < 24
  }

  /**
   * @see AstronomicalCalculator#getUTCSunset(Calendar, GeoLocation, double, boolean)
   */
  public getUTCSunset(date: DateTime, geoLocation: GeoLocation, zenith: number, adjustForElevation: boolean): number {
    const elevation: number = adjustForElevation ? geoLocation.getElevation() : 0;
    const adjustedZenith: number = this.adjustZenith(zenith, elevation);

    let sunset: number = NOAACalculator.getSunRiseSetUTC(date, geoLocation.getLatitude(), -geoLocation.getLongitude(),
      adjustedZenith, NOAACalculator.SolarEvent.SUNSET);
    sunset = sunset / 60;

    return sunset > 0 ? sunset % 24 : (sunset % 24) + 24; // ensure that the time is >= 0 and < 24
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
   * Convert <a href="https://en.wikipedia.org/wiki/Julian_day">Julian day</a> to centuries since <a href=
   * "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   *
   * @param julianDay
   *            the Julian Day to convert
   * @return the centuries since 2000 Julian corresponding to the Julian Day
   */
  private static getJulianCenturiesFromJulianDay(julianDay: number): number {
    return (julianDay - NOAACalculator.JULIAN_DAY_JAN_1_2000) / NOAACalculator.JULIAN_DAYS_PER_CENTURY;
  }

  /**
   * Returns the Geometric <a href="https://en.wikipedia.org/wiki/Mean_longitude">Mean Longitude</a> of the Sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   * @return the Geometric Mean Longitude of the Sun in degrees
   */
  private static getSunGeometricMeanLongitude(julianCenturies: number): number {
    const longitude: number = 280.46646 + julianCenturies * (36000.76983 + 0.0003032 * julianCenturies);
    return longitude > 0 ? longitude % 360 : (longitude % 360) + 360; // ensure that the longitude is >= 0 and < 360
  }

  /**
   * Returns the Geometric <a href="https://en.wikipedia.org/wiki/Mean_anomaly">Mean Anomaly</a> of the Sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   * @return the Geometric Mean Anomaly of the Sun in degrees
   */
  private static getSunGeometricMeanAnomaly(julianCenturies: number): number {
    return 357.52911 + julianCenturies * (35999.05029 - 0.0001537 * julianCenturies);
  }

  /**
   * Return the unitless <a href="https://en.wikipedia.org/wiki/Eccentricity_%28orbit%29">eccentricity of earth's orbit</a>.
   *
   * @param julianCenturies
   *            the number of Julian centuries since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   * @return the unitless eccentricity
   */
  private static getEarthOrbitEccentricity(julianCenturies: number): number {
    return 0.016708634 - julianCenturies * (0.000042037 + 0.0000001267 * julianCenturies);
  }

  /**
   * Returns the <a href="https://en.wikipedia.org/wiki/Equation_of_the_center">equation of center</a> for the sun in degrees.
   *
   * @param julianCenturies
   *            the number of Julian centuries since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   * @return the equation of center for the sun in degrees
   */
  private static getSunEquationOfCenter(julianCenturies: number): number {
    const m: number = NOAACalculator.getSunGeometricMeanAnomaly(julianCenturies);

    const mrad: number = MathUtils.degreesToRadians(m);
    const sinm: number = Math.sin(mrad);
    const sin2m: number = Math.sin(mrad + mrad);
    const sin3m: number = Math.sin(mrad + mrad + mrad);

    return sinm * (1.914602 - julianCenturies * (0.004817 + 0.000014 * julianCenturies)) + sin2m
      * (0.019993 - 0.000101 * julianCenturies) + sin3m * 0.000289;
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/True_longitude">true longitude</a> of the sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   * @return the sun's true longitude in degrees
   */
  private static getSunTrueLongitude(julianCenturies: number): number {
    const sunLongitude: number = NOAACalculator.getSunGeometricMeanLongitude(julianCenturies);
    const center: number = NOAACalculator.getSunEquationOfCenter(julianCenturies);

    return sunLongitude + center;
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
  // return meanAnomaly + equationOfCenter;
  // }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Apparent_longitude">apparent longitude</a> of the sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   * @return sun's apparent longitude in degrees
   */
  private static getSunApparentLongitude(julianCenturies: number): number {
    const sunTrueLongitude: number = NOAACalculator.getSunTrueLongitude(julianCenturies);

    const omega: number = 125.04 - 1934.136 * julianCenturies;
    const lambda = sunTrueLongitude - 0.00569 - 0.00478 * Math.sin(MathUtils.degreesToRadians(omega));
    return lambda;
  }

  /**
   * Returns the mean <a href="https://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial tilt).
   *
   * @param julianCenturies
   *            the number of Julian centuries since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   * @return the mean obliquity in degrees
   */
  private static getMeanObliquityOfEcliptic(julianCenturies: number): number {
    const seconds: number = 21.448 - julianCenturies
      * (46.8150 + julianCenturies * (0.00059 - julianCenturies * (0.001813)));
    return 23 + (26 + (seconds / 60)) / 60;
  }

  /**
   * Returns the corrected <a href="https://en.wikipedia.org/wiki/Axial_tilt">obliquity of the ecliptic</a> (Axial
   * tilt).
   *
   * @param julianCenturies
   *            the number of Julian centuries since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   * @return the corrected obliquity in degrees
   */
  private static getObliquityCorrection(julianCenturies: number): number {
    const obliquityOfEcliptic: number = NOAACalculator.getMeanObliquityOfEcliptic(julianCenturies);

    const omega: number = 125.04 - 1934.136 * julianCenturies;
    return obliquityOfEcliptic + 0.00256 * Math.cos(MathUtils.degreesToRadians(omega));
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Declination">declination</a> of the sun.
   *
   * @param julianCenturies
   *            the number of Julian centuries since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   * @return
   *            the sun's declination in degrees
   */
  private static getSunDeclination(julianCenturies: number): number {
    const obliquityCorrection: number = NOAACalculator.getObliquityCorrection(julianCenturies);
    const lambda: number = NOAACalculator.getSunApparentLongitude(julianCenturies);

    const sint: number = Math.sin(MathUtils.degreesToRadians(obliquityCorrection)) * Math.sin(MathUtils.degreesToRadians(lambda));
    const theta = MathUtils.radiansToDegrees(Math.asin(sint));
    return theta;
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Equation_of_time">Equation of Time</a> - the difference between
   * true solar time and mean solar time
   *
   * @param julianCenturies
   *            the number of Julian centuries since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
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
    return MathUtils.radiansToDegrees(equationOfTime) * 4;
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Hour_angle">hour angle</a> of the sun in
   * <a href="https://en.wikipedia.org/wiki/Radian">radians</a> at sunrise for the latitude.
   *
   * @param latitude
   *            the latitude of observer in degrees
   * @param solarDeclination
   *            the declination angle of sun in degrees
   * @param zenith
   *            the zenith
   * @param solarEvent
   *             If the hour angle is for sunrise or sunset
   * @return hour angle of sunrise in <a href="https://en.wikipedia.org/wiki/Radian">radians</a>
   */
  private static getSunHourAngle(latitude: number, solarDeclination: number, zenith: number, solarEvent: ValueOf<typeof NOAACalculator.SolarEvent>): number {
    const latRad: number = MathUtils.degreesToRadians(latitude);
    const sdRad: number = MathUtils.degreesToRadians(solarDeclination);

    let hourAngle: number = (Math.acos(Math.cos(MathUtils.degreesToRadians(zenith)) / (Math.cos(latRad) * Math.cos(sdRad))
      - Math.tan(latRad) * Math.tan(sdRad)));

    if (solarEvent === NOAACalculator.SolarEvent.SUNSET) {
      hourAngle = -hourAngle;
    }
    return hourAngle;
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Elevation</a> for the
   * horizontal coordinate system at the given location at the given time. Can be negative if the sun is below the
   * horizon. Not corrected for altitude.
   *
   * @param calendar
   *            time of calculation
   * @param latitude
   *            latitude of location for calculation
   * @param longitude
   *            longitude of location for calculation
   * @return solar elevation in degrees - horizon is 0 degrees, civil twilight is -6 degrees
   */

  public static getSolarElevation(date: DateTime, latitude: number, longitude: number): number {
    const julianDay: number = NOAACalculator.getJulianDay(date);
    const julianCenturies: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);
    const eot: number = NOAACalculator.getEquationOfTime(julianCenturies);
    let adjustedLongitude: number = (date.hour + 12) + (date.minute + eot + date.second / 60) / 60;
    adjustedLongitude = -((adjustedLongitude * 360.0) / 24.0) % 360.0;
    const hourAngleRad: number = MathUtils.degreesToRadians(longitude - adjustedLongitude);

    const declination: number = NOAACalculator.getSunDeclination(julianCenturies);
    const decRad: number = MathUtils.degreesToRadians(declination);
    const latRad: number = MathUtils.degreesToRadians(latitude);
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
   * @param longitude
   *            longitude of location for calculation
   * @return FIXME
   */

  public static getSolarAzimuth(date: DateTime, latitude: number, longitude: number): number {
    const julianDay: number = NOAACalculator.getJulianDay(date);
    const julianCenturies: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay);
    const eot: number = NOAACalculator.getEquationOfTime(julianCenturies);
    let adjustedLongitude: number = (date.hour + 12) + (date.minute + eot + date.second / 60) / 60;
    adjustedLongitude = -((adjustedLongitude * 360.0) / 24.0) % 360.0;
    const hourAngleRad: number = MathUtils.degreesToRadians(longitude - adjustedLongitude);

    const declination: number = NOAACalculator.getSunDeclination(julianCenturies);
    const decRad: number = MathUtils.degreesToRadians(declination);
    const latRad: number = MathUtils.degreesToRadians(latitude);

    return MathUtils.radiansToDegrees(Math.atan(Math.sin(hourAngleRad)
      / ((Math.cos(hourAngleRad) * Math.sin(latRad)) - (Math.tan(decRad) * Math.cos(latRad))))) + 180;
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of <a href="https://en.wikipedia.org/wiki/Noon#Solar_noon">solar noon</a> for the given day at the given location
   * on earth. This implementation returns true solar noon as opposed to the time halfway between sunrise and sunset.
   * Other calculators may return a more simplified calculation of halfway between sunrise and sunset. See <a href=
   * "https://kosherjava.com/2020/07/02/definition-of-chatzos/">The Definition of <em>Chatzos</em></a> for details on
   * solar noon calculations.
   * @see com.kosherjava.zmanim.util.AstronomicalCalculator#getUTCNoon(Calendar, GeoLocation)
   * @see #getSolarNoonUTC(double, double)
   *
   * @param date
   *            The Calendar representing the date to calculate solar noon for
   * @param geoLocation
   *            The location information used for astronomical calculating sun times. This class uses only requires
   *            the longitude for calculating noon since it is the same time anywhere along the longitude line.
   * @return the time in minutes from zero UTC
   */
  public getUTCNoon(date: DateTime, geoLocation: GeoLocation): number {
    let noon = NOAACalculator.getSolarNoonUTC(NOAACalculator.getJulianDay(date), -geoLocation.getLongitude());
    noon = noon / 60;

    return noon > 0 ? noon % 24 : (noon % 24) + 24; // ensure that the time is >= 0 and < 24
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of <a href="http://en.wikipedia.org/wiki/Noon#Solar_noon">solar noon</a> for the given day at the given location
   * on earth.
   * @todo Refactor to possibly use the getSunRiseSetUTC (to be renamed) and remove the need for this method.
   *
   * @param julianDay
   *            the Julian day since <a href=
   *            "https://en.wikipedia.org/wiki/Epoch_(astronomy)#J2000">J2000.0</a>.
   * @param longitude
   *            the longitude of observer in degrees
   *
   * @return the time in minutes from zero UTC
   *
   * @see com.kosherjava.zmanim.util.AstronomicalCalculator#getUTCNoon(Calendar, GeoLocation)
   * @see #getUTCNoon(Calendar, GeoLocation)
   */
  private static getSolarNoonUTC(julianDay: number, longitude: number): number {
    // First pass for approximate solar noon to calculate equation of time
    const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + longitude / 360);
    let equationOfTime: number = NOAACalculator.getEquationOfTime(tnoon);
    const solNoonUTC: number = 720 + (longitude * 4) - equationOfTime; // minutes

    // second pass
    const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay - 0.5 + solNoonUTC / 1440);

    equationOfTime = NOAACalculator.getEquationOfTime(newt);
    return 720 + (longitude * 4) - equationOfTime;
  }

  /**
   * Return the <a href="https://en.wikipedia.org/wiki/Universal_Coordinated_Time">Universal Coordinated Time</a> (UTC)
   * of sunrise or sunset for the given day at the given location on earth.
   *
   * @param calendar
   *            the calendar
   * @param latitude
   *            the latitude of observer in degrees
   * @param longitude
   *            longitude of observer in degrees
   * @param zenith
   *            zenith
   * @param solarEvent
   *             Is the calculation for sunrise or sunset
   * @return the time in minutes from zero Universal Coordinated Time (UTC)
   */
  private static getSunRiseSetUTC(date: DateTime, latitude: number, longitude: number, zenith: number, solarEvent: ValueOf<typeof NOAACalculator.SolarEvent>): number {
    const julianDay: number = this.getJulianDay(date);

    // Find the time of solar noon at the location, and use that declination.
    // This is better than start of the Julian day
    const noonmin: number = NOAACalculator.getSolarNoonUTC(julianDay, longitude);
    const tnoon: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + noonmin / 1440);

    // First calculates sunrise and approximate length of day
    let equationOfTime: number = NOAACalculator.getEquationOfTime(tnoon);
    let solarDeclination: number = NOAACalculator.getSunDeclination(tnoon);
    let hourAngle: number = NOAACalculator.getSunHourAngle(latitude, solarDeclination, zenith, solarEvent);

    let delta: number = longitude - MathUtils.radiansToDegrees(hourAngle);
    let timeDiff: number = 4 * delta;
    let timeUTC: number = 720 + timeDiff - equationOfTime;

    // Second pass includes fractional Julian Day in gamma calc
    const newt: number = NOAACalculator.getJulianCenturiesFromJulianDay(julianDay + timeUTC / 1440);

    equationOfTime = NOAACalculator.getEquationOfTime(newt);

    solarDeclination = NOAACalculator.getSunDeclination(newt);
    hourAngle = NOAACalculator.getSunHourAngle(latitude, solarDeclination, zenith, solarEvent);

    delta = longitude - MathUtils.radiansToDegrees(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - equationOfTime;
    return timeUTC;
  }
}

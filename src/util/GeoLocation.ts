import { DateTime } from 'luxon';

import { MathUtils, TimeZone } from '../polyfills/Utils';
import { IllegalArgumentException, UnsupportedError } from '../polyfills/errors';

/**
 * A class that contains location information such as latitude and longitude required for astronomical calculations. The
 * elevation field may not be used by some calculation engines and would be ignored if set. Check the documentation for
 * specific implementations of the {@link AstronomicalCalculator} to see if elevation is calculated as part of the
 * algorithm.
 *
 * @author &copy; Eliyahu Hershfeld 2004 - 2016
 * @version 1.1
 */
export class GeoLocation {
  /**
   * @see #getLatitude()
   * @see #setLatitude(double)
   * @see #setLatitude(int, int, double, String)
   */
  private latitude!: number;

  /**
   * @see #getLongitude()
   * @see #setLongitude(double)
   * @see #setLongitude(int, int, double, String)
   */
  private longitude!: number;

  /**
   * @see #getLocationName()
   * @see #setLocationName(String)
   */
  private locationName: string | null = null;

  /**
   * @see #getTimeZone()
   * @see #setTimeZone(TimeZone)
   */
  private timeZoneId!: string;

  /**
   * @see #getElevation()
   * @see #setElevation(double)
   */
  private elevation!: number;

  /**
   * Constant for a distance type calculation.
   * @see #getGeodesicDistance(GeoLocation)
   */
  private static readonly DISTANCE: number = 0;

  /**
   * Constant for a initial bearing type calculation.
   * @see #getGeodesicInitialBearing(GeoLocation)
   */
  private static readonly INITIAL_BEARING: number = 1;

  /**
   * Constant for a final bearing type calculation.
   * @see #getGeodesicFinalBearing(GeoLocation)
   */
  private static readonly FINAL_BEARING: number = 2;

  /** constant for milliseconds in a minute (60,000) */
  private static readonly MINUTE_MILLIS: number = 60 * 1000;

  /** constant for milliseconds in an hour (3,600,000) */
  private static readonly HOUR_MILLIS: number = GeoLocation.MINUTE_MILLIS * 60;

  /**
   * Method to get the elevation in Meters.
   *
   * @return Returns the elevation in Meters.
   */
  public getElevation(): number {
    return this.elevation;
  }

  /**
   * Method to set the elevation in Meters <b>above </b> sea level.
   *
   * @param elevation
   *            The elevation to set in Meters. An IllegalArgumentException will be thrown if the value is a negative.
   */
  public setElevation(elevation: number): void {
    if (elevation < 0) {
      throw new IllegalArgumentException('Elevation cannot be negative');
    }
    if (Number.isNaN(elevation) || !Number.isFinite(elevation)) {
      throw new IllegalArgumentException('Elevation must not be NaN or infinite');
    }
    this.elevation = elevation;
  }

  /**
   * GeoLocation constructor with parameters for all required fields.
   *
   * @param name
   *            The location name for display use such as &quot;Lakewood, NJ&quot;
   * @param latitude
   *            the latitude in a double format such as 40.095965 for Lakewood, NJ.
   *            <b>Note: </b> For latitudes south of the equator, a negative value should be used.
   * @param longitude
   *            double the longitude in a double format such as -74.222130 for Lakewood, NJ.
   *            <b>Note: </b> For longitudes east of the <a href="https://en.wikipedia.org/wiki/Prime_Meridian">Prime
   *            Meridian </a> (Greenwich), a negative value should be used.
   * @param timeZone
   *            the <code>TimeZone</code> for the location.
   */

  /*
      public GeoLocation(String name, double latitude, double longitude, TimeZone timeZone) {
          this(name, latitude, longitude, 0, timeZone);
      }
  */

  /**
   * GeoLocation constructor with parameters for all required fields.
   *
   * @param name
   *            The location name for display use such as &quot;Lakewood, NJ&quot;
   * @param latitude
   *            the latitude in a double format such as 40.095965 for Lakewood, NJ.
   *            <b>Note: </b> For latitudes south of the equator, a negative value should be used.
   * @param longitude
   *            double the longitude in a double format such as -74.222130 for Lakewood, NJ.
   *            <b>Note: </b> For longitudes east of the <a href="https://en.wikipedia.org/wiki/Prime_Meridian">Prime
   *            Meridian </a> (Greenwich), a negative value should be used.
   * @param elevation
   *            the elevation above sea level in Meters. Elevation is not used in most algorithms used for calculating
   *            sunrise and set.
   * @param timeZoneId
   *            the <code>TimeZone</code> for the location.
   */
  constructor(name: string | null, latitude: number, longitude: number, elevation: number, timeZoneId?: string)
  constructor(name: string | null, latitude: number, longitude: number, timeZoneId: string)
  constructor()
  constructor(name: string | null = 'Greenwich, England', latitude: number = 51.4772,
              longitude: number = 0, elevationOrTimeZoneId?: number | string, timeZoneId?: string) {
    let elevation: number = 0;
    if (timeZoneId) {
      elevation = elevationOrTimeZoneId as number;
    } else {
      timeZoneId = elevationOrTimeZoneId as string;
    }

    this.setLocationName(name);
    this.setLatitude(latitude);
    this.setLongitude(longitude);
    this.setElevation(elevation);
    this.setTimeZone(timeZoneId);
  }

  /**
   * Default GeoLocation constructor will set location to the Prime Meridian at Greenwich, England and a TimeZone of
   * GMT. The longitude will be set to 0 and the latitude will be 51.4772 to match the location of the <a
   * href="http://www.rog.nmm.ac.uk">Royal Observatory, Greenwich </a>. No daylight savings time will be used.
   */
  /*
      public GeoLocation() {
          setLocationName("Greenwich, England");
          setLongitude(0); // added for clarity
          setLatitude(51.4772);
          setTimeZone(TimeZone.getTimeZone("GMT"));
      }
  */

  /**
   * Method to set the latitude.
   *
   * @param latitude
   *            The degrees of latitude to set. The values should be between -90&deg; and 90&deg;. An
   *            IllegalArgumentException will be thrown if the value exceeds the limit. For example 40.095965 would be
   *            used for Lakewood, NJ. <b>Note: </b> For latitudes south of the equator, a negative value should be
   *            used.
   */

  /*
      public setLatitude(latitude: number): void {
          if (latitude > 90 || latitude < -90) {
              throw new IllegalArgumentException("Latitude must be between -90 and  90");
          }
          this.latitude = latitude;
      }
  */

  /**
   * Method to set the latitude in degrees, minutes and seconds.
   *
   * @param degrees
   *            The degrees of latitude to set between 0&deg; and 90&deg;. For example 40 would be used for Lakewood, NJ.
   *            An IllegalArgumentException will be thrown if the value exceeds the limit.
   * @param minutes
   *            <a href="https://en.wikipedia.org/wiki/Minute_of_arc#Cartography">minutes of arc</a>
   * @param seconds
   *            <a href="https://en.wikipedia.org/wiki/Minute_of_arc#Cartography">seconds of arc</a>
   * @param direction
   *            N for north and S for south. An IllegalArgumentException will be thrown if the value is not S or N.
   */
  public setLatitude(degrees: number, minutes: number, seconds: number, direction: 'N' | 'S'): void;
  public setLatitude(latitude: number): void;
  public setLatitude(degreesOrLatitude: number, minutes?: number, seconds?: number, direction?: 'N' | 'S'): void {
    if (!minutes) {
      const latitude: number = degreesOrLatitude;

      if (latitude > 90 || latitude < -90) {
        throw new IllegalArgumentException('Latitude must be between -90 and  90');
      }

      this.latitude = latitude;
    } else {
      const degrees: number = degreesOrLatitude;

      let tempLat: number = degrees + ((minutes + (seconds! / 60)) / 60);
      if (tempLat > 90 || tempLat < 0) { // FIXME An exception should be thrown if degrees, minutes or seconds are negative
        throw new IllegalArgumentException('Latitude must be between 0 and  90. Use direction of S instead of negative.');
      }
      if (direction === 'S') {
        tempLat *= -1;
      } else if (!(direction === 'N')) {
        throw new IllegalArgumentException('Latitude direction must be N or S');
      }
      this.latitude = tempLat;
    }
  }

  /**
   * @return Returns the latitude.
   */
  public getLatitude(): number {
    return this.latitude;
  }

  /**
   * Method to set the longitude in a double format.
   *
   * @param longitude
   *            The degrees of longitude to set in a double format between -180&deg; and 180&deg;. An
   *            IllegalArgumentException will be thrown if the value exceeds the limit. For example -74.2094 would be
   *            used for Lakewood, NJ. Note: for longitudes east of the <a
   *            href="https://en.wikipedia.org/wiki/Prime_Meridian">Prime Meridian</a> (Greenwich) a negative value
   *            should be used.
   */

  /*
      public setLongitude(longitude: number): void {
          if (longitude > 180 || longitude < -180) {
              throw new IllegalArgumentException("Longitude must be between -180 and  180");
          }
          this.longitude = longitude;
      }
  */

  /**
   * Method to set the longitude in degrees, minutes and seconds.
   *
   * @param degrees
   *            The degrees of longitude to set between 0&deg; and 180&deg;. As an example 74 would be set for Lakewood, NJ.
   *            An IllegalArgumentException will be thrown if the value exceeds the limits.
   * @param minutes
   *            <a href="https://en.wikipedia.org/wiki/Minute_of_arc#Cartography">minutes of arc</a>
   * @param seconds
   *            <a href="https://en.wikipedia.org/wiki/Minute_of_arc#Cartography">seconds of arc</a>
   * @param direction
   *            E for east of the <a href="https://en.wikipedia.org/wiki/Prime_Meridian">Prime Meridian </a> or W for west of it.
   *            An IllegalArgumentException will be thrown if
   *            the value is not E or W.
   */
  public setLongitude(degrees: number, minutes: number, seconds: number, direction: 'E' | 'W'): void;
  public setLongitude(longitude: number): void;
  public setLongitude(degreesOrLongitude: number, minutes?: number, seconds?: number, direction?: 'E' | 'W'): void {
    if (!minutes) {
      const longitude: number = degreesOrLongitude;

      if (longitude > 180 || longitude < -180) {
        throw new IllegalArgumentException('Longitude must be between -180 and  180');
      }

      this.longitude = longitude;
    } else {
      const degrees: number = degreesOrLongitude;

      let longTemp: number = degrees + ((minutes + (seconds! / 60)) / 60);
      if (longTemp > 180 || this.longitude < 0) { // FIXME An exception should be thrown if degrees, minutes or seconds are negative
        throw new IllegalArgumentException('Longitude must be between 0 and  180.  Use a direction of W instead of negative.');
      }
      if (direction === 'W') {
        longTemp *= -1;
      } else if (!(direction === 'E')) {
        throw new IllegalArgumentException('Longitude direction must be E or W');
      }
      this.longitude = longTemp;
    }
  }

  /**
   * @return Returns the longitude.
   */
  public getLongitude(): number {
    return this.longitude;
  }

  /**
   * @return Returns the location name.
   */
  public getLocationName(): string | null {
    return this.locationName;
  }

  /**
   * @param name
   *            The setter method for the display name.
   */
  public setLocationName(name: string | null): void {
    this.locationName = name;
  }

  /**
   * @return Returns the timeZone.
   */
  public getTimeZone(): string {
    return this.timeZoneId;
  }

  /**
   * Method to set the TimeZone. If this is ever set after the GeoLocation is set in the
   * {@link AstronomicalCalendar}, it is critical that
   * {@link AstronomicalCalendar#getCalendar()}.
   * {@link java.util.Calendar#setTimeZone(TimeZone) setTimeZone(TimeZone)} be called in order for the
   * AstronomicalCalendar to output times in the expected offset. This situation will arise if the
   * AstronomicalCalendar is ever {@link AstronomicalCalendar#clone() cloned}.
   *
   * @param timeZone
   *            The timeZone to set.
   */
  public setTimeZone(timeZoneId: string): void {
    this.timeZoneId = timeZoneId;
  }

  /**
   * A method that will return the location's local mean time offset in milliseconds from local <a
   * href="https://en.wikipedia.org/wiki/Standard_time">standard time</a>. The globe is split into 360&deg;, with
   * 15&deg; per hour of the day. For a local that is at a longitude that is evenly divisible by 15 (longitude % 15 ==
   * 0), at solar {@link AstronomicalCalendar#getSunTransit() noon} (with adjustment for the <a
   * href="https://en.wikipedia.org/wiki/Equation_of_time">equation of time</a>) the sun should be directly overhead,
   * so a user who is 1&deg; west of this will have noon at 4 minutes after standard time noon, and conversely, a user
   * who is 1&deg; east of the 15&deg; longitude will have noon at 11:56 AM. Lakewood, N.J., whose longitude is
   * -74.2094, is 0.7906 away from the closest multiple of 15 at -75&deg;. This is multiplied by 4 to yield 3 minutes
   * and 10 seconds earlier than standard time. The offset returned does not account for the <a
   * href="https://en.wikipedia.org/wiki/Daylight_saving_time">Daylight saving time</a> offset since this class is
   * unaware of dates.
   *
   * @return the offset in milliseconds not accounting for Daylight saving time. A positive value will be returned
   *         East of the 15&deg; timezone line, and a negative value West of it.
   * @since 1.1
   */
  public getLocalMeanTimeOffset(): number {
    return this.getLongitude() * 4 * GeoLocation.MINUTE_MILLIS - TimeZone.getRawOffset(this.getTimeZone());
  }

  /**
   * Adjust the date for <a href="https://en.wikipedia.org/wiki/180th_meridian">antimeridian</a> crossover. This is
   * needed to deal with edge cases such as Samoa that use a different calendar date than expected based on their
   * geographic location.
   *
   * The actual Time Zone offset may deviate from the expected offset based on the longitude. Since the 'absolute time'
   * calculations are always based on longitudinal offset from UTC for a given date, the date is presumed to only
   * increase East of the Prime Meridian, and to only decrease West of it. For Time Zones that cross the antimeridian,
   * the date will be artificially adjusted before calculation to conform with this presumption.
   *
   * For example, Apia, Samoa with a longitude of -171.75 uses a local offset of +14:00.  When calculating sunrise for
   * 2018-02-03, the calculator should operate using 2018-02-02 since the expected zone is -11.  After determining the
   * UTC time, the local DST offset of <a href="https://en.wikipedia.org/wiki/UTC%2B14:00">UTC+14:00</a> should be applied
   * to bring the date back to 2018-02-03.
   *
   * @return the number of days to adjust the date This will typically be 0 unless the date crosses the antimeridian
   */
  public getAntimeridianAdjustment(): -1 | 1 | 0 {
    const localHoursOffset: number = this.getLocalMeanTimeOffset() / GeoLocation.HOUR_MILLIS;

    // if the offset is 20 hours or more in the future (never expected anywhere other
    // than a location using a timezone across the anti meridian to the east such as Samoa)
    if (localHoursOffset >= 20) {
      // roll the date forward a day
      return 1;
    } else if (localHoursOffset <= -20) {
      // if the offset is 20 hours or more in the past (no current location is known
      // that crosses the antimeridian to the west, but better safe than sorry)
      // roll the date back a day
      return -1;
    }
    // 99.999% of the world will have no adjustment
    return 0;
  }

  /**
   * Calculate the initial <a href="https://en.wikipedia.org/wiki/Great_circle">geodesic</a> bearing between this
   * Object and a second Object passed to this method using <a
   * href="https://en.wikipedia.org/wiki/Thaddeus_Vincenty">Thaddeus Vincenty's</a> inverse formula See T Vincenty, "<a
   * href="http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf">Direct and Inverse Solutions of Geodesics on the Ellipsoid
   * with application of nested equations</a>", Survey Review, vol XXII no 176, 1975
   *
   * @param location
   *            the destination location
   * @return the initial bearing
   */
  public getGeodesicInitialBearing(location: GeoLocation): number {
    return this.vincentyFormula(location, GeoLocation.INITIAL_BEARING);
  }

  /**
   * Calculate the final <a href="https://en.wikipedia.org/wiki/Great_circle">geodesic</a> bearing between this Object
   * and a second Object passed to this method using <a href="https://en.wikipedia.org/wiki/Thaddeus_Vincenty">Thaddeus
   * Vincenty's</a> inverse formula See T Vincenty, "<a href="http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf">Direct and
   * Inverse Solutions of Geodesics on the Ellipsoid with application of nested equations</a>", Survey Review, vol
   * XXII no 176, 1975
   *
   * @param location
   *            the destination location
   * @return the final bearing
   */
  public getGeodesicFinalBearing(location: GeoLocation): number {
    return this.vincentyFormula(location, GeoLocation.FINAL_BEARING);
  }

  /**
   * Calculate <a href="https://en.wikipedia.org/wiki/Great-circle_distance">geodesic distance</a> in Meters between
   * this Object and a second Object passed to this method using <a
   * href="https://en.wikipedia.org/wiki/Thaddeus_Vincenty">Thaddeus Vincenty's</a> inverse formula See T Vincenty, "<a
   * href="http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf">Direct and Inverse Solutions of Geodesics on the Ellipsoid
   * with application of nested equations</a>", Survey Review, vol XXII no 176, 1975
   *
   * @see #vincentyFormula(GeoLocation, int)
   * @param location
   *            the destination location
   * @return the geodesic distance in Meters
   */
  public getGeodesicDistance(location: GeoLocation): number {
    return this.vincentyFormula(location, GeoLocation.DISTANCE);
  }

  /**
   * Calculate <a href="https://en.wikipedia.org/wiki/Great-circle_distance">geodesic distance</a> in Meters between
   * this Object and a second Object passed to this method using <a
   * href="https://en.wikipedia.org/wiki/Thaddeus_Vincenty">Thaddeus Vincenty's</a> inverse formula See T Vincenty, "<a
   * href="http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf">Direct and Inverse Solutions of Geodesics on the Ellipsoid
   * with application of nested equations</a>", Survey Review, vol XXII no 176, 1975
   *
   * @param location
   *            the destination location
   * @param formula
   *            This formula calculates initial bearing ({@link #INITIAL_BEARING}), final bearing (
   *            {@link #FINAL_BEARING}) and distance ({@link #DISTANCE}).
   * @return geodesic distance in Meters
   */
  private vincentyFormula(location: GeoLocation, formula: number): number {
    const a: number = 6378137;
    const b: number = 6356752.3142;
    const f: number = 1 / 298.257223563; // WGS-84 ellipsiod
    const L: number = MathUtils.degreesToRadians(location.getLongitude() - this.getLongitude());
    const U1: number = Math.atan((1 - f) * Math.tan(MathUtils.degreesToRadians(this.getLatitude())));
    const U2: number = Math.atan((1 - f) * Math.tan(MathUtils.degreesToRadians(location.getLatitude())));
    const sinU1: number = Math.sin(U1);
    const cosU1: number = Math.cos(U1);
    const sinU2: number = Math.sin(U2);
    const cosU2: number = Math.cos(U2);

    let lambda: number = L;
    let lambdaP: number = 2 * Math.PI;
    let iterLimit: number = 20;
    let sinLambda: number = 0;
    let cosLambda: number = 0;
    let sinSigma: number = 0;
    let cosSigma: number = 0;
    let sigma: number = 0;
    let sinAlpha: number = 0;
    let cosSqAlpha: number = 0;
    let cos2SigmaM: number = 0;
    let C: number;

    while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0) {
      sinLambda = Math.sin(lambda);
      cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda)
        + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
      if (sinSigma === 0) return 0; // co-incident points
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
      cosSqAlpha = 1 - sinAlpha * sinAlpha;
      cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
      if (Number.isNaN(cos2SigmaM)) cos2SigmaM = 0; // equatorial line: cosSqAlpha=0 (§6)
      C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      lambdaP = lambda;
      lambda = L + (1 - C) * f * sinAlpha
        * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    }
    if (iterLimit === 0) return Number.NaN; // formula failed to converge

    const uSq: number = cosSqAlpha * (a * a - b * b) / (b * b);
    const A: number = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B: number = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    const deltaSigma: number = B * sinSigma
      * (cos2SigmaM + B / 4
        * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM
          * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    const distance: number = b * A * (sigma - deltaSigma);

    // initial bearing
    const fwdAz: number = MathUtils.radiansToDegrees(Math.atan2(cosU2 * sinLambda, cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
    // final bearing
    const revAz: number = MathUtils.radiansToDegrees(Math.atan2(cosU1 * sinLambda, -sinU1 * cosU2 + cosU1 * sinU2 * cosLambda));
    if (formula === GeoLocation.DISTANCE) {
      return distance;
    } else if (formula === GeoLocation.INITIAL_BEARING) {
      return fwdAz;
    } else if (formula === GeoLocation.FINAL_BEARING) {
      return revAz;
    }
    // should never happen
    return Number.NaN;
  }

  /**
   * Returns the <a href="https://en.wikipedia.org/wiki/Rhumb_line">rhumb line</a> bearing from the current location to
   * the GeoLocation passed in.
   *
   * @param location
   *            destination location
   * @return the bearing in degrees
   */
  public getRhumbLineBearing(location: GeoLocation): number {
    let dLon: number = MathUtils.degreesToRadians(location.getLongitude() - this.getLongitude());
    const dPhi: number = Math.log(Math.tan(MathUtils.degreesToRadians(location.getLatitude()) / 2 + Math.PI / 4)
      / Math.tan(MathUtils.degreesToRadians(this.getLatitude()) / 2 + Math.PI / 4));
    if (Math.abs(dLon) > Math.PI) dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon);
    return MathUtils.radiansToDegrees(Math.atan2(dLon, dPhi));
  }

  /**
   * Returns the <a href="https://en.wikipedia.org/wiki/Rhumb_line">rhumb line</a> distance from the current location
   * to the GeoLocation passed in.
   *
   * @param location
   *            the destination location
   * @return the distance in Meters
   */
  public getRhumbLineDistance(location: GeoLocation): number {
    const earthRadius: number = 6378137; // earth's mean radius in km
    const dLat: number = MathUtils.degreesToRadians(location.getLatitude()) - MathUtils.degreesToRadians(this.getLatitude());
    let dLon: number = Math.abs(MathUtils.degreesToRadians(location.getLongitude()) - MathUtils.degreesToRadians(this.getLongitude()));
    const dPhi: number = Math.log(Math.tan(MathUtils.degreesToRadians(location.getLatitude()) / 2 + Math.PI / 4)
      / Math.tan(MathUtils.degreesToRadians(this.getLatitude()) / 2 + Math.PI / 4));

    let q: number = dLat / dPhi;
    if (!Number.isFinite(q)) {
      q = Math.cos(MathUtils.degreesToRadians(this.getLatitude()));
    }

    // if dLon over 180° take shorter rhumb across 180° meridian:
    if (dLon > Math.PI) {
      dLon = 2 * Math.PI - dLon;
    }
    const d: number = Math.sqrt(dLat * dLat + q * q * dLon * dLon);
    return d * earthRadius;
  }

  /**
   * A method that returns an XML formatted <code>String</code> representing the serialized <code>Object</code>. Very
   * similar to the toString method but the return value is in an xml format. The format currently used (subject to
   * change) is:
   *
   * <pre>
   *   &lt;GeoLocation&gt;
   *        &lt;LocationName&gt;Lakewood, NJ&lt;/LocationName&gt;
   *        &lt;Latitude&gt;40.0828&amp;deg&lt;/Latitude&gt;
   *        &lt;Longitude&gt;-74.2094&amp;deg&lt;/Longitude&gt;
   *        &lt;Elevation&gt;0 Meters&lt;/Elevation&gt;
   *        &lt;TimezoneName&gt;America/New_York&lt;/TimezoneName&gt;
   *        &lt;TimeZoneDisplayName&gt;Eastern Standard Time&lt;/TimeZoneDisplayName&gt;
   *        &lt;TimezoneGMTOffset&gt;-5&lt;/TimezoneGMTOffset&gt;
   *        &lt;TimezoneDSTOffset&gt;1&lt;/TimezoneDSTOffset&gt;
   *   &lt;/GeoLocation&gt;
   * </pre>
   *
   * @return The XML formatted <code>String</code>.
   * @deprecated
   */
  // eslint-disable-next-line class-methods-use-this
  public toXML(): void {
    throw new UnsupportedError('This method is deprecated');
  }

  /**
   * @see java.lang.Object#equals(Object)
   */
  public equals(object: object): boolean {
    if (this === object) return true;
    if (!(object instanceof GeoLocation)) return false;

    const geo: GeoLocation = object as GeoLocation;
    return this.latitude === geo.latitude
      && this.longitude === geo.longitude
      && this.elevation === geo.elevation
      && this.locationName === geo.locationName
      && this.timeZoneId === geo.getTimeZone();
  }

  /**
   * @see java.lang.Object#toString()
   */
  public toString(): string {
    return (`Location Name:\t\t\t${this.getLocationName()}`)
      .concat(`\nLatitude:\t\t\t${this.getLatitude().toString()}\u00B0`)
      .concat(`\nLongitude:\t\t\t${this.getLongitude().toString()}\u00B0`)
      .concat(`\nElevation:\t\t\t${this.getElevation().toString()} Meters`)
      .concat(`\nTimezone ID:\t\t\t${this.getTimeZone()}`)
      .concat(`\nTimezone Display Name:\t\t${TimeZone.getDisplayName(this.getTimeZone())}`)
      .concat(` (${TimeZone.getDisplayName(this.getTimeZone(), DateTime.local(), true)})`)
      .concat(`\nTimezone GMT Offset:\t\t${(TimeZone.getRawOffset(this.getTimeZone()) / GeoLocation.HOUR_MILLIS).toString()}`)
      .concat(`\nTimezone DST Offset:\t\t${(TimeZone.getDSTSavings(this.getTimeZone()) / GeoLocation.HOUR_MILLIS).toString()}`);
  }

  /**
   * An implementation of the {@link java.lang.Object#clone()} method that creates a <a
   * href="https://en.wikipedia.org/wiki/Object_copy#Deep_copy">deep copy</a> of the object.
   * <b>Note:</b> If the {@link java.util.TimeZone} in the clone will be changed from the original, it is critical
   * that {@link AstronomicalCalendar#getCalendar()}.
   * {@link java.util.Calendar#setTimeZone(TimeZone) setTimeZone(TimeZone)} is called after cloning in order for the
   * AstronomicalCalendar to output times in the expected offset.
   *
   * @see java.lang.Object#clone()
   * @since 1.1
   */
  public clone(): GeoLocation {
    return JSON.parse(JSON.stringify(this));
  }
}

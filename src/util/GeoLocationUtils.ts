import {GeoLocation} from "./GeoLocation";
import {MathUtils} from "../polyfills/Utils";

/**
 * A class for various location calculations
 * Most of the code in this class is ported from <a href="http://www.movable-type.co.uk/">Chris Veness'</a>
 * <a href="http://www.fsf.org/licensing/licenses/lgpl.html">LGPL</a> Javascript Implementation
 *
 * @author &copy; Eliyahu Hershfeld 2009 - 2014
 * @version 0.1
 */
export class GeoLocationUtils {
    private static readonly DISTANCE: number = 0;
    private static readonly INITIAL_BEARING: number = 1;
    private static readonly FINAL_BEARING: number = 2;

    /**
     * Calculate the initial <a
     * href="http://en.wikipedia.org/wiki/Great_circle">geodesic</a> initial bearing
     * between this Object and a second Object passed to this method using <a
     * href="http://en.wikipedia.org/wiki/Thaddeus_Vincenty">Thaddeus Vincenty's</a>
     * inverse formula See T Vincenty, "<a
     * href="http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf">Direct and Inverse
     * Solutions of Geodesics on the Ellipsoid with application of nested
     * equations</a>", Survey Review, vol XXII no 176, 1975.
     *
     * @param location
     *            the initial location
     * @param destination
     *            the destination location
     * @return the geodesic bearing
     */
    public static getGeodesicInitialBearing(location: GeoLocation, destination: GeoLocation): number {
        return GeoLocationUtils.vincentyFormula(location, destination, GeoLocationUtils.INITIAL_BEARING);
    }

    /**
     * Calculate the final <a
     * href="http://en.wikipedia.org/wiki/Great_circle">geodesic</a> final bearing
     * between this Object and a second Object passed to this method using <a
     * href="http://en.wikipedia.org/wiki/Thaddeus_Vincenty">Thaddeus Vincenty's</a>
     * inverse formula See T Vincenty, "<a
     * href="http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf">Direct and Inverse
     * Solutions of Geodesics on the Ellipsoid with application of nested
     * equations</a>", Survey Review, vol XXII no 176, 1975.
     *
     * @param location
     *            the initial location
     * @param destination
     *            the destination location
     * @return the geodesic bearing
     */
    public static getGeodesicFinalBearing(location: GeoLocation, destination: GeoLocation): number {
        return GeoLocationUtils.vincentyFormula(location, destination, GeoLocationUtils.FINAL_BEARING);
    }

    /**
     * Calculate <a
     * href="http://en.wikipedia.org/wiki/Great-circle_distance">geodesic
     * distance</a> in Meters between this Object and a second Object passed to
     * this method using the <a
     * href="https://en.wikipedia.org/wiki/Vincenty%27s_formulae">Thaddeus Vincenty formulae</a>.
     * See T Vincenty, "<a href="http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf">Direct and Inverse
     * Solutions of Geodesics on the Ellipsoid with application of nested
     * equations</a>", Survey Review, vol XXII no 176, 1975.
     *
     * This uses the WGS-84 geodetic model
     * @param location
     *            the initial location
     * @param destination
     *            the destination location
     * @return the geodesic distance in Meters
     */
    public static getGeodesicDistance(location: GeoLocation, destination: GeoLocation): number {
        return GeoLocationUtils.vincentyFormula(location, destination, GeoLocationUtils.DISTANCE);
    }

    /**
     * Calculate <a
     * href="http://en.wikipedia.org/wiki/Great-circle_distance">geodesic
     * distance</a> in Meters between this Object and a second Object passed to
     * this method using <a
     * href="http://en.wikipedia.org/wiki/Thaddeus_Vincenty">Thaddeus Vincenty's</a>
     * inverse formula See T Vincenty, "<a
     * href="http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf">Direct and Inverse
     * Solutions of Geodesics on the Ellipsoid with application of nested
     * equations</a>", Survey Review, vol XXII no 176, 1975. This uses
     * the <a href="https://en.wikipedia.org/wiki/World_Geodetic_System#A_new_World_Geodetic_System:_WGS_84">WGS-84 geodetic model</a>.
     *
     * @param location
     *            the initial location
     * @param destination
     *            the destination location
     * @param formula
     *            This formula calculates initial bearing ({@link #INITIAL_BEARING}),
     *            final bearing ({@link #FINAL_BEARING}) and distance ({@link #DISTANCE}).
     * @param the geodesic distance, initial or final bearing (based on the formula passed in)
     */
    private static vincentyFormula(location: GeoLocation, destination: GeoLocation, formula: number): number {
        const a: number = 6378137; // length of semi-major axis of the ellipsoid (radius at equator) in metres based on WGS-84
        const b: number = 6356752.3142; // length of semi-minor axis of the ellipsoid (radius at the poles) in meters based on WGS-84
        const f: number = 1 / 298.257223563; // flattening of the ellipsoid based on WGS-84
        const L: number = MathUtils.degreesToRadians(destination.getLongitude() - location.getLongitude()); //difference in longitude of two points;
        const U1: number = Math.atan((1 - f) * Math.tan(MathUtils.degreesToRadians(location.getLatitude()))); // reduced latitude (latitude on the auxiliary sphere)
        const U2: number = Math.atan((1 - f) * Math.tan(MathUtils.degreesToRadians(destination.getLatitude()))); // reduced latitude (latitude on the auxiliary sphere)
        const sinU1: number = Math.sin(U1), cosU1: number = Math.cos(U1);
        const sinU2: number = Math.sin(U2), cosU2: number = Math.cos(U2);

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
                    + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
                    * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
            if (sinSigma === 0) return 0; // co-incident points
            cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
            sigma = Math.atan2(sinSigma, cosSigma);
            sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
            cosSqAlpha = 1 - sinAlpha * sinAlpha;
            cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
            if (Number.isNaN(cos2SigmaM)) cos2SigmaM = 0; // equatorial line: cosSqAlpha=0 (§6)
            C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
            lambdaP = lambda;
            lambda = L
                    + (1 - C)
                    * f
                    * sinAlpha
                    * (sigma + C
                            * sinSigma
                            * (cos2SigmaM + C * cosSigma
                                    * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
        }
        if (iterLimit === 0) return Number.NaN; // formula failed to converge

        const uSq: number = cosSqAlpha * (a * a - b * b) / (b * b);
        const A: number = 1 + uSq / 16384
                * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
        const B: number = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
        const deltaSigma: number = B
                * sinSigma
                * (cos2SigmaM + B
                        / 4
                        * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B
                                / 6 * cos2SigmaM
                                * (-3 + 4 * sinSigma * sinSigma)
                                * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
        const distance: number = b * A * (sigma - deltaSigma);

        // initial bearing
        const fwdAz: number = MathUtils.radiansToDegrees(Math.atan2(cosU2 * sinLambda, cosU1
                * sinU2 - sinU1 * cosU2 * cosLambda));
        // final bearing
        const revAz: number = MathUtils.radiansToDegrees(Math.atan2(cosU1 * sinLambda, -sinU1
                * cosU2 + cosU1 * sinU2 * cosLambda));
        if (formula === GeoLocationUtils.DISTANCE) {
            return distance;
        } else if (formula === GeoLocationUtils.INITIAL_BEARING) {
            return fwdAz;
        } else if (formula === GeoLocationUtils.FINAL_BEARING) {
            return revAz;
        } else { // should never happpen
            return Number.NaN;
        }
    }

    /**
     * Returns the <a href="http://en.wikipedia.org/wiki/Rhumb_line">rhumb line</a>
     * bearing from the current location to the GeoLocation passed in.
     *
     * @param location
     *            the initial location
     * @param destination
     *            the destination location
     * @return the bearing in degrees
     */
    public static getRhumbLineBearing(location: GeoLocation, destination: GeoLocation): number {
        let dLon: number = MathUtils.degreesToRadians(destination.getLongitude() - location.getLongitude());
        const dPhi: number = Math.log(Math.tan(MathUtils.degreesToRadians(destination.getLatitude())
                / 2 + Math.PI / 4)
                / Math.tan(MathUtils.degreesToRadians(location.getLatitude()) / 2 + Math.PI / 4));
        if (Math.abs(dLon) > Math.PI) dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon);
        return MathUtils.radiansToDegrees(Math.atan2(dLon, dPhi));
    }

    /**
     * Returns the <a href="http://en.wikipedia.org/wiki/Rhumb_line">rhumb line</a>
     * distance from the current location to the GeoLocation passed in.
     * Ported from <a href="http://www.movable-type.co.uk/">Chris Veness'</a> Javascript Implementation
     *
     * @param location
     *            the initial location
     * @param destination
     *            the destination location
     * @return the distance in Meters
     */
    public static getRhumbLineDistance(location: GeoLocation, destination: GeoLocation): number {
        const R: number = 6371; // earth's mean radius in km
        const dLat: number = MathUtils.degreesToRadians(destination.getLatitude() - location.getLatitude());
        let dLon: number = MathUtils.degreesToRadians(Math.abs(destination.getLongitude()
                - location.getLongitude()));
        const dPhi: number = Math.log(Math.tan(MathUtils.degreesToRadians(destination.getLongitude())
                / 2 + Math.PI / 4)
                / Math.tan(MathUtils.degreesToRadians(location.getLatitude()) / 2 + Math.PI / 4));
        const q: number = (Math.abs(dLat) > 1e-10) ? dLat / dPhi : Math.cos(MathUtils.degreesToRadians(location.getLatitude()));
        // if dLon over 180° take shorter rhumb across 180° meridian:
        if (dLon > Math.PI) dLon = 2 * Math.PI - dLon;
        const d: number = Math.sqrt(dLat * dLat + q * q * dLon * dLon);
        return d * R;
    }

}

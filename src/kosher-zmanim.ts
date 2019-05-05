import Time from "./util/Time";
import GeoLocation from "./util/GeoLocation";
import GeoLocationUtils from "./util/GeoLocationUtils";

import NOAACalculator from "./util/NOAACalculator";
import SunTimesCalculator from "./util/SunTimesCalculator";
import ZmanimCalculator from "./util/ZmanimCalculator";

import AstronomicalCalendar from "./AstronomicalCalendar";
import ZmanimCalendar from "./ZmanimCalendar";
import ComplexZmanimCalendar from "./ComplexZmanimCalendar";

import JewishDate from "./hebrewcalendar/JewishDate";
import JewishCalendar from "./hebrewcalendar/JewishCalendar";
import Daf from "./hebrewcalendar/Daf";
import YomiCalculator from "./hebrewcalendar/YomiCalculator";
import YerushalmiYomiCalculator from "./hebrewcalendar/YerushalmiYomiCalculator";

import HebrewDateFormatter from "./hebrewcalendar/HebrewDateFormatter";
import ZmanimFormatter from "./util/ZmanimFormatter";

import * as MomentTimezone from "moment-timezone";
import Moment = MomentTimezone.Moment;

export default class KosherZmanim {
    private zmanimCalendar: ZmanimCalendar;

    public static readonly lib = {
        Time: Time,
        GeoLocation: GeoLocation,
        GeoLocationUtils: GeoLocationUtils,

        NOAACalculator: NOAACalculator,
        SunTimesCalculator: SunTimesCalculator,
        ZmanimCalculator: ZmanimCalculator,

        AstronomicalCalendar: AstronomicalCalendar,
        ZmanimCalendar: ZmanimCalendar,
        ComplexZmanimCalendar: ComplexZmanimCalendar,

        JewishDate: JewishDate,
        JewishCalendar: JewishCalendar,
        Daf: Daf,
        YomiCalculator: YomiCalculator,
        YerushalmiYomiCalculator: YerushalmiYomiCalculator,

        HebrewDateFormatter: HebrewDateFormatter,
        ZmanimFormatter: ZmanimFormatter,

        MomentTimezone: MomentTimezone
};

    constructor(options: ZmanimConstructorOptions) {
        const moment: Moment = MomentTimezone.tz(options.date, options.timeZoneId);

        const geoLocation: GeoLocation = new GeoLocation(options.locationName, options.latitude, options.longitude, options.elevation || 0);
        geoLocation.setTimeZone(options.timeZoneId);

        this.zmanimCalendar = options.complexZmanim ? new ComplexZmanimCalendar(geoLocation) : new ZmanimCalendar(geoLocation);
        this.zmanimCalendar.setMoment(moment);
    }

    /**
     * @deprecated
     */
    public getZmanimXML(): string {
        throw new Error("This method is no longer supported");
    }

    public getZmanimJson(): JsonOutput {
        return ZmanimFormatter.toJSON(this.zmanimCalendar);
    }
}

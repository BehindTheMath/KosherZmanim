import {GeoLocation} from "./util/GeoLocation";
import {ZmanimCalendar} from "./ZmanimCalendar";
import {ComplexZmanimCalendar} from "./ComplexZmanimCalendar";
import {JsonOutput, ZmanimFormatter} from "./util/ZmanimFormatter";

import * as _MomentTimezone from "moment-timezone";
import Moment = _MomentTimezone.Moment;

/**
 * @deprecated
 */
export function getZmanimXML(): string {
  throw new Error("This method is no longer supported");
}

export function getZmanimJson(options: Options): JsonOutput {
  const moment: Moment = _MomentTimezone.tz(options.date, options.timeZoneId);

  const geoLocation: GeoLocation = new GeoLocation(options.locationName, options.latitude, options.longitude,
    options.elevation || 0);
  geoLocation.setTimeZone(options.timeZoneId);

  const zmanimCalendar: ZmanimCalendar = options.complexZmanim
    ? new ComplexZmanimCalendar(geoLocation)
    : new ZmanimCalendar(geoLocation);
  zmanimCalendar.setMoment(moment);
  return ZmanimFormatter.toJSON(zmanimCalendar);
}

export interface Options {
  date: Date | string | number;
  timeZoneId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  complexZmanim?: boolean;
}

export * from "./util/Time";
export * from "./util/GeoLocation";
export * from "./util/GeoLocationUtils";
export * from "./util/Zman";
export * from "./polyfills/Utils";

export * from "./util/NOAACalculator";
export * from "./util/SunTimesCalculator";

export * from "./AstronomicalCalendar";
export * from "./ZmanimCalendar";
export * from "./ComplexZmanimCalendar";

export * from "./hebrewcalendar/JewishDate";
export * from "./hebrewcalendar/JewishCalendar";
export * from "./hebrewcalendar/Daf";
export * from "./hebrewcalendar/YomiCalculator";
export * from "./hebrewcalendar/YerushalmiYomiCalculator";

export * from "./hebrewcalendar/HebrewDateFormatter";
export * from "./util/ZmanimFormatter";

export const MomentTimezone = _MomentTimezone;

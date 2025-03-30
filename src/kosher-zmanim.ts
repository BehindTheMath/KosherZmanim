import { Temporal } from 'temporal-polyfill';
import { GeoLocation } from './util/GeoLocation';
import { ZmanimCalendar } from './ZmanimCalendar';
import { ComplexZmanimCalendar } from './ComplexZmanimCalendar';
import { JsonOutput, ZmanimFormatter } from './util/ZmanimFormatter';

export function getZmanimJson(options: Options): JsonOutput {
  const geoLocation: GeoLocation = new GeoLocation(options.locationName || null, options.latitude, options.longitude,
    options.elevation || 0, options.timeZoneId);

  const zmanimCalendar: ZmanimCalendar = options.complexZmanim
    ? new ComplexZmanimCalendar(geoLocation)
    : new ZmanimCalendar(geoLocation);
  zmanimCalendar.setDate(options.date || Temporal.Now.plainDateISO());
  return ZmanimFormatter.toJSON(zmanimCalendar);
}

export interface Options {
  /**
   * @default The current local date. The time is ignored.
   */
  date?: Date | string | number | Temporal.PlainDate;
  /**
   * IANA timezone ID
   */
  timeZoneId: string;
  locationName?: string;
  latitude: number;
  longitude: number;
  /**
   * @default 0
   */
  elevation?: number;
  /**
   * Whether to use `ComplexZmanimCalendar` instead of `ZmanimCalendar`
   * @default false
   */
  complexZmanim?: boolean;
}

export * from './util/Time';
export * from './util/GeoLocation';
export * from './util/GeoLocationUtils';
export * from './util/Zman';
export * from './polyfills/Utils';

export * from './util/NOAACalculator';
export * from './util/SunTimesCalculator';

export * from './AstronomicalCalendar';
export * from './ZmanimCalendar';
export * from './ComplexZmanimCalendar';

export * from './hebrewcalendar/JewishDate';
export * from './hebrewcalendar/JewishCalendar';
export * from './hebrewcalendar/Daf';
export * from './hebrewcalendar/YomiCalculator';
export * from './hebrewcalendar/YerushalmiYomiCalculator';

export * from './hebrewcalendar/HebrewDateFormatter';
export * from './util/ZmanimFormatter';

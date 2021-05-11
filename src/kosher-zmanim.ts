import * as _Luxon from 'luxon';

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
  zmanimCalendar.setDate(options.date || _Luxon.DateTime.local());
  return ZmanimFormatter.toJSON(zmanimCalendar);
}

export interface Options {
  /**
   * @default Current date and time
   */
  date?: Date | string | number | _Luxon.DateTime;
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

export const Luxon = _Luxon;

import * as _Luxon from 'luxon';
import * as _Big from 'big.js'

import { GeoLocation } from './util/GeoLocation.ts';
import { ZmanimCalendar } from './ZmanimCalendar.ts';
import { ComplexZmanimCalendar } from './ComplexZmanimCalendar.ts';
import { JsonOutput, ZmanimFormatter } from './util/ZmanimFormatter.ts';

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

export * from './util/Time.ts';
export * from './util/GeoLocation.ts';
export * from './util/GeoLocationUtils.ts';
export * from './util/Zman.ts';
export * from './polyfills/Utils.ts';

export * from './util/NOAACalculator.ts';
export * from './util/SunTimesCalculator.ts';

export * from './AstronomicalCalendar.ts';
export * from './ZmanimCalendar.ts';
export * from './ComplexZmanimCalendar.ts';

export * from './hebrewcalendar/JewishDate.ts';
export * from './hebrewcalendar/JewishCalendar.ts';
export * from './hebrewcalendar/Daf.ts';
export * from './hebrewcalendar/YomiCalculator.ts';
export * from './hebrewcalendar/YerushalmiYomiCalculator.ts';

export * from './hebrewcalendar/HebrewDateFormatter.ts';
export * from './util/ZmanimFormatter.ts';

export const Luxon = _Luxon;
export const BigNumber = _Big
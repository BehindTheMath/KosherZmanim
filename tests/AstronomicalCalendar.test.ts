import { describe, it } from 'mocha';
import { assert } from 'chai';
import { DateTime } from 'luxon';
import { GeoLocation } from '../src/util/GeoLocation';
import { AstronomicalCalendar } from '../src/AstronomicalCalendar';

// eslint-disable-next-line require-jsdoc
function makeZmanWithElevation() {
  const latitude = 39.73915;
  const longitude = -104.9847;
  const elevtion = 1636;
  const tzid = 'America/Denver';
  const gloc = new GeoLocation(null, latitude, longitude, elevtion, tzid);
  const plainDate = DateTime.fromISO('2020-06-05'); // Friday June 5 2020
  const noaa = new AstronomicalCalendar(gloc);
  noaa.setDate(plainDate);
  return noaa;
}

/*
   * | Civil Date | Jun 5, 2020|
   * | Jewish Date | 13 Sivan, 5780|
   * | Day of Week | Fri|
   * | Alos 16.1° | 3:48:37 AM|
   * | Alos 72 Minutes | 4:12:30 AM|
   * | Misheyakir 10.2° | 4:32:14 AM|
   * | Sunrise (1636.0 Meters) | 5:24:30 AM|
   * | Sunrise (Sea Level) | 5:32:26 AM|
   * | Sof Zman Shma MGA 72 Minutes | 8:35:37 AM|
   * | Sof Zman Shma GRA | 9:11:37 AM|
   * | Sof Zman Tfila MGA 72 Minutes | 10:03:19 AM|
   * | Sof Zman Tfila GRA | 10:27:19 AM|
   * | Chatzos Astronomical | 12:58:30 PM|
   * | Mincha Gedola GRA | 1:36:35 PM|
   * | Plag Hamincha | 6:58:19 PM|
   * | Candle Lighting 18 Minutes | 8:07:01 PM|
   * | Sunset (Sea Level) | 8:25:01 PM|
   * | Sunset (1636.0 Meters) | 8:32:57 PM|
   * | Tzais Geonim 8.5° | 9:13:45 PM|
   * | Tzais 72 Minutes | 9:44:57 PM|
   * | Tzais 16.1° | 10:09:05 PM
   */

describe('Test AstronomicalCalendar', function () {
  it('getSunrise', () => {
    const noaa = makeZmanWithElevation();
    const zdt = noaa.getSunrise();
    assert.strictEqual((zdt as DateTime).toString(),
      '2020-06-05T11:24:30.501Z');
  });

  it('getSeaLevelSunrise', () => {
    const noaa = makeZmanWithElevation();
    const zdt = noaa.getSeaLevelSunrise();
    assert.strictEqual((zdt as DateTime).toString(),
      '2020-06-05T11:32:26.007Z');
  });

  it('getSunset', () => {
    const noaa = makeZmanWithElevation();
    const zdt = noaa.getSunset();
    assert.strictEqual((zdt as DateTime).toString(),
      '2020-06-06T02:32:57.848Z');
  });

  it('getSeaLevelSunset', () => {
    const noaa = makeZmanWithElevation();
    const zdt = noaa.getSeaLevelSunset();
    assert.strictEqual((zdt as DateTime).toString(),
      '2020-06-06T02:25:01.588Z');
  });

  it('getSunriseOffsetByDegrees', () => {
    const noaa = makeZmanWithElevation();
    const zdt1 = noaa.getSunriseOffsetByDegrees(90 + 16.1);
    assert.strictEqual((zdt1 as DateTime).toString(),
      '2020-06-05T09:48:37.581Z');
    const zdt2 = noaa.getSunriseOffsetByDegrees(90 + 11.5);
    assert.strictEqual((zdt2 as DateTime).toString(),
      '2020-06-05T10:23:08.923Z');
    const zdt3 = noaa.getSunriseOffsetByDegrees(90 + 10.2);
    assert.strictEqual((zdt3 as DateTime).toString(),
      '2020-06-05T10:32:14.456Z');
  });

  it('getSunsetOffsetByDegrees', () => {
    const noaa = makeZmanWithElevation();
    const zdt1 = noaa.getSunsetOffsetByDegrees(90 + 7.083);
    assert.strictEqual((zdt1 as DateTime).toString(),
      '2020-06-06T03:04:21.276Z');
    const zdt2 = noaa.getSunsetOffsetByDegrees(90 + 8.5);
    assert.strictEqual((zdt2 as DateTime).toString(),
      '2020-06-06T03:13:45.311Z');
  });

  it('getSunTransit', () => {
    const noaa = makeZmanWithElevation();
    const zdt = noaa.getSunTransit();
    assert.strictEqual((zdt as DateTime).toString(),
      '2020-06-05T18:58:43.797Z');
  });
});

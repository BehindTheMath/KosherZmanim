/* eslint-disable max-len */
import { Temporal } from 'temporal-polyfill';
import { test } from 'mocha';
import { assert } from 'chai';
import { GeoLocation } from '../src/util/GeoLocation';
import { ZmanimCalendar } from '../src/ZmanimCalendar';

// eslint-disable-next-line require-jsdoc
function makeZmanimCalendar(): ZmanimCalendar {
  const latitude = 39.73915;
  const longitude = -104.9847;
  const elevtion = 1636;
  const tzid = 'America/Denver';
  const gloc = new GeoLocation(null, latitude, longitude, elevtion, tzid);
  const zman = new ZmanimCalendar(gloc);
  zman.setUseElevation(true);
  const plainDate = new Temporal.PlainDate(2020, 6, 5); // Friday June 5 2020
  zman.setDate(plainDate);
  return zman;
}

test('isUseElevation and setUseElevation', () => {
  const zman = makeZmanimCalendar();
  assert.isTrue(zman.isUseElevation());
  zman.setUseElevation(false);
  assert.isFalse(zman.isUseElevation());
});

test('isUseAstronomicalChatzos and setUseAstronomicalChatzos', () => {
  const zman = makeZmanimCalendar();
  assert.isTrue(zman.isUseAstronomicalChatzos());
  zman.setUseAstronomicalChatzos(false);
  assert.isFalse(zman.isUseAstronomicalChatzos());
});

test('isUseAstronomicalChatzosForOtherZmanim and setUseAstronomicalChatzosForOtherZmanim', () => {
  const zman = makeZmanimCalendar();
  assert.isFalse(zman.isUseAstronomicalChatzosForOtherZmanim());
  zman.setUseAstronomicalChatzosForOtherZmanim(true);
  assert.isTrue(zman.isUseAstronomicalChatzosForOtherZmanim());
});

test('getCandleLightingOffset and setCandleLightingOffset', () => {
  const zman = makeZmanimCalendar();
  assert.strictEqual(zman.getCandleLightingOffset(), 18);
  zman.setCandleLightingOffset(20);
  assert.strictEqual(zman.getCandleLightingOffset(), 20);
});

test('getChatzos', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getChatzos();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T12:58:30.268-06:00[America/Denver]');
});

test('getChatzosAsHalfDay', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getChatzosAsHalfDay();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T12:58:43.797-06:00[America/Denver]');
});

test('getSofZmanShmaGRA', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSofZmanShmaGRA();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T09:11:37.337-06:00[America/Denver]');
});

test('getSofZmanShmaMGA', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSofZmanShmaMGA();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T08:35:37.337-06:00[America/Denver]');
});

test('getCandleLighting', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getCandleLighting();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T20:07:01.588-06:00[America/Denver]');
});

test('getSofZmanTfilaGRA', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSofZmanTfilaGRA();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T10:27:19.616-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSofZmanTfilaMGA();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T10:03:19.616-06:00[America/Denver]');
});

test('getMinchaGedola', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getMinchaGedola();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T13:36:35.313-06:00[America/Denver]');
});

test('getSamuchLeMinchaKetana', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSamuchLeMinchaKetana(zman.getSunrise(), zman.getSunset());
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T16:45:51.011-06:00[America/Denver]');
});

test('getMinchaKetana', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getMinchaKetana();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T17:23:42.15-06:00[America/Denver]');
});

test('getPlagHamincha', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getPlagHamincha();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2020-06-05T18:58:19.999-06:00[America/Denver]');
});

test('getShaahZmanisGra', () => {
  const zman = makeZmanimCalendar();
  const shaahZmanis = zman.getShaahZmanisGra();
  assert.closeTo(shaahZmanis, 4542278.9, 0.1);
});

test('getShaahZmanisMGA', () => {
  const zman = makeZmanimCalendar();
  const shaahZmanis = zman.getShaahZmanisMGA();
  assert.closeTo(shaahZmanis, 5262278.9, 0.1);
});

test('isAssurBemlacha', () => {
  const zman = makeZmanimCalendar();
  const sunset = zman.getSunset()!;
  const twoMinutesAfterSunset = sunset.add({ minutes: 2 });
  const tzais = zman.getTzais()!;
  assert.isTrue(zman.isAssurBemlacha(twoMinutesAfterSunset, tzais, false));
});

test('getShaahZmanisBasedZman', () => {
  const zman = makeZmanimCalendar();
  const sunrise = zman.getSunrise();
  const sunset = zman.getSunset();
  const sofZmanShma = zman.getShaahZmanisBasedZman(sunrise, sunset, 3);
  assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T09:11:37.337-06:00[America/Denver]');
});

test('getPercentOfShaahZmanisFromDegrees', () => {
  const zman = makeZmanimCalendar();
  const percent = zman.getPercentOfShaahZmanisFromDegrees(16.1, true);
  assert.closeTo(percent, 1.399, 0.001);
});

test('getHalfDayBasedZman', () => {
  const zman = makeZmanimCalendar();
  zman.setUseAstronomicalChatzosForOtherZmanim(true);
  const chatzos = zman.getChatzos();
  const sunset = zman.getSunset();
  const minchaGedola = zman.getHalfDayBasedZman(chatzos, sunset, 0.5);
  assert.strictEqual(minchaGedola!.toString(), '2020-06-05T13:36:22.566-06:00[America/Denver]');
});

test('getHalfDayBasedShaahZmanis', () => {
  const zman = makeZmanimCalendar();
  const chatzos = zman.getChatzos();
  const sunset = zman.getSunset();
  const shaahZmanis = zman.getHalfDayBasedShaahZmanis(chatzos, sunset);
  assert.closeTo(shaahZmanis, 4544596.66, 0.01);
});

test('getClassName', () => {
  const zman = makeZmanimCalendar();
  assert.strictEqual(zman.getClassName(), 'com.kosherjava.zmanim.ZmanimCalendar');
});

/* eslint-disable max-len */
import { Temporal } from 'temporal-polyfill';
import { test } from 'mocha';
import { assert } from 'chai';
import { GeoLocation } from '../src/util/GeoLocation';
import { ComplexZmanimCalendar } from '../src/ComplexZmanimCalendar';
import { JewishCalendar } from '../src/hebrewcalendar/JewishCalendar';

// eslint-disable-next-line require-jsdoc
function makeZmanimCalendar(): ComplexZmanimCalendar {
  const latitude = 32.08088;
  const longitude = 34.78057;
  const tzid = 'Asia/Jerusalem';
  const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
  const zman = new ComplexZmanimCalendar(gloc);
  zman.setUseElevation(false);
  const plainDate = new Temporal.PlainDate(2025, 3, 9); // Wednesday March 9 2025
  zman.setDate(plainDate);
  return zman;
}

test('getAlosBaalHatanya', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getAlosBaalHatanya();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T04:42:40.107+02:00[Asia/Jerusalem]');
});

test('getSofZmanShmaBaalHatanya', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSofZmanShmaBaalHatanya();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T08:53:17.505+02:00[Asia/Jerusalem]');
});

test('getSofZmanTfilaBaalHatanya', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSofZmanTfilaBaalHatanya();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T09:52:43.231+02:00[Asia/Jerusalem]');
});

test('getSofZmanAchilasChametzBaalHatanya', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSofZmanAchilasChametzBaalHatanya();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T09:52:43.231+02:00[Asia/Jerusalem]');
});

test('getSofZmanBiurChametzBaalHatanya', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSofZmanBiurChametzBaalHatanya();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T10:52:08.956+02:00[Asia/Jerusalem]');
});

test('getMinchaGedolaBaalHatanya', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getMinchaGedolaBaalHatanya();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T12:21:17.545+02:00[Asia/Jerusalem]');
});

test('getMinchaGedolaBaalHatanyaGreaterThan30', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getMinchaGedolaBaalHatanyaGreaterThan30();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T12:21:27.672+02:00[Asia/Jerusalem]');
});

test('getMinchaKetanaBaalHatanya', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getMinchaKetanaBaalHatanya();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T15:19:34.722+02:00[Asia/Jerusalem]');
});

test('getPlagHaminchaBaalHatanya', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getPlagHaminchaBaalHatanya();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T16:33:51.879+02:00[Asia/Jerusalem]');
});

test('getTzaisBaalHatanya', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getTzaisBaalHatanya();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T18:09:02.216+02:00[Asia/Jerusalem]');
});

test('getSofZmanBiurChametzMGA72Minutes', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSofZmanBiurChametzMGA72Minutes();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T10:40:44.331+02:00[Asia/Jerusalem]');
});

test('getSofZmanShmaMGA18DegreesToFixedLocalChatzos', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getSofZmanShmaMGA18DegreesToFixedLocalChatzos();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T08:09:09.925+02:00[Asia/Jerusalem]');
});

test('getPlagHaminchaGRAFixedLocalChatzosToSunset', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getPlagHaminchaGRAFixedLocalChatzosToSunset();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T16:28:49.474+02:00[Asia/Jerusalem]');
});

test('getTzais50', () => {
  const zman = makeZmanimCalendar();
  const zdt = zman.getTzais50();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T18:34:36.003+02:00[Asia/Jerusalem]');
});

test('getZmanMolad', () => {
  const zman = makeZmanimCalendar();
  const plainDate = new Temporal.PlainDate(2025, 3, 29); // Saturday March 29 2025
  zman.setDate(plainDate);
  const zdt = zman.getZmanMolad();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-29T03:25:06.837-02:00[Etc/GMT+2]');
});

test('getTchilasZmanKidushLevana7Days-1', () => {
  const zman = makeZmanimCalendar();
  const plainDate = new Temporal.PlainDate(2025, 3, 29); // Saturday March 29 2025
  zman.setDate(plainDate);
  const zdt = zman.getTchilasZmanKidushLevana7Days();
  assert.isNull(zdt);
});

test.skip('getTchilasZmanKidushLevana7Days-2', () => {
  const zman = makeZmanimCalendar();
  const plainDate = new Temporal.PlainDate(2025, 4, 4); // Friday April 4 2025
  zman.setDate(plainDate);

  const jewishCalendar = new JewishCalendar(plainDate);
  assert.equal(jewishCalendar.getJewishDayOfMonth(), 6);

  const zdt = zman.getTchilasZmanKidushLevana7Days();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-03-09T18:09:02.216+02:00[Asia/Jerusalem]');
});

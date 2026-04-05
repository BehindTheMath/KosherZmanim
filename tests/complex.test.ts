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

// =============================================================================
// Kiddush Levana tests for ComplexZmanimCalendar
// Uses Shevat 5786 (starts Jan 19, 2026) and surrounding months in Jerusalem.
//
// Key date mappings (Gregorian → Hebrew):
//   Jan 17  → 28 Teves   Jan 18  → 29 Teves   Jan 19  → 1  Shevat
//   Jan 21  → 3  Shevat   Jan 25  → 7  Shevat   Jan 28  → 10 Shevat
//   Feb  2  → 15 Shevat   Feb 15  → 28 Shevat   Feb 16  → 29 Shevat
//   Feb 17  → 30 Shevat   Dec 19  → 29 Kislev   Dec 20  → 30 Kislev
//
// Shevat 5786 molad: Jan 18, 2026 12:45:40.170 UTC (14:45:40 Jerusalem)
// =============================================================================

// eslint-disable-next-line require-jsdoc
function makeCalendar(year: number, month: number, day: number): ComplexZmanimCalendar {
  const gloc = new GeoLocation(null, 32.08088, 34.78057, 0, 'Asia/Jerusalem');
  const czc = new ComplexZmanimCalendar(gloc);
  czc.setUseElevation(false);
  czc.setDate(new Temporal.PlainDate(year, month, day));
  return czc;
}

// ---------------------------------------------------------------------------
// Day 10 of Hebrew month — all Kiddush Levana methods must return null
// ---------------------------------------------------------------------------
test('KiddushLevana: all methods return null on 10th of Hebrew month', () => {
  // Jan 28, 2026 = 10 Shevat 5786
  const czc = makeCalendar(2026, 1, 28);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 10);

  assert.isNull(czc.getZmanMolad());
  assert.isNull(czc.getTchilasZmanKidushLevana3Days());
  assert.isNull(czc.getTchilasZmanKidushLevana7Days());
  assert.isNull(czc.getSofZmanKidushLevanaBetweenMoldos());
  assert.isNull(czc.getSofZmanKidushLevana15Days());
});

// ---------------------------------------------------------------------------
// getZmanMolad
// ---------------------------------------------------------------------------
test('KiddushLevana: getZmanMolad returns molad on the day it occurs', () => {
  // Jan 18, 2026 = 29 Teves (Shevat molad falls on this Gregorian day)
  const czc = makeCalendar(2026, 1, 18);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 29);

  const zdt = czc.getZmanMolad();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2026-01-18T10:45:40.17-02:00[Etc/GMT+2]');
});

test('KiddushLevana: getZmanMolad returns null on day 28 when molad is next day', () => {
  // Jan 17, 2026 = 28 Teves; molad is Jan 18 so doesn't fall on this day
  const czc = makeCalendar(2026, 1, 17);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 28);

  assert.isNull(czc.getZmanMolad());
});

test('KiddushLevana: getZmanMolad returns null on day 1 when molad was previous day', () => {
  // Jan 19, 2026 = 1 Shevat; molad was Jan 18
  const czc = makeCalendar(2026, 1, 19);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 1);

  assert.isNull(czc.getZmanMolad());
});

test('KiddushLevana: getZmanMolad forwards to next month on day 30', () => {
  // Dec 20, 2025 = 30 Kislev; current month molad is early Nov, but Teves molad falls on this day
  const czc = makeCalendar(2025, 12, 20);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 30);

  const zdt = czc.getZmanMolad();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2025-12-19T22:01:36.837-02:00[Etc/GMT+2]');
});

test('KiddushLevana: getZmanMolad returns null on day 29 when next molad is day after', () => {
  // Dec 19, 2025 = 29 Kislev; Teves molad falls on Dec 20
  const czc = makeCalendar(2025, 12, 19);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 29);

  assert.isNull(czc.getZmanMolad());
});

test('KiddushLevana: getZmanMolad forwards to next month on day 30 of Shevat', () => {
  // Feb 17, 2026 = 30 Shevat; Adar molad falls on this day
  const czc = makeCalendar(2026, 2, 17);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 30);

  const zdt = czc.getZmanMolad();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2026-02-16T23:29:43.504-02:00[Etc/GMT+2]');
});

// ---------------------------------------------------------------------------
// getTchilasZmanKidushLevana3Days
// ---------------------------------------------------------------------------
test('KiddushLevana: 3days returns value on day 3 of month', () => {
  // Jan 21, 2026 = 3 Shevat; 3 days after Shevat molad falls on this day
  const czc = makeCalendar(2026, 1, 21);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 3);

  const zdt = czc.getTchilasZmanKidushLevana3Days();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2026-01-21T10:45:40.17-02:00[Etc/GMT+2]');
});

test('KiddushLevana: 3days returns null for day 6 through 29', () => {
  // Jan 24, 2026 = 6 Shevat (day > 5 && day < 30 → null)
  const czc = makeCalendar(2026, 1, 24);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 6);

  assert.isNull(czc.getTchilasZmanKidushLevana3Days());
});

test('KiddushLevana: 3days returns null on day 1 when zman is on a different day', () => {
  // Jan 19, 2026 = 1 Shevat; 3 days after molad is Jan 21
  const czc = makeCalendar(2026, 1, 19);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 1);

  assert.isNull(czc.getTchilasZmanKidushLevana3Days());
});

test('KiddushLevana: 3days with alos/tzais returns alos when zman is during the day', () => {
  // Jan 21, 2026 = 3 Shevat; 3 days after molad is ~14:45 Jerusalem (daytime)
  const czc = makeCalendar(2026, 1, 21);
  const alos = czc.getAlos72();
  const tzais = czc.getTzais72();

  const zdt = czc.getTchilasZmanKidushLevana3Days(alos, tzais);
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), alos!.toString());
});

test('KiddushLevana: 3days exercises day-30 forward logic', () => {
  // Feb 17, 2026 = 30 Shevat; hits the day === 30 forward path
  // 3 days after Adar molad (Feb 20) is not on Feb 17, so returns null
  const czc = makeCalendar(2026, 2, 17);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 30);

  assert.isNull(czc.getTchilasZmanKidushLevana3Days());
});

// ---------------------------------------------------------------------------
// getTchilasZmanKidushLevana7Days
// ---------------------------------------------------------------------------
test('KiddushLevana: 7days returns value on day 7 of month', () => {
  // Jan 25, 2026 = 7 Shevat; 7 days after Shevat molad falls on this day
  const czc = makeCalendar(2026, 1, 25);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 7);

  const zdt = czc.getTchilasZmanKidushLevana7Days();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2026-01-25T10:45:40.17-02:00[Etc/GMT+2]');
});

test('KiddushLevana: 7days returns null for day < 4', () => {
  // Jan 21, 2026 = 3 Shevat
  const czc = makeCalendar(2026, 1, 21);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 3);

  assert.isNull(czc.getTchilasZmanKidushLevana7Days());
});

test('KiddushLevana: 7days returns null for day > 9', () => {
  // Jan 29, 2026 = 11 Shevat
  const czc = makeCalendar(2026, 1, 29);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 11);

  assert.isNull(czc.getTchilasZmanKidushLevana7Days());
});

test('KiddushLevana: 7days returns null on day 4 when zman is on a different day', () => {
  // Jan 22, 2026 = 4 Shevat; in range but 7 days after molad is Jan 25
  const czc = makeCalendar(2026, 1, 22);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 4);

  assert.isNull(czc.getTchilasZmanKidushLevana7Days());
});

test('KiddushLevana: 7days with alos/tzais returns alos when zman is during the day', () => {
  // Jan 25, 2026 = 7 Shevat; 7 days after molad is ~14:45 Jerusalem (daytime)
  const czc = makeCalendar(2026, 1, 25);
  const alos = czc.getAlos72();
  const tzais = czc.getTzais72();

  const zdt = czc.getTchilasZmanKidushLevana7Days(alos, tzais);
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), alos!.toString());
});

// ---------------------------------------------------------------------------
// getSofZmanKidushLevanaBetweenMoldos
// ---------------------------------------------------------------------------
test('KiddushLevana: betweenMoldos returns value on day 15 of month', () => {
  // Feb 2, 2026 = 15 Shevat; halfway between Shevat and Adar moldos falls on this day
  const czc = makeCalendar(2026, 2, 2);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 15);

  const zdt = czc.getSofZmanKidushLevanaBetweenMoldos();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2026-02-02T05:07:41.836-02:00[Etc/GMT+2]');
});

test('KiddushLevana: betweenMoldos returns null for day < 11', () => {
  // Jan 28, 2026 = 10 Shevat
  const czc = makeCalendar(2026, 1, 28);
  assert.isNull(czc.getSofZmanKidushLevanaBetweenMoldos());
});

test('KiddushLevana: betweenMoldos returns null for day > 16', () => {
  // Feb 4, 2026 = 17 Shevat
  const czc = makeCalendar(2026, 2, 4);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 17);

  assert.isNull(czc.getSofZmanKidushLevanaBetweenMoldos());
});

test('KiddushLevana: betweenMoldos with alos/tzais returns alos when zman is during the day', () => {
  // Feb 2, 2026 = 15 Shevat; between-moldos time is ~09:07 Jerusalem (daytime)
  const czc = makeCalendar(2026, 2, 2);
  const alos = czc.getAlos72();
  const tzais = czc.getTzais72();

  const zdt = czc.getSofZmanKidushLevanaBetweenMoldos(alos, tzais);
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), alos!.toString());
});

// ---------------------------------------------------------------------------
// getSofZmanKidushLevana15Days
// ---------------------------------------------------------------------------
test('KiddushLevana: 15days returns value on day 15 of month', () => {
  // Feb 2, 2026 = 15 Shevat; 15 days after Shevat molad falls on this day
  const czc = makeCalendar(2026, 2, 2);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 15);

  const zdt = czc.getSofZmanKidushLevana15Days();
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), '2026-02-02T10:45:40.17-02:00[Etc/GMT+2]');
});

test('KiddushLevana: 15days returns null for day < 11', () => {
  // Jan 28, 2026 = 10 Shevat
  const czc = makeCalendar(2026, 1, 28);
  assert.isNull(czc.getSofZmanKidushLevana15Days());
});

test('KiddushLevana: 15days returns null for day > 17', () => {
  // Feb 5, 2026 = 18 Shevat
  const czc = makeCalendar(2026, 2, 5);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 18);

  assert.isNull(czc.getSofZmanKidushLevana15Days());
});

test('KiddushLevana: 15days with alos/tzais returns alos when zman is during the day', () => {
  // Feb 2, 2026 = 15 Shevat; 15-day time is ~14:45 Jerusalem (daytime)
  const czc = makeCalendar(2026, 2, 2);
  const alos = czc.getAlos72();
  const tzais = czc.getTzais72();

  const zdt = czc.getSofZmanKidushLevana15Days(alos, tzais);
  assert.isNotNull(zdt);
  assert.strictEqual(zdt!.toString(), alos!.toString());
});

// ---------------------------------------------------------------------------
// Edge cases: days 28, 29, 30, 1 of Hebrew month
// ---------------------------------------------------------------------------
test('KiddushLevana: day 28 returns null for non-molad methods', () => {
  // Feb 15, 2026 = 28 Shevat
  const czc = makeCalendar(2026, 2, 15);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 28);

  // 3days: day 28 > 5 && < 30 → null
  assert.isNull(czc.getTchilasZmanKidushLevana3Days());
  // 7days: day 28 > 9 → null
  assert.isNull(czc.getTchilasZmanKidushLevana7Days());
  // betweenMoldos: day 28 > 16 → null
  assert.isNull(czc.getSofZmanKidushLevanaBetweenMoldos());
  // 15days: day 28 > 17 → null
  assert.isNull(czc.getSofZmanKidushLevana15Days());
  // getZmanMolad: day 28 passes filter, attempts molad lookup, returns null (Adar molad is Feb 17)
  assert.isNull(czc.getZmanMolad());
});

test('KiddushLevana: day 29 returns null for non-molad methods', () => {
  // Feb 16, 2026 = 29 Shevat
  const czc = makeCalendar(2026, 2, 16);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 29);

  assert.isNull(czc.getTchilasZmanKidushLevana3Days());
  assert.isNull(czc.getTchilasZmanKidushLevana7Days());
  assert.isNull(czc.getSofZmanKidushLevanaBetweenMoldos());
  assert.isNull(czc.getSofZmanKidushLevana15Days());
  assert.isNull(czc.getZmanMolad());
});

test('KiddushLevana: day 30 exercises forward logic for molad and 3days', () => {
  // Feb 17, 2026 = 30 Shevat
  const czc = makeCalendar(2026, 2, 17);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 30);

  // getZmanMolad: forwards to Adar molad, which falls on this day
  const molad = czc.getZmanMolad();
  assert.isNotNull(molad);
  assert.strictEqual(molad!.toString(), '2026-02-16T23:29:43.504-02:00[Etc/GMT+2]');

  // 3days: day 30 passes filter, first attempt null, forwards to next month (3 days after Adar molad = Feb 20), not today → null
  assert.isNull(czc.getTchilasZmanKidushLevana3Days());

  // Other methods: day 30 is outside their valid range → null
  assert.isNull(czc.getTchilasZmanKidushLevana7Days());
  assert.isNull(czc.getSofZmanKidushLevanaBetweenMoldos());
  assert.isNull(czc.getSofZmanKidushLevana15Days());
});

test('KiddushLevana: day 1 returns null when zman times fall on other days', () => {
  // Jan 19, 2026 = 1 Shevat
  const czc = makeCalendar(2026, 1, 19);
  const jc = new JewishCalendar(czc.getDate());
  assert.equal(jc.getJewishDayOfMonth(), 1);

  // 3 days after molad is Jan 21, not Jan 19
  assert.isNull(czc.getTchilasZmanKidushLevana3Days());
  // Molad was Jan 18, not Jan 19
  assert.isNull(czc.getZmanMolad());
  // Other methods: day 1 is outside range for 7days (< 4), betweenMoldos (< 11), 15days (< 11)
  assert.isNull(czc.getTchilasZmanKidushLevana7Days());
  assert.isNull(czc.getSofZmanKidushLevanaBetweenMoldos());
  assert.isNull(czc.getSofZmanKidushLevana15Days());
});

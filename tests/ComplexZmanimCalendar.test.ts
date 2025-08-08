/* eslint-disable max-len */
import { Temporal } from 'temporal-polyfill';
import { test } from 'mocha';
import { assert } from 'chai';
import { GeoLocation } from '../src/util/GeoLocation';
import { ComplexZmanimCalendar } from '../src/ComplexZmanimCalendar';

function makeComplexZmanimCalendar(): ComplexZmanimCalendar {
  const latitude = 39.73915;
  const longitude = -104.9847;
  const elevtion = 1636;
  const tzid = 'America/Denver';
  const gloc = new GeoLocation(null, latitude, longitude, elevtion, tzid);
  const zman = new ComplexZmanimCalendar(gloc);
  zman.setUseElevation(true);
  const plainDate = new Temporal.PlainDate(2020, 6, 5); // Friday June 5 2020
  zman.setDate(plainDate);
  return zman;
}

test('getShaahZmanis19Point8Degrees', () => {
  const zman = makeComplexZmanimCalendar();
  const shaahZmanis = zman.getShaahZmanis19Point8Degrees();
  assert.equal(shaahZmanis, 5821509);
});

test('getShaahZmanis18Degrees', () => {
  const zman = makeComplexZmanimCalendar();
  const shaahZmanis = zman.getShaahZmanis18Degrees();
  assert.equal(shaahZmanis, 5660080.666666667);
});

test('getShaahZmanis26Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis26Degrees();
    assert.equal(shaahZmanis, 6590251.25);
});

test('getShaahZmanis16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis16Point1Degrees();
    assert.equal(shaahZmanis, 5502340.5);
});

test('getShaahZmanis60Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis60Minutes();
    assert.equal(shaahZmanis, 5142278.916666667);
});

test('getShaahZmanis72Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis72Minutes();
    assert.equal(shaahZmanis, 5262278.916666667);
});

test('getShaahZmanis72MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis72MinutesZmanis();
    assert.equal(shaahZmanis, 5450734.583333333);
});

test('getShaahZmanis90Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis90Minutes();
    assert.equal(shaahZmanis, 5442278.916666667);
});

test('getShaahZmanis90MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis90MinutesZmanis();
    assert.equal(shaahZmanis, 5677848.583333333);
});

test('getShaahZmanis96MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis96MinutesZmanis();
    assert.equal(shaahZmanis, 5753553.25);
});

test('getShaahZmanisAteretTorah', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanisAteretTorah();
    assert.equal(shaahZmanis, 5196506.75);
});

test('getShaahZmanisAlos16Point1ToTzais3Point8', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanisAlos16Point1ToTzais3Point8();
    assert.equal(shaahZmanis, 5073439.166666667);
});

test('getShaahZmanisAlos16Point1ToTzais3Point7', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanisAlos16Point1ToTzais3Point7();
    assert.equal(shaahZmanis, 5070305.75);
});

test('getShaahZmanis96Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis96Minutes();
    assert.equal(shaahZmanis, 5502278.916666667);
});

test('getShaahZmanis120Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis120Minutes();
    assert.equal(shaahZmanis, 5742278.916666667);
});

test('getShaahZmanis120MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanis120MinutesZmanis();
    assert.equal(shaahZmanis, 6056371.75);
});

test('getAlos60', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos60();
    assert.strictEqual(alos!.toString(), '2020-06-05T04:24:30.501-06:00[America/Denver]');
});

test('getAlos72Zmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos72Zmanis();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:53:39.767-06:00[America/Denver]');
});

test('getAlos96', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos96();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:48:30.501-06:00[America/Denver]');
});

test('getAlos90Zmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos90Zmanis();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:30:57.083-06:00[America/Denver]');
});

test('getAlos96Zmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos96Zmanis();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:23:22.855-06:00[America/Denver]');
});

test('getAlos90', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos90();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:54:30.501-06:00[America/Denver]');
});

test('getAlos120', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos120();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:24:30.501-06:00[America/Denver]');
});

test('getAlos120Zmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos120Zmanis();
    assert.strictEqual(alos!.toString(), '2020-06-05T02:53:05.944-06:00[America/Denver]');
});

test('getAlos26Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos26Degrees();
    assert.strictEqual(alos!.toString(), '2020-06-05T02:00:27.165-06:00[America/Denver]');
});

test('getAlos18Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos18Degrees();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:32:53.265-06:00[America/Denver]');
});

test('getAlos19Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos19Degrees();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:24:06.709-06:00[America/Denver]');
});

test('getAlos19Point8Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos19Point8Degrees();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:16:47.375-06:00[America/Denver]');
});

test('getAlos16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlos16Point1Degrees();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:48:37.581-06:00[America/Denver]');
});

test('getMisheyakir11Point5Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const misheyakir = zman.getMisheyakir11Point5Degrees();
    assert.strictEqual(misheyakir!.toString(), '2020-06-05T04:23:08.923-06:00[America/Denver]');
});

test('getMisheyakir11Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const misheyakir = zman.getMisheyakir11Degrees();
    assert.strictEqual(misheyakir!.toString(), '2020-06-05T04:26:40.45-06:00[America/Denver]');
});

test('getMisheyakir10Point2Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const misheyakir = zman.getMisheyakir10Point2Degrees();
    assert.strictEqual(misheyakir!.toString(), '2020-06-05T04:32:14.456-06:00[America/Denver]');
});

test('getSofZmanShmaMGA19Point8Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA19Point8Degrees();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:07:51.902-06:00[America/Denver]');
});

test('getSofZmanShmaMGA16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA16Point1Degrees();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:23:44.602-06:00[America/Denver]');
});

test('getSofZmanShmaMGA18Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA18Degrees();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:15:53.507-06:00[America/Denver]');
});

test('getSofZmanShmaMGA72Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA72Minutes();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:35:37.337-06:00[America/Denver]');
});

test('getSofZmanShmaMGA72MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA72MinutesZmanis();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:26:11.97-06:00[America/Denver]');
});

test('getSofZmanShmaMGA90Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA90Minutes();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:26:37.337-06:00[America/Denver]');
});

test('getSofZmanShmaMGA90MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA90MinutesZmanis();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:14:50.628-06:00[America/Denver]');
});

test('getSofZmanShmaMGA96Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA96Minutes();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:23:37.337-06:00[America/Denver]');
});

test('getSofZmanShmaMGA96MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA96MinutesZmanis();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:11:03.514-06:00[America/Denver]');
});

test('getSofZmanShma3HoursBeforeChatzos', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShma3HoursBeforeChatzos();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T09:58:30.268-06:00[America/Denver]');
});

test('getSofZmanShmaMGA120Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA120Minutes();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:11:37.337-06:00[America/Denver]');
});

test('getSofZmanShmaAlos16Point1ToSunset', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaAlos16Point1ToSunset();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T07:59:42.647-06:00[America/Denver]');
});

test('getSofZmanShmaAlos16Point1ToTzaisGeonim7Point083Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaAlos16Point1ToTzaisGeonim7Point083Degrees();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:07:33.537-06:00[America/Denver]');
});

test('getSofZmanShmaKolEliyahu', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaKolEliyahu();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T09:12:13.415-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA19Point8Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaMGA19Point8Degrees();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T09:44:53.411-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaMGA16Point1Degrees();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T09:55:26.943-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA18Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaMGA18Degrees();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T09:50:13.587-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA72Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaMGA72Minutes();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T10:03:19.616-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA72MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaMGA72MinutesZmanis();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T09:57:02.705-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA90Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaMGA90Minutes();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T09:57:19.616-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA90MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaMGA90MinutesZmanis();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T09:49:28.477-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA96Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaMGA96Minutes();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T09:55:19.616-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA96MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaMGA96MinutesZmanis();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T09:46:57.068-06:00[America/Denver]');
});

test('getSofZmanTfilaMGA120Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaMGA120Minutes();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T09:47:19.616-06:00[America/Denver]');
});

test('getSofZmanTfila2HoursBeforeChatzos', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfila2HoursBeforeChatzos();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T10:58:30.268-06:00[America/Denver]');
});

test('getMinchaGedola30Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaGedola = zman.getMinchaGedola30Minutes();
    assert.strictEqual(minchaGedola!.toString(), '2020-06-05T13:28:30.268-06:00[America/Denver]');
});

test('getMinchaGedola72Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaGedola = zman.getMinchaGedola72Minutes();
    assert.strictEqual(minchaGedola!.toString(), '2020-06-05T13:42:35.313-06:00[America/Denver]');
});

test('getMinchaGedola16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaGedola = zman.getMinchaGedola16Point1Degrees();
    assert.strictEqual(minchaGedola!.toString(), '2020-06-05T13:44:42.794-06:00[America/Denver]');
});

test('getMinchaGedolaAhavatShalom', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaGedola = zman.getMinchaGedolaAhavatShalom();
    assert.strictEqual(minchaGedola!.toString(), '2020-06-05T13:40:45.42-06:00[America/Denver]');
});

test('getMinchaGedolaGreaterThan30', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaGedola = zman.getMinchaGedolaGreaterThan30();
    assert.strictEqual(minchaGedola!.toString(), '2020-06-05T13:36:35.313-06:00[America/Denver]');
});

test('getMinchaKetana16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaKetana = zman.getMinchaKetana16Point1Degrees();
    assert.strictEqual(minchaKetana!.toString(), '2020-06-05T18:19:49.815-06:00[America/Denver]');
});

test('getMinchaKetanaAhavatShalom', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaKetana = zman.getMinchaKetanaAhavatShalom();
    assert.strictEqual(minchaKetana!.toString(), '2020-06-05T17:11:55.254-06:00[America/Denver]');
});

test('getMinchaKetana72Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaKetana = zman.getMinchaKetana72Minutes();
    assert.strictEqual(minchaKetana!.toString(), '2020-06-05T18:05:42.15-06:00[America/Denver]');
});

test('getPlagHamincha60Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha60Minutes();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T19:45:49.999-06:00[America/Denver]');
});

test('getPlagHamincha72Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha72Minutes();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T19:55:19.999-06:00[America/Denver]');
});

test('getPlagHamincha90Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha90Minutes();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T20:09:34.999-06:00[America/Denver]');
});

test('getPlagHamincha96Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha96Minutes();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T20:14:19.999-06:00[America/Denver]');
});

test('getPlagHamincha96MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha96MinutesZmanis();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T20:34:13.552-06:00[America/Denver]');
});

test('getPlagHamincha90MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha90MinutesZmanis();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T20:28:13.955-06:00[America/Denver]');
});

test('getPlagHamincha72MinutesZmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha72MinutesZmanis();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T20:10:15.163-06:00[America/Denver]');
});

test('getPlagHamincha16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha16Point1Degrees();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T20:14:27.741-06:00[America/Denver]');
});

test('getPlagHamincha19Point8Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha19Point8Degrees();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T20:39:48.596-06:00[America/Denver]');
});

test('getPlagHamincha26Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha26Degrees();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T21:41:12.365-06:00[America/Denver]');
});

test('getPlagHamincha18Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHamincha18Degrees();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T20:26:59.132-06:00[America/Denver]');
});

test('getPlagAlosToSunset', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagAlosToSunset();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T18:48:20.736-06:00[America/Denver]');
});

test('getPlagAlos16Point1ToTzaisGeonim7Point083Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagAlos16Point1ToTzaisGeonim7Point083Degrees();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T19:16:28.091-06:00[America/Denver]');
});

test('getPlagAhavatShalom', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagAhavatShalom();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T18:57:37.053-06:00[America/Denver]');
});

test('getBainHashmashosRT13Point24Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const bainHashmashos = zman.getBainHashmashosRT13Point24Degrees();
    assert.strictEqual(bainHashmashos!.toString(), '2020-06-05T21:47:04.203-06:00[America/Denver]');
});

test('getBainHashmashosRT58Point5Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const bainHashmashos = zman.getBainHashmashosRT58Point5Minutes();
    assert.strictEqual(bainHashmashos!.toString(), '2020-06-05T21:31:27.848-06:00[America/Denver]');
});

test('getBainHashmashosRT13Point5MinutesBefore7Point083Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const bainHashmashos = zman.getBainHashmashosRT13Point5MinutesBefore7Point083Degrees();
    assert.strictEqual(bainHashmashos!.toString(), '2020-06-05T20:50:51.407-06:00[America/Denver]');
});

test('getBainHashmashosRT2Stars', () => {
    const zman = makeComplexZmanimCalendar();
    const bainHashmashos = zman.getBainHashmashosRT2Stars();
    assert.strictEqual(bainHashmashos!.toString(), '2020-06-05T21:08:26.494-06:00[America/Denver]');
});

test('getBainHashmashosYereim18Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const bainHashmashos = zman.getBainHashmashosYereim18Minutes();
    assert.strictEqual(bainHashmashos!.toString(), '2020-06-05T20:14:57.848-06:00[America/Denver]');
});

test('getBainHashmashosYereim3Point05Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const bainHashmashos = zman.getBainHashmashosYereim3Point05Degrees();
    assert.strictEqual(bainHashmashos!.toString(), '2020-06-05T20:01:54.067-06:00[America/Denver]');
});

test('getBainHashmashosYereim16Point875Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const bainHashmashos = zman.getBainHashmashosYereim16Point875Minutes();
    assert.strictEqual(bainHashmashos!.toString(), '2020-06-05T20:16:05.348-06:00[America/Denver]');
});

test('getBainHashmashosYereim2Point8Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const bainHashmashos = zman.getBainHashmashosYereim2Point8Degrees();
    assert.strictEqual(bainHashmashos!.toString(), '2020-06-05T20:03:21.963-06:00[America/Denver]');
});

test('getBainHashmashosYereim13Point5Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const bainHashmashos = zman.getBainHashmashosYereim13Point5Minutes();
    assert.strictEqual(bainHashmashos!.toString(), '2020-06-05T20:19:27.848-06:00[America/Denver]');
});

test('getBainHashmashosYereim2Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const bainHashmashos = zman.getBainHashmashosYereim2Point1Degrees();
    assert.strictEqual(bainHashmashos!.toString(), '2020-06-05T20:07:29.052-06:00[America/Denver]');
});

test('getTzaisGeonim3Point7Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim3Point7Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T20:42:41.25-06:00[America/Denver]');
});

test('getTzaisGeonim3Point8Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim3Point8Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T20:43:18.851-06:00[America/Denver]');
});

test('getTzaisGeonim5Point95Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim5Point95Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T20:56:59.087-06:00[America/Denver]');
});

test('getTzaisGeonim4Point61Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim4Point61Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T20:48:25.158-06:00[America/Denver]');
});

test('getTzaisGeonim4Point37Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim4Point37Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T20:46:54.072-06:00[America/Denver]');
});

test('getTzaisGeonim5Point88Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim5Point88Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T20:56:32.005-06:00[America/Denver]');
});

test('getTzaisGeonim4Point8Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim4Point8Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T20:49:37.468-06:00[America/Denver]');
});

test('getTzaisGeonim6Point45Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim6Point45Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T21:00:13.319-06:00[America/Denver]');
});

test('getTzaisGeonim7Point083Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim7Point083Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T21:04:21.407-06:00[America/Denver]');
});

test('getTzaisGeonim8Point5Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim8Point5Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T21:13:45.311-06:00[America/Denver]');
});

test('getTzaisGeonim9Point3Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim9Point3Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T21:19:09.713-06:00[America/Denver]');
});

test('getTzaisGeonim9Point75Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisGeonim9Point75Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T21:22:14.239-06:00[America/Denver]');
});

test('getTzais60', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais60();
    assert.strictEqual(tzais!.toString(), '2020-06-05T21:32:57.848-06:00[America/Denver]');
});

test('getTzaisAteretTorah', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisAteretTorah();
    assert.strictEqual(tzais!.toString(), '2020-06-05T21:12:57.848-06:00[America/Denver]');
});

test('getAteretTorahSunsetOffset', () => {
    const zman = makeComplexZmanimCalendar();
    const offset = zman.getAteretTorahSunsetOffset();
    assert.equal(offset, 40);
});

test('setAteretTorahSunsetOffset', () => {
    const zman = makeComplexZmanimCalendar();
    zman.setAteretTorahSunsetOffset(50);
    const offset = zman.getAteretTorahSunsetOffset();
    assert.equal(offset, 50);
});

test('getSofZmanShmaAteretTorah', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaAteretTorah();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:13:29.287-06:00[America/Denver]');
});

test('getSofZmanTfilaAteretTorah', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaAteretTorah();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T09:40:05.794-06:00[America/Denver]');
});

test('getMinchaGedolaAteretTorah', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaGedola = zman.getMinchaGedolaAteretTorah();
    assert.strictEqual(minchaGedola!.toString(), '2020-06-05T13:16:37.06-06:00[America/Denver]');
});

test('getMinchaKetanaAteretTorah', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaKetana = zman.getMinchaKetanaAteretTorah();
    assert.strictEqual(minchaKetana!.toString(), '2020-06-05T17:36:26.581-06:00[America/Denver]');
});

test('getPlagHaminchaAteretTorah', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHaminchaAteretTorah();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T19:24:42.214-06:00[America/Denver]');
});

test('getTzais72Zmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais72Zmanis();
    assert.strictEqual(tzais!.toString(), '2020-06-05T22:03:48.582-06:00[America/Denver]');
});

test('getTzais90Zmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais90Zmanis();
    assert.strictEqual(tzais!.toString(), '2020-06-05T22:26:31.266-06:00[America/Denver]');
});

test('getTzais96Zmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais96Zmanis();
    assert.strictEqual(tzais!.toString(), '2020-06-05T22:34:05.494-06:00[America/Denver]');
});

test('getTzais90', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais90();
    assert.strictEqual(tzais!.toString(), '2020-06-05T22:02:57.848-06:00[America/Denver]');
});

test('getTzais120', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais120();
    assert.strictEqual(tzais!.toString(), '2020-06-05T22:32:57.848-06:00[America/Denver]');
});

test('getTzais120Zmanis', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais120Zmanis();
    assert.strictEqual(tzais!.toString(), '2020-06-05T23:04:22.405-06:00[America/Denver]');
});

test('getTzais16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais16Point1Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T22:09:05.667-06:00[America/Denver]');
});

test('getTzais26Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais26Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T23:58:30.18-06:00[America/Denver]');
});

test('getTzais18Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais18Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T22:24:54.233-06:00[America/Denver]');
});

test('getTzais19Point8Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais19Point8Degrees();
    assert.strictEqual(tzais!.toString(), '2020-06-05T22:41:05.483-06:00[America/Denver]');
});

test('getTzais96', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais96();
    assert.strictEqual(tzais!.toString(), '2020-06-05T22:08:57.848-06:00[America/Denver]');
});

test('getFixedLocalChatzos', () => {
    const zman = makeComplexZmanimCalendar();
    const chatzos = zman.getFixedLocalChatzos();
    assert.strictEqual(chatzos!.toString(), '2020-06-05T12:59:56.328-06:00[America/Denver]');
});

test('getSofZmanShmaFixedLocal', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaFixedLocal();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T09:59:56.328-06:00[America/Denver]');
});

test('getSofZmanTfilaFixedLocal', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaFixedLocal();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T10:59:56.328-06:00[America/Denver]');
});

test('getSofZmanAchilasChametzGRA', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanAchilasChametz = zman.getSofZmanAchilasChametzGRA();
    assert.strictEqual(sofZmanAchilasChametz!.toString(), '2020-06-05T10:27:19.616-06:00[America/Denver]');
});

test('getSofZmanAchilasChametzMGA72Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanAchilasChametz = zman.getSofZmanAchilasChametzMGA72Minutes();
    assert.strictEqual(sofZmanAchilasChametz!.toString(), '2020-06-05T10:03:19.616-06:00[America/Denver]');
});

test('getSofZmanAchilasChametzMGA16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanAchilasChametz = zman.getSofZmanAchilasChametzMGA16Point1Degrees();
    assert.strictEqual(sofZmanAchilasChametz!.toString(), '2020-06-05T09:55:26.943-06:00[America/Denver]');
});

test('getSofZmanBiurChametzGRA', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanBiurChametz = zman.getSofZmanBiurChametzGRA();
    assert.strictEqual(sofZmanBiurChametz!.toString(), '2020-06-05T11:43:01.895-06:00[America/Denver]');
});

test('getSofZmanBiurChametzMGA72Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanBiurChametz = zman.getSofZmanBiurChametzMGA72Minutes();
    assert.strictEqual(sofZmanBiurChametz!.toString(), '2020-06-05T11:31:01.895-06:00[America/Denver]');
});

test('getSofZmanBiurChametzMGA16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanBiurChametz = zman.getSofZmanBiurChametzMGA16Point1Degrees();
    assert.strictEqual(sofZmanBiurChametz!.toString(), '2020-06-05T11:27:09.283-06:00[America/Denver]');
});

test('getShaahZmanisBaalHatanya', () => {
    const zman = makeComplexZmanimCalendar();
    const shaahZmanis = zman.getShaahZmanisBaalHatanya();
    assert.equal(shaahZmanis, 4508577.75);
});

test('getAlosBaalHatanya', () => {
    const zman = makeComplexZmanimCalendar();
    const alos = zman.getAlosBaalHatanya();
    assert.strictEqual(alos!.toString(), '2020-06-05T03:42:07.966-06:00[America/Denver]');
});

test('getSofZmanShmaBaalHatanya', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaBaalHatanya();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T09:13:18.278-06:00[America/Denver]');
});

test('getSofZmanTfilaBaalHatanya', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaBaalHatanya();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T10:28:26.856-06:00[America/Denver]');
});

test('getSofZmanAchilasChametzBaalHatanya', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanAchilasChametz = zman.getSofZmanAchilasChametzBaalHatanya();
    assert.strictEqual(sofZmanAchilasChametz!.toString(), '2020-06-05T10:28:26.856-06:00[America/Denver]');
});

test('getSofZmanBiurChametzBaalHatanya', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanBiurChametz = zman.getSofZmanBiurChametzBaalHatanya();
    assert.strictEqual(sofZmanBiurChametz!.toString(), '2020-06-05T11:43:35.433-06:00[America/Denver]');
});

test('getMinchaGedolaBaalHatanya', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaGedola = zman.getMinchaGedolaBaalHatanya();
    assert.strictEqual(minchaGedola!.toString(), '2020-06-05T13:36:18.3-06:00[America/Denver]');
});

test('getMinchaGedolaBaalHatanyaGreaterThan30', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaGedola = zman.getMinchaGedolaBaalHatanyaGreaterThan30();
    assert.strictEqual(minchaGedola!.toString(), '2020-06-05T13:36:18.3-06:00[America/Denver]');
});

test('getMinchaKetanaBaalHatanya', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaKetana = zman.getMinchaKetanaBaalHatanya();
    assert.strictEqual(minchaKetana!.toString(), '2020-06-05T17:21:44.033-06:00[America/Denver]');
});

test('getPlagHaminchaBaalHatanya', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHaminchaBaalHatanya();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T18:55:39.755-06:00[America/Denver]');
});

test('getTzaisBaalHatanya', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzaisBaalHatanya();
    assert.strictEqual(tzais!.toString(), '2020-06-05T20:57:18.448-06:00[America/Denver]');
});

test('getSofZmanShmaMGA18DegreesToFixedLocalChatzos', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA18DegreesToFixedLocalChatzos();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:16:24.796-06:00[America/Denver]');
});

test('getSofZmanShmaMGA16Point1DegreesToFixedLocalChatzos', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA16Point1DegreesToFixedLocalChatzos();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:24:16.954-06:00[America/Denver]');
});

test('getSofZmanShmaMGA90MinutesToFixedLocalChatzos', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA90MinutesToFixedLocalChatzos();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:27:13.414-06:00[America/Denver]');
});

test('getSofZmanShmaMGA72MinutesToFixedLocalChatzos', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaMGA72MinutesToFixedLocalChatzos();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T08:36:13.414-06:00[America/Denver]');
});

test('getSofZmanShmaGRASunriseToFixedLocalChatzos', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanShma = zman.getSofZmanShmaGRASunriseToFixedLocalChatzos();
    assert.strictEqual(sofZmanShma!.toString(), '2020-06-05T09:12:13.414-06:00[America/Denver]');
});

test('getSofZmanTfilaGRASunriseToFixedLocalChatzos', () => {
    const zman = makeComplexZmanimCalendar();
    const sofZmanTfila = zman.getSofZmanTfilaGRASunriseToFixedLocalChatzos();
    assert.strictEqual(sofZmanTfila!.toString(), '2020-06-05T10:28:07.719-06:00[America/Denver]');
});

test('getMinchaGedolaGRAFixedLocalChatzos30Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaGedola = zman.getMinchaGedolaGRAFixedLocalChatzos30Minutes();
    assert.strictEqual(minchaGedola!.toString(), '2020-06-05T13:29:56.328-06:00[America/Denver]');
});

test('getMinchaKetanaGRAFixedLocalChatzosToSunset', () => {
    const zman = makeComplexZmanimCalendar();
    const minchaKetana = zman.getMinchaKetanaGRAFixedLocalChatzosToSunset();
    assert.strictEqual(minchaKetana!.toString(), '2020-06-05T17:24:12.214-06:00[America/Denver]');
});

test('getPlagHaminchaGRAFixedLocalChatzosToSunset', () => {
    const zman = makeComplexZmanimCalendar();
    const plagHamincha = zman.getPlagHaminchaGRAFixedLocalChatzosToSunset();
    assert.strictEqual(plagHamincha!.toString(), '2020-06-05T18:58:35.031-06:00[America/Denver]');
});

test('getTzais50', () => {
    const zman = makeComplexZmanimCalendar();
    const tzais = zman.getTzais50();
    assert.strictEqual(tzais!.toString(), '2020-06-05T21:22:57.848-06:00[America/Denver]');
});

test('getSamuchLeMinchaKetanaGRA', () => {
    const zman = makeComplexZmanimCalendar();
    const samuchLeMinchaKetana = zman.getSamuchLeMinchaKetanaGRA();
    assert.strictEqual(samuchLeMinchaKetana!.toString(), '2020-06-05T16:45:51.011-06:00[America/Denver]');
});

test('getSamuchLeMinchaKetana16Point1Degrees', () => {
    const zman = makeComplexZmanimCalendar();
    const samuchLeMinchaKetana = zman.getSamuchLeMinchaKetana16Point1Degrees();
    assert.strictEqual(samuchLeMinchaKetana!.toString(), '2020-06-05T17:33:58.645-06:00[America/Denver]');
});

test('getSamuchLeMinchaKetana72Minutes', () => {
    const zman = makeComplexZmanimCalendar();
    const samuchLeMinchaKetana = zman.getSamuchLeMinchaKetana72Minutes();
    assert.strictEqual(samuchLeMinchaKetana!.toString(), '2020-06-05T17:21:51.011-06:00[America/Denver]');
});

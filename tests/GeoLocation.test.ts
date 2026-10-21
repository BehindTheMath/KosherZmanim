import { describe, it } from 'mocha';
import { assert } from 'chai';

import { DateTime } from 'luxon';

import { ComplexZmanimCalendar } from '../src/ComplexZmanimCalendar';
import { GeoLocation } from '../src/util/GeoLocation';

// Zones with DST. A wrong raw offset made getAntimeridianAdjustment() shift Sydney, Auckland and
// Chatham by a day.
const places: [string, number, number, string][] = [
  ['Sydney', -33.8688, 151.2093, 'Australia/Sydney'],
  ['Auckland', -36.8485, 174.7633, 'Pacific/Auckland'],
  ['Chatham', -43.9535, -176.5597, 'Pacific/Chatham'],
  ['Lakewood', 40.0821, -74.2097, 'America/New_York'],
];

describe('Test GeoLocation antimeridian adjustment in zones with DST', function () {
  places.forEach(([name, latitude, longitude, timeZoneId]) => {
    const geoLocation = new GeoLocation(name, latitude, longitude, 0, timeZoneId);

    [1, 4, 7, 10].forEach(month => {
      it(`returns ${name} sunrise on the requested date (month ${month})`, function () {
        const date = DateTime.fromObject({ year: 2026, month, day: 15, zone: timeZoneId });
        const calendar = new ComplexZmanimCalendar(geoLocation);
        calendar.setDate(date);

        const sunrise = calendar.getSeaLevelSunrise()!.setZone(timeZoneId);
        assert.strictEqual(sunrise.toISODate(), date.toISODate());
        assert.isBelow(sunrise.hour, 9);
      });
    });
  });
});

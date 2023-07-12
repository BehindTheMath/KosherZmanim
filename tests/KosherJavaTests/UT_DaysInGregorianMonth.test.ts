import { describe, it } from 'mocha';
import { assert } from 'chai';

import * as KosherZmanim from '../../src/kosher-zmanim';

function assertDaysInMonth(febIsLeap: boolean, hebrewDate: KosherZmanim.JewishCalendar) {
  assert.strictEqual(31, hebrewDate.getLastDayOfGregorianMonth(1));
  assert.strictEqual(febIsLeap ? 29 : 28, hebrewDate.getLastDayOfGregorianMonth(2));
  assert.strictEqual(31, hebrewDate.getLastDayOfGregorianMonth(3));
  assert.strictEqual(30, hebrewDate.getLastDayOfGregorianMonth(4));
  assert.strictEqual(31, hebrewDate.getLastDayOfGregorianMonth(5));
  assert.strictEqual(30, hebrewDate.getLastDayOfGregorianMonth(6));
  assert.strictEqual(31, hebrewDate.getLastDayOfGregorianMonth(7));
  assert.strictEqual(31, hebrewDate.getLastDayOfGregorianMonth(8));
  assert.strictEqual(30, hebrewDate.getLastDayOfGregorianMonth(9));
  assert.strictEqual(31, hebrewDate.getLastDayOfGregorianMonth(10));
  assert.strictEqual(30, hebrewDate.getLastDayOfGregorianMonth(11));
  assert.strictEqual(31, hebrewDate.getLastDayOfGregorianMonth(12));
}

describe('Test Days in Month', function () {
  it('Test Regular Year months', () => {
    const jewishCalendar: KosherZmanim.JewishCalendar = new KosherZmanim.JewishCalendar(new Date('01/01/2011'));
    assertDaysInMonth(false, jewishCalendar);
  });

  it('Test Leap Year months', () => {
    const jewishCalendar: KosherZmanim.JewishCalendar = new KosherZmanim.JewishCalendar(new Date('01/01/2012'));
    assertDaysInMonth(true, jewishCalendar);
  });

  it('Test 100-Year exception months', () => {
    const jewishCalendar: KosherZmanim.JewishCalendar = new KosherZmanim.JewishCalendar(new Date('01/01/2100'));
    assertDaysInMonth(false, jewishCalendar);
  });

  it('Test 400-Year exception months', () => {
    const jewishCalendar: KosherZmanim.JewishCalendar = new KosherZmanim.JewishCalendar(new Date('01/01/2000'));
    assertDaysInMonth(true, jewishCalendar);
  });
});  
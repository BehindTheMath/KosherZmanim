import { describe, it } from 'mocha';
import { assert } from 'chai';

import { Daf } from '../src/hebrewcalendar/Daf';
import { YomiCalculator } from '../src/hebrewcalendar/YomiCalculator';
import { JewishDate } from '../src/hebrewcalendar/JewishDate';
import { JewishCalendar } from '../src/hebrewcalendar/JewishCalendar';

describe('Test YomiCalculator', function () {
  it('Gets Bavli daf for 12 Kislev 5685 (Yoma 2)', () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5685, JewishDate.KISLEV, 12);
    const daf: Daf = YomiCalculator.getDafYomiBavli(jewishCalendar);

    assert.strictEqual(daf.getMasechtaNumber(), 5);
    assert.strictEqual(daf.getDaf(), 2);
  });

  it('Gets Bavli daf for 26 Elul 5736 (Shekalim 14)', () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5736, JewishDate.ELUL, 26);
    const daf: Daf = YomiCalculator.getDafYomiBavli(jewishCalendar);

    assert.strictEqual(daf.getMasechtaNumber(), 4);
    assert.strictEqual(daf.getDaf(), 14);
  });

  it('Gets Bavli daf for 10 Elul 5777 (Sanhedrin 47)', () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5777, JewishDate.ELUL, 10);
    const daf: Daf = YomiCalculator.getDafYomiBavli(jewishCalendar);

    assert.strictEqual(daf.getMasechtaNumber(), 23);
    assert.strictEqual(daf.getDaf(), 47);
  });

  it('Gets Bavli daf for 29 Elul 5683 (Error)', () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5683, JewishDate.ELUL, 29);

    assert.throws(() => YomiCalculator.getDafYomiBavli(jewishCalendar), Error);
  });
});

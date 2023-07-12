import { describe, it } from 'mocha';
import { assert } from 'chai';

import { Daf } from '../src/hebrewcalendar/Daf';
import { YerushalmiYomiCalculator } from '../src/hebrewcalendar/YerushalmiYomiCalculator';
import { JewishDate } from '../src/hebrewcalendar/JewishDate';
import { JewishCalendar } from '../src/hebrewcalendar/JewishCalendar';

describe('Test YerushalmiYomiCalculator', function () {
  it('Gets Yerushalmi daf for 10 Elul 5777 (Kiddushin 8)', () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5777, JewishDate.ELUL, 10);
    const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar)!;

    assert.strictEqual(daf.getMasechtaNumber(), 29);
    assert.strictEqual(daf.getDaf(), 8);
  });

  it('Gets Yerushalmi daf for 1 Kislev 5744 (Pesachim 26)', () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5744, JewishDate.KISLEV, 1);
    const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar)!;

    assert.strictEqual(daf.getMasechtaNumber(), 32);
    assert.strictEqual(daf.getDaf(), 26);
  });

  it('Gets Yerushalmi daf for 1 Sivan 5782 (Shevuos 15)', () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5782, JewishDate.SIVAN, 1);
    const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar)!;

    assert.strictEqual(daf.getMasechtaNumber(), 33);
    assert.strictEqual(daf.getDaf(), 15);
  });

  it('Gets Yerushalmi daf for days where there are no Daf', () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5775, JewishDate.TISHREI, 10);
    assert.isNull(YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar));

    jewishCalendar.setJewishDate(5783, JewishCalendar.AV, 9);
    assert.isNull(YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar));

    jewishCalendar.setJewishDate(5775, JewishCalendar.AV, 10); // 9 Av delayed to Sunday 10 Av
    assert.isNull(YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar));
  });

  it('Gets Yerushalmi daf for 14 Shevat 5740 (Error)', () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5740, JewishDate.SHEVAT, 14);

    assert.throws(() => YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar), Error);
  });
});

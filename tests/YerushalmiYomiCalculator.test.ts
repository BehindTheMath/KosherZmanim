import { Daf } from '../src/hebrewcalendar/Daf';
import { YerushalmiYomiCalculator } from '../src/hebrewcalendar/YerushalmiYomiCalculator';
import { JewishDate } from '../src/hebrewcalendar/JewishDate';
import { JewishCalendar } from '../src/hebrewcalendar/JewishCalendar';
import { IllegalArgumentException } from '../src/polyfills/errors';

test('Gets Yerushalmi daf for 10 Elul 5777 (Kiddushin 8)', () => {
  const jewishCalendar: JewishCalendar = new JewishCalendar(5777, JewishDate.ELUL, 10);
  const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar);

  expect(daf.getMasechtaNumber()).toEqual(29);
  expect(daf.getDaf()).toEqual(8);
});

test('Gets Yerushalmi daf for 1 Kislev 5744 (Pesachim 26)', () => {
  const jewishCalendar: JewishCalendar = new JewishCalendar(5744, JewishDate.KISLEV, 1);
  const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar);

  expect(daf.getMasechtaNumber()).toEqual(32);
  expect(daf.getDaf()).toEqual(26);
});

test('Gets Yerushalmi daf for 1 Sivan 5782 (Shevuos 15)', () => {
  const jewishCalendar: JewishCalendar = new JewishCalendar(5782, JewishDate.SIVAN, 1);
  const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar);

  expect(daf.getMasechtaNumber()).toEqual(33);
  expect(daf.getDaf()).toEqual(15);
});

test('Gets Yerushalmi daf for 10 Tishrei 5775 (No daf)', () => {
  const jewishCalendar: JewishCalendar = new JewishCalendar(5775, JewishDate.TISHREI, 10);
  const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar);

  expect(daf.getMasechtaNumber()).toEqual(39);
  expect(daf.getDaf()).toEqual(0);
});

test('Gets Yerushalmi daf for 14 Shevat 5740 (Error)', () => {
  const jewishCalendar: JewishCalendar = new JewishCalendar(5740, JewishDate.SHEVAT, 14);

  expect(() => YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar))
    .toThrowError(IllegalArgumentException);
});

import JewishDate from "../hebrewcalendar/JewishDate";
import JewishCalendar from "../hebrewcalendar/JewishCalendar";
import YerushalmiYomiCalculator from "../hebrewcalendar/YerushalmiYomiCalculator";
import Daf from "../hebrewcalendar/Daf";

test("Gets Yerushalmi daf for 10 Elul 5777 (Kiddushin 8)", () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5777, JewishDate.ELUL, 10);
    const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar);
    expect(daf).toEqual(new Daf(29, 8));
    expect(daf.getMasechtaNumber()).toEqual(29);
    expect(daf.getDaf()).toEqual(8);
});

test("Gets Yerushalmi daf for 1 Kislev 5744 (Pesachim 26)", () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5744, JewishDate.KISLEV, 1);
    const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar);
    expect(daf).toEqual(new Daf(32, 26));
    expect(daf.getMasechtaNumber()).toEqual(32);
    expect(daf.getDaf()).toEqual(26);
});

test("Gets Yerushalmi daf for 1 Sivan 5782 (Shevuos 15)", () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5782, JewishDate.SIVAN, 1);
    const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar);
    expect(daf).toEqual(new Daf(33, 15));
    expect(daf.getMasechtaNumber()).toEqual(33);
    expect(daf.getDaf()).toEqual(15);
});

test("Gets Yerushalmi daf for 10 Tishrei 5775 (No daf)", () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5775, JewishDate.TISHREI, 10);
    const daf: Daf = YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar);
    expect(daf).toEqual(new Daf(39, 0));
    expect(daf.getMasechtaNumber()).toEqual(39);
    expect(daf.getDaf()).toEqual(0);
});

test("Gets Yerushalmi daf for 14 Shevat 5740 (Error)", () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5740, JewishDate.SHEVAT, 14);
    expect(() => { YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar); }).toThrowError(/^IllegalArgumentException/);
});

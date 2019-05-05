import {Daf} from "../hebrewcalendar/Daf";
import {YomiCalculator} from "../hebrewcalendar/YomiCalculator";
import {JewishDate} from "../hebrewcalendar/JewishDate";
import {JewishCalendar} from "../hebrewcalendar/JewishCalendar";

test("Gets Bavli daf for 12 Kislev 5685 (Yoma 2)", () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5685, JewishDate.KISLEV, 12);
    const daf: Daf = YomiCalculator.getDafYomiBavli(jewishCalendar);
    expect(daf).toEqual(new Daf(5, 2));
    expect(daf.getMasechtaNumber()).toEqual(5);
    expect(daf.getDaf()).toEqual(2);
});

test("Gets Bavli daf for 26 Elul 5736 (Shekalim 14)", () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5736, JewishDate.ELUL, 26);
    const daf: Daf = YomiCalculator.getDafYomiBavli(jewishCalendar);
    expect(daf).toEqual(new Daf(4, 14));
    expect(daf.getMasechtaNumber()).toEqual(4);
    expect(daf.getDaf()).toEqual(14);
});

test("Gets Bavli daf for 10 Elul 5777 (Sanhedrin 47)", () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5777, JewishDate.ELUL, 10);
    const daf: Daf = YomiCalculator.getDafYomiBavli(jewishCalendar);
    expect(daf).toEqual(new Daf(23, 47));
    expect(daf.getMasechtaNumber()).toEqual(23);
    expect(daf.getDaf()).toEqual(47);
});

test("Gets Bavli daf for 29 Elul 5683 (Error)", () => {
    const jewishCalendar: JewishCalendar = new JewishCalendar(5683, JewishDate.ELUL, 29);
    expect(() => { YomiCalculator.getDafYomiBavli(jewishCalendar); }).toThrowError(/^IllegalArgumentException/);
});

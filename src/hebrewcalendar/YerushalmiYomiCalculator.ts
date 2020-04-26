import { DateTime, Interval } from 'luxon';

import { Calendar } from '../polyfills/Utils';
import { Daf } from './Daf';
import { JewishCalendar } from './JewishCalendar';
import { IllegalArgumentException } from '../polyfills/errors';

/**
 * This class calculates the <a href="https://en.wikipedia.org/wiki/Jerusalem_Talmud">Yerusalmi</a> <a href=
 * "https://en.wikipedia.org/wiki/Daf_Yomi">Daf Yomi</a> page ({@link Daf}) for the a given date.
 *
 * @author &copy; elihaidv
 * @author &copy; Eliyahu Hershfeld 2017 - 2019
 */
export class YerushalmiYomiCalculator {
  private static readonly DAF_YOMI_START_DAY: DateTime = DateTime.fromObject({
    year: 1980,
    month: Calendar.FEBRUARY + 1,
    day: 2,
  });

  private static readonly WHOLE_SHAS_DAFS: number = 1554;
  private static readonly BLATT_PER_MASECHTA: number[] = [68, 37, 34, 44, 31, 59, 26, 33, 28, 20, 13, 92, 65, 71, 22,
    22, 42, 26, 26, 33, 34, 22, 19, 85, 72, 47, 40, 47, 54, 48, 44, 37, 34, 44, 9, 57, 37, 19, 13];

  /**
   * Returns the <a href="https://en.wikipedia.org/wiki/Daf_Yomi">Daf Yomi</a>
   * <a href="https://en.wikipedia.org/wiki/Jerusalem_Talmud">Yerusalmi</a> page ({@link Daf}) for a given date.
   * The first Daf Yomi cycle started on To Bishvat 5740 (February, 2, 1980) and calculations prior to this
   * date will result in an IllegalArgumentException thrown.
   *
   * @param jewishCalendar
   *            the calendar date for calculation
   * @return the {@link Daf}.
   *
   * @throws IllegalArgumentException
   *             if the date is prior to the September 11, 1923 start date of the first Daf Yomi cycle
   */
  public static getDafYomiYerushalmi(jewishCalendar: JewishCalendar): Daf {
    let nextCycle: DateTime = DateTime.local();
    let prevCycle: DateTime = DateTime.local();
    const requested: DateTime = jewishCalendar.getDate();
    let masechta: number = 0;
    let dafYomi: Daf;

    // There is no Daf Yomi on Yom Kippur and Tisha B'Av.
    if (jewishCalendar.getYomTovIndex() === JewishCalendar.YOM_KIPPUR || jewishCalendar.getYomTovIndex() === JewishCalendar.TISHA_BEAV) {
      return new Daf(39, 0);
    }

    if (requested < YerushalmiYomiCalculator.DAF_YOMI_START_DAY) {
      // TODO: should we return a null or throw an ?
      throw new IllegalArgumentException(`${requested} is prior to organized Daf Yomi Yerushlmi cycles that started on ${YerushalmiYomiCalculator.DAF_YOMI_START_DAY}`);
    }

    // Start to calculate current cycle. Initialize the start day
    nextCycle = YerushalmiYomiCalculator.DAF_YOMI_START_DAY;

    // Go cycle by cycle, until we get the next cycle
    while (requested > nextCycle) {
      prevCycle = nextCycle;

      // Adds the number of whole shas dafs. and the number of days that not have daf.
      nextCycle = nextCycle.plus({ days: YerushalmiYomiCalculator.WHOLE_SHAS_DAFS })
        .plus({ days: YerushalmiYomiCalculator.getNumOfSpecialDays(prevCycle, nextCycle) });
    }

    // Get the number of days from cycle start until request.
    const dafNo: number = 0 - (prevCycle.diff(requested).days);

    // Get the number of special days to subtract
    const specialDays: number = YerushalmiYomiCalculator.getNumOfSpecialDays(prevCycle, requested);
    let total: number = dafNo - specialDays;

    // Finally find the daf.
    for (let i: number = 0; i < YerushalmiYomiCalculator.BLATT_PER_MASECHTA.length; i++) {
      if (total <= YerushalmiYomiCalculator.BLATT_PER_MASECHTA[i]) {
        dafYomi = new Daf(masechta, total + 1);
        break;
      }
      total -= YerushalmiYomiCalculator.BLATT_PER_MASECHTA[i];
      masechta++;
    }

    return dafYomi!;
  }

  /**
   * Return the number of special days (Yom Kippur and Tisha B'Av) on which there is no daf, between the two given dates
   *
   * @param start - start date to calculate
   * @param end - end date to calculate
   * @return the number of special days
   */
  private static getNumOfSpecialDays(start: DateTime, end: DateTime): number {
    // Find the start and end Jewish years
    const jewishStartYear: number = new JewishCalendar(start).getJewishYear();
    const jewishEndYear: number = new JewishCalendar(end).getJewishYear();

    // Value to return
    let specialDays: number = 0;

    // Instant of special dates
    const yomKippur: JewishCalendar = new JewishCalendar(jewishStartYear, 7, 10);
    const tishaBeav: JewishCalendar = new JewishCalendar(jewishStartYear, 5, 9);

    // Go over the years and find special dates
    for (let i: number = jewishStartYear; i <= jewishEndYear; i++) {
      yomKippur.setJewishYear(i);
      tishaBeav.setJewishYear(i);

      const interval = Interval.fromDateTimes(start, end);
      if (interval.contains(yomKippur.getDate())) specialDays++;
      if (interval.contains(tishaBeav.getDate())) specialDays++;
    }

    return specialDays;
  }
}

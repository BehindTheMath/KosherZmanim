import { DateTime } from 'luxon';

import { Calendar, IntegerUtils } from '../polyfills/Utils';
import { IllegalArgumentException } from '../polyfills/errors';

/**
 * The JewishDate is the base calendar class, that supports maintenance of a {@link java.util.GregorianCalendar}
 * instance along with the corresponding Jewish date. This class can use the standard Java Date and Calendar
 * classes for setting and maintaining the dates, but it does not subclass these classes or use them internally
 * in any calculations. This class also does not have a concept of a time (which the Date class does). Please
 * note that the calendar does not currently support dates prior to 1/1/1 Gregorian. Also keep in mind that the
 * Gregorian calendar started on October 15, 1582, so any calculations prior to that are suspect (at least from
 * a Gregorian perspective). While 1/1/1 Gregorian and forward are technically supported, any calculations prior to <a
 * href="http://en.wikipedia.org/wiki/Hillel_II">Hillel II's (Hakatan's</a>) calendar (4119 in the Jewish Calendar / 359
 * CE Julian as recorded by <a href="http://en.wikipedia.org/wiki/Hai_Gaon">Rav Hai Gaon</a>) would be just an
 * approximation.
 *
 * This open source Java code was written by <a href="http://www.facebook.com/avromf">Avrom Finkelstien</a> from his C++
 * code. It was refactored to fit the KosherJava Zmanim API with simplification of the code, enhancements and some bug
 * fixing.
 *
 * Some of Avrom's original C++ code was translated from <a href="https://web.archive.org/web/20120124134148/http://emr.cs.uiuc.edu/~reingold/calendar.C">C/C++
 * code</a> in <a href="http://www.calendarists.com">Calendrical Calculations</a> by Nachum Dershowitz and Edward M.
 * Reingold, Software-- Practice &amp; Experience, vol. 20, no. 9 (September, 1990), pp. 899- 928. Any method with the mark
 * "ND+ER" indicates that the method was taken from this source with minor modifications.
 *
 * If you are looking for a class that implements a Jewish calendar version of the Calendar class, one is available from
 * the <a href="http://site.icu-project.org/" >ICU (International Components for Unicode)</a> project, formerly part of
 * IBM's DeveloperWorks.
 *
 * @see JewishCalendar
 * @see HebrewDateFormatter
 * @see java.util.Date
 * @see java.util.Calendar
 * @author &copy; Avrom Finkelstien 2002
 * @author &copy; Eliyahu Hershfeld 2011 - 2015
 */
export class JewishDate {
  /**
   * Value of the month field indicating Nissan, the first numeric month of the year in the Jewish calendar. With the
   * year starting at {@link #TISHREI}, it would actually be the 7th (or 8th in a {@link #isJewishLeapYear() leap
     * year}) month of the year.
   */
  public static readonly NISSAN: number = 1;

  /**
   * Value of the month field indicating Iyar, the second numeric month of the year in the Jewish calendar. With the
   * year starting at {@link #TISHREI}, it would actually be the 8th (or 9th in a {@link #isJewishLeapYear() leap
     * year}) month of the year.
   */
  public static readonly IYAR: number = 2;

  /**
   * Value of the month field indicating Sivan, the third numeric month of the year in the Jewish calendar. With the
   * year starting at {@link #TISHREI}, it would actually be the 9th (or 10th in a {@link #isJewishLeapYear() leap
     * year}) month of the year.
   */
  public static readonly SIVAN: number = 3;

  /**
   * Value of the month field indicating Tammuz, the fourth numeric month of the year in the Jewish calendar. With the
   * year starting at {@link #TISHREI}, it would actually be the 10th (or 11th in a {@link #isJewishLeapYear() leap
     * year}) month of the year.
   */
  public static readonly TAMMUZ: number = 4;

  /**
   * Value of the month field indicating Av, the fifth numeric month of the year in the Jewish calendar. With the year
   * starting at {@link #TISHREI}, it would actually be the 11th (or 12th in a {@link #isJewishLeapYear() leap year})
   * month of the year.
   */
  public static readonly AV: number = 5;

  /**
   * Value of the month field indicating Elul, the sixth numeric month of the year in the Jewish calendar. With the
   * year starting at {@link #TISHREI}, it would actually be the 12th (or 13th in a {@link #isJewishLeapYear() leap
     * year}) month of the year.
   */
  public static readonly ELUL: number = 6;

  /**
   * Value of the month field indicating Tishrei, the seventh numeric month of the year in the Jewish calendar. With
   * the year starting at this month, it would actually be the 1st month of the year.
   */
  public static readonly TISHREI: number = 7;

  /**
   * Value of the month field indicating Cheshvan/marcheshvan, the eighth numeric month of the year in the Jewish
   * calendar. With the year starting at {@link #TISHREI}, it would actually be the 2nd month of the year.
   */
  public static readonly CHESHVAN: number = 8;

  /**
   * Value of the month field indicating Kislev, the ninth numeric month of the year in the Jewish calendar. With the
   * year starting at {@link #TISHREI}, it would actually be the 3rd month of the year.
   */
  public static readonly KISLEV: number = 9;

  /**
   * Value of the month field indicating Teves, the tenth numeric month of the year in the Jewish calendar. With the
   * year starting at {@link #TISHREI}, it would actually be the 4th month of the year.
   */
  public static readonly TEVES: number = 10;

  /**
   * Value of the month field indicating Shevat, the eleventh numeric month of the year in the Jewish calendar. With
   * the year starting at {@link #TISHREI}, it would actually be the 5th month of the year.
   */
  public static readonly SHEVAT: number = 11;

  /**
   * Value of the month field indicating Adar (or Adar I in a {@link #isJewishLeapYear() leap year}), the twelfth
   * numeric month of the year in the Jewish calendar. With the year starting at {@link #TISHREI}, it would actually
   * be the 6th month of the year.
   */
  public static readonly ADAR: number = 12;

  /**
   * Value of the month field indicating Adar II, the leap (intercalary or embolismic) thirteenth (Undecimber) numeric
   * month of the year added in Jewish {@link #isJewishLeapYear() leap year}). The leap years are years 3, 6, 8, 11,
   * 14, 17 and 19 of a 19 year cycle. With the year starting at {@link #TISHREI}, it would actually be the 7th month
   * of the year.
   */
  public static readonly ADAR_II: number = 13;

  /**
   * the Jewish epoch using the RD (Rata Die/Fixed Date or Reingold Dershowitz) day used in Calendrical Calculations.
   * Day 1 is January 1, 0001 Gregorian
   */
  private static readonly JEWISH_EPOCH: number = -1373429;

  /** The number  of <em>chalakim</em> (18) in a minute. */
  private static readonly CHALAKIM_PER_MINUTE: number = 18;

  /** The number  of <em>chalakim</em> (1080) in an hour. */
  private static readonly CHALAKIM_PER_HOUR: number = 1080;

  /** The number of <em>chalakim</em> (25,920) in a 24 hour day. */
  private static readonly CHALAKIM_PER_DAY: number = 25920; // 24 * 1080

  /** The number  of <em>chalakim</em> in an average Jewish month. A month has 29 days, 12 hours and 793
   * <em>chalakim</em> (44 minutes and 3.3 seconds) for a total of 765,433 <em>chalakim</em> */
  private static readonly CHALAKIM_PER_MONTH: number = 765433; // (29 * 24 + 12) * 1080 + 793

  /**
   * Days from the beginning of Sunday till molad BaHaRaD. Calculated as 1 day, 5 hours and 204 chalakim = (24 + 5) *
   * 1080 + 204 = 31524
   */
  private static readonly CHALAKIM_MOLAD_TOHU: number = 31524;

  /**
   * A short year where both {@link #CHESHVAN} and {@link #KISLEV} are 29 days.
   *
   * @see #getCheshvanKislevKviah()
   * @see HebrewDateFormatter#getFormattedKviah(int)
   */
  public static readonly CHASERIM: number = 0;

  /**
   * An ordered year where {@link #CHESHVAN} is 29 days and {@link #KISLEV} is 30 days.
   *
   * @see #getCheshvanKislevKviah()
   * @see HebrewDateFormatter#getFormattedKviah(int)
   */
  public static readonly KESIDRAN: number = 1;

  /**
   * A long year where both {@link #CHESHVAN} and {@link #KISLEV} are 30 days.
   *
   * @see #getCheshvanKislevKviah()
   * @see HebrewDateFormatter#getFormattedKviah(int)
   */
  public static readonly SHELAIMIM: number = 2;

  /** the internal Jewish month. */
  private jewishMonth!: number;

  /** the internal Jewish day. */
  private jewishDay!: number;

  /** the internal Jewish year. */
  private jewishYear!: number;

  /** the internal count of <em>molad</em> hours. */
  private moladHours!: number;

  /** the internal count of <em>molad</em> minutes. */
  private moladMinutes!: number;

  /** the internal count of <em>molad</em> <em>chalakim</em>. */
  private moladChalakim!: number;

  /**
   * Returns the molad hours. Only a JewishDate object populated with {@link #getMolad()},
   * {@link #setJewishDate(int, int, int, int, int, int)} or {@link #setMoladHours(int)} will have this field
   * populated. A regular JewishDate object will have this field set to 0.
   *
   * @return the molad hours
   * @see #setMoladHours(int)
   * @see #getMolad()
   * @see #setJewishDate(int, int, int, int, int, int)
   */
  public getMoladHours(): number {
    return this.moladHours;
  }

  /**
   * Sets the molad hours.
   *
   * @param moladHours
   *            the molad hours to set
   * @see #getMoladHours()
   * @see #getMolad()
   * @see #setJewishDate(int, int, int, int, int, int)
   *
   */
  public setMoladHours(moladHours: number): void {
    this.moladHours = moladHours;
  }

  /**
   * Returns the molad minutes. Only an object populated with {@link #getMolad()},
   * {@link #setJewishDate(int, int, int, int, int, int)} or or {@link #setMoladMinutes(int)} will have these fields
   * populated. A regular JewishDate object will have this field set to 0.
   *
   * @return the molad minutes
   * @see #setMoladMinutes(int)
   * @see #getMolad()
   * @see #setJewishDate(int, int, int, int, int, int)
   */
  public getMoladMinutes(): number {
    return this.moladMinutes;
  }

  /**
   * Sets the molad minutes. The expectation is that the traditional minute-less chalakim will be broken out to
   * minutes and {@link #setMoladChalakim(int) chalakim/parts} , so 793 (TaShTZaG) parts would have the minutes set to
   * 44 and chalakim to 1.
   *
   * @param moladMinutes
   *            the molad minutes to set
   * @see #getMoladMinutes()
   * @see #setMoladChalakim(int)
   * @see #getMolad()
   * @see #setJewishDate(int, int, int, int, int, int)
   *
   */
  public setMoladMinutes(moladMinutes: number): void {
    this.moladMinutes = moladMinutes;
  }

  /**
   * Sets the molad chalakim/parts. The expectation is that the traditional minute-less chalakim will be broken out to
   * {@link #setMoladMinutes(int) minutes} and chalakim, so 793 (TaShTZaG) parts would have the minutes set to 44 and
   * chalakim to 1.
   *
   * @param moladChalakim
   *            the molad chalakim/parts to set
   * @see #getMoladChalakim()
   * @see #setMoladMinutes(int)
   * @see #getMolad()
   * @see #setJewishDate(int, int, int, int, int, int)
   *
   */
  public setMoladChalakim(moladChalakim: number): void {
    this.moladChalakim = moladChalakim;
  }

  /**
   * Returns the molad chalakim/parts. Only an object populated with {@link #getMolad()},
   * {@link #setJewishDate(int, int, int, int, int, int)} or or {@link #setMoladChalakim(int)} will have these fields
   * populated. A regular JewishDate object will have this field set to 0.
   *
   * @return the molad chalakim/parts
   * @see #setMoladChalakim(int)
   * @see #getMolad()
   * @see #setJewishDate(int, int, int, int, int, int)
   */
  public getMoladChalakim(): number {
    return this.moladChalakim;
  }

  /**
   * Returns the last day in a gregorian month
   *
   * @param month
   *            the Gregorian month
   * @return the last day of the Gregorian month
   */
  public getLastDayOfGregorianMonth(month: number): number {
    return JewishDate.getLastDayOfGregorianMonth(month, this.gregorianYear);
  }

  /**
   * The month, where 1 == January, 2 == February, etc... Note that this is different than the Java's Calendar class
   * where January ==0
   */
  private gregorianMonth!: number;

  /** The day of the Gregorian month */
  private gregorianDayOfMonth!: number;

  /** The Gregorian year */
  private gregorianYear!: number;

  /** 1 == Sunday, 2 == Monday, etc... */
  private dayOfWeek!: number;

  /** Returns the absolute date (days since January 1, 0001 on the Gregorian calendar).
   * @see #getAbsDate()
   * @see #absDateToJewishDate()
   */
  private gregorianAbsDate!: number;

  /**
   * Returns the number of days in a given month in a given month and year.
   *
   * @param month
   *            the month. As with other cases in this class, this is 1-based, not zero-based.
   * @param year
   *            the year (only impacts February)
   * @return the number of days in the month in the given year
   */
  private static getLastDayOfGregorianMonth(month: number, year: number): number {
    switch (month) {
      case 2:
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
          return 29;
        }
        return 28;
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
      default:
        return 31;
    }
  }

  /**
   * Computes the Gregorian date from the absolute date. ND+ER
   * @param absDate - the absolute date
   */
  private absDateToDate(absDate: number): void {
    let year: number = Math.trunc(absDate / 366); // Search forward year by year from approximate year
    while (absDate >= JewishDate.gregorianDateToAbsDate(year + 1, 1, 1)) {
      year++;
    }

    let month: number = 1; // Search forward month by month from January
    while (absDate > JewishDate.gregorianDateToAbsDate(year, month, JewishDate.getLastDayOfGregorianMonth(month, year))) {
      month++;
    }

    const dayOfMonth: number = absDate - JewishDate.gregorianDateToAbsDate(year, month, 1) + 1;
    this.setInternalGregorianDate(year, month, dayOfMonth);
  }

  /**
   * Returns the absolute date (days since January 1, 0001 on the Gregorian calendar).
   *
   * @return the number of days since January 1, 1
   */
  public getAbsDate(): number {
    return this.gregorianAbsDate;
  }

  /**
   * Computes the absolute date from a Gregorian date. ND+ER
   *
   * @param year
   *            the Gregorian year
   * @param month
   *            the Gregorian month. Unlike the Java Calendar where January has the value of 0,This expects a 1 for
   *            January
   * @param dayOfMonth
   *            the day of the month (1st, 2nd, etc...)
   * @return the absolute Gregorian day
   */
  private static gregorianDateToAbsDate(year: number, month: number, dayOfMonth: number): number {
    let absDate: number = dayOfMonth;
    for (let m: number = month - 1; m > 0; m--) {
      absDate += JewishDate.getLastDayOfGregorianMonth(m, year); // days in prior months of the year
    }
    return (absDate // days this year
      + 365 * (year - 1) // days in previous years ignoring leap days
      + Math.trunc((year - 1) / 4) // Julian leap days before this year
      - Math.trunc((year - 1) / 100) // minus prior century years
      + Math.trunc((year - 1) / 400)); // plus prior years divisible by 400
  }

  /**
   * Returns if the year is a Jewish leap year. Years 3, 6, 8, 11, 14, 17 and 19 in the 19 year cycle are leap years.
   *
   * @param year
   *            the Jewish year.
   * @return true if it is a leap year
   * @see #isJewishLeapYear()
   */
  private static isJewishLeapYear(year: number): boolean {
    return ((7 * year) + 1) % 19 < 7;
  }

  /**
   * Returns if the year the calendar is set to is a Jewish leap year. Years 3, 6, 8, 11, 14, 17 and 19 in the 19 year
   * cycle are leap years.
   *
   * @return true if it is a leap year
   * @see #isJewishLeapYear(int)
   */
  public isJewishLeapYear(): boolean {
    return JewishDate.isJewishLeapYear(this.getJewishYear());
  }

  /**
   * Returns the last month of a given Jewish year. This will be 12 on a non {@link #isJewishLeapYear(int) leap year}
   * or 13 on a leap year.
   *
   * @param year
   *            the Jewish year.
   * @return 12 on a non leap year or 13 on a leap year
   * @see #isJewishLeapYear(int)
   */
  private static getLastMonthOfJewishYear(year: number): number {
    return JewishDate.isJewishLeapYear(year) ? JewishDate.ADAR_II : JewishDate.ADAR;
  }

  /**
   * Returns the number of days elapsed from the Sunday prior to the start of the Jewish calendar to the mean
   * conjunction of Tishri of the Jewish year.
   *
   * @param year
   *            the Jewish year
   * @return the number of days elapsed from prior to the molad Tohu BaHaRaD (Be = Monday, Ha= 5 hours and Rad =204
   *         chalakim/parts) prior to the start of the Jewish calendar, to the mean conjunction of Tishri of the
   *         Jewish year. BeHaRaD is 23:11:20 on Sunday night(5 hours 204/1080 chalakim after sunset on Sunday
   *         evening).
   */
  public static getJewishCalendarElapsedDays(year: number): number {
    const chalakimSince: number = JewishDate.getChalakimSinceMoladTohu(year, JewishDate.TISHREI);
    const moladDay: number = Math.trunc(chalakimSince / JewishDate.CHALAKIM_PER_DAY);
    const moladParts: number = Math.trunc(chalakimSince - moladDay * JewishDate.CHALAKIM_PER_DAY);
    // delay Rosh Hashana for the 4 dechiyos
    return JewishDate.addDechiyos(year, moladDay, moladParts);
  }

  // private static int getJewishCalendarElapsedDaysOLD(int year) {
  // // Jewish lunar month = 29 days, 12 hours and 793 chalakim
  // // Molad Tohu = BeHaRaD - Monday, 5 hours (11 PM) and 204 chalakim
  // final int chalakimTashTZag = 793; // chalakim in a lunar month
  // final int chalakimTohuRaD = 204; // chalakim from original molad Tohu BeHaRaD
  // final int hoursTohuHa = 5; // hours from original molad Tohu BeHaRaD
  // final int dayTohu = 1; // Monday (0 based)
  //
  // int monthsElapsed = (235 * ((year - 1) / 19)) // Months in complete 19 year lunar (Metonic) cycles so far
  // + (12 * ((year - 1) % 19)) // Regular months in this cycle
  // + ((7 * ((year - 1) % 19) + 1) / 19); // Leap months this cycle
  // // start with Molad Tohu BeHaRaD
  // // start with RaD of BeHaRaD and add TaShTzaG (793) chalakim plus elapsed chalakim
  // int partsElapsed = chalakimTohuRaD + chalakimTashTZag * (monthsElapsed % 1080);
  // // start with Ha hours of BeHaRaD, add 12 hour remainder of lunar month add hours elapsed
  // int hoursElapsed = hoursTohuHa + 12 * monthsElapsed + 793 * (monthsElapsed / 1080) + partsElapsed / 1080;
  // // start with Monday of BeHaRaD = 1 (0 based), add 29 days of the lunar months elapsed
  // int conjunctionDay = dayTohu + 29 * monthsElapsed + hoursElapsed / 24;
  // int conjunctionParts = 1080 * (hoursElapsed % 24) + partsElapsed % 1080;
  // return addDechiyos(year, conjunctionDay, conjunctionParts);
  // }

  /**
   * Adds the 4 dechiyos for molad Tishrei. These are:
   * <ol>
   * <li>Lo ADU Rosh - Rosh Hashana can't fall on a Sunday, Wednesday or Friday. If the molad fell on one of these
   * days, Rosh Hashana is delayed to the following day.</li>
   * <li>Molad Zaken - If the molad of Tishrei falls after 12 noon, Rosh Hashana is delayed to the following day. If
   * the following day is ADU, it will be delayed an additional day.</li>
   * <li>GaTRaD - If on a non leap year the molad of Tishrei falls on a Tuesday (Ga) on or after 9 hours (T) and 204
   * chalakim (TRaD) it is delayed till Thursday (one day delay, plus one day for Lo ADU Rosh)</li>
   * <li>BeTuTaKFoT - if the year following a leap year falls on a Monday (Be) on or after 15 hours (Tu) and 589
   * chalakim (TaKFoT) it is delayed till Tuesday</li>
   * </ol>
   *
   * @param year - the year
   * @param moladDay - the molad day
   * @param moladParts - the molad parts
   * @return the number of elapsed days in the JewishCalendar adjusted for the 4 dechiyos.
   */
  private static addDechiyos(year: number, moladDay: number, moladParts: number): number {
    let roshHashanaDay: number = moladDay; // if no dechiyos
    // delay Rosh Hashana for the dechiyos of the Molad - new moon 1 - Molad Zaken, 2- GaTRaD 3- BeTuTaKFoT
    if ((moladParts >= 19440) // Dechiya of Molad Zaken - molad is >= midday (18 hours * 1080 chalakim)
      || (((moladDay % 7) === 2) // start Dechiya of GaTRaD - Ga = is a Tuesday
        && (moladParts >= 9924) // TRaD = 9 hours, 204 parts or later (9 * 1080 + 204)
        && !JewishDate.isJewishLeapYear(year)) // of a non-leap year - end Dechiya of GaTRaD
      || (((moladDay % 7) === 1) // start Dechiya of BeTuTaKFoT - Be = is on a Monday
        && (moladParts >= 16789) // TRaD = 15 hours, 589 parts or later (15 * 1080 + 589)
        && (JewishDate.isJewishLeapYear(year - 1)))) { // in a year following a leap year - end Dechiya of BeTuTaKFoT
      roshHashanaDay += 1; // Then postpone Rosh HaShanah one day
    }
    // start 4th Dechiya - Lo ADU Rosh - Rosh Hashana can't occur on A- sunday, D- Wednesday, U - Friday
    if (((roshHashanaDay % 7) === 0) // If Rosh HaShanah would occur on Sunday,
      || ((roshHashanaDay % 7) === 3) // or Wednesday,
      || ((roshHashanaDay % 7) === 5)) { // or Friday - end 4th Dechiya - Lo ADU Rosh
      roshHashanaDay++; // Then postpone it one (more) day
    }
    return roshHashanaDay;
  }

  /**
   * Returns the number of chalakim (parts - 1080 to the hour) from the original hypothetical Molad Tohu to the year
   * and month passed in.
   *
   * @param year
   *            the Jewish year
   * @param month
   *            the Jewish month the Jewish month, with the month numbers starting from Nisan. Use the JewishDate
   *            constants such as {@link JewishDate#TISHREI}.
   * @return the number of chalakim (parts - 1080 to the hour) from the original hypothetical Molad Tohu
   */
  private static getChalakimSinceMoladTohu(year: number, month: number): number {
    // Jewish lunar month = 29 days, 12 hours and 793 chalakim
    // chalakim since Molad Tohu BeHaRaD - 1 day, 5 hours and 204 chalakim
    const monthOfYear: number = JewishDate.getJewishMonthOfYear(year, month);
    const monthsElapsed: number = (235 * Math.trunc((year - 1) / 19)) // Months in complete 19 year lunar (Metonic) cycles so far
      + (12 * ((year - 1) % 19)) // Regular months in this cycle
      + Math.trunc((7 * ((year - 1) % 19) + 1) / 19) // Leap months this cycle
      + (monthOfYear - 1); // add elapsed months till the start of the molad of the month
    // return chalakim prior to BeHaRaD + number of chalakim since
    return JewishDate.CHALAKIM_MOLAD_TOHU + (JewishDate.CHALAKIM_PER_MONTH * monthsElapsed);
  }

  /**
   * Returns the number of chalakim (parts - 1080 to the hour) from the original hypothetical Molad Tohu to the Jewish
   * year and month that this Object is set to.
   *
   * @return the number of chalakim (parts - 1080 to the hour) from the original hypothetical Molad Tohu
   */
  public getChalakimSinceMoladTohu(): number {
    return JewishDate.getChalakimSinceMoladTohu(this.jewishYear, this.jewishMonth);
  }

  /**
   * Converts the {@link JewishDate#NISSAN} based constants used by this class to numeric month starting from
   * {@link JewishDate#TISHREI}. This is required for Molad claculations.
   *
   * @param year
   *            The Jewish year
   * @param month
   *            The Jewish Month
   * @return the Jewish month of the year starting with Tishrei
   */
  private static getJewishMonthOfYear(year: number, month: number): number {
    const isLeapYear: boolean = JewishDate.isJewishLeapYear(year);
    return ((month + (isLeapYear ? 6 : 5)) % (isLeapYear ? 13 : 12)) + 1;
  }

  /**
   * Validates the components of a Jewish date for validity. It will throw an {@link IllegalArgumentException} if the
   * Jewish date is earlier than 18 Teves, 3761 (1/1/1 Gregorian), a month < 1 or > 12 (or 13 on a
   * {@link #isJewishLeapYear(int) leap year}), the day of month is < 1 or > 30, an hour < 0 or > 23, a minute < 0 >
   * 59 or chalakim < 0 > 17. For larger a larger number of chalakim such as 793 (TaShTzaG) break the chalakim into
   * minutes (18 chalakim per minutes, so it would be 44 minutes and 1 chelek in the case of 793/TaShTzaG).
   *
   * @param year
   *            the Jewish year to validate. It will reject any year <= 3761 (lower than the year 1 Gregorian).
   * @param month
   *            the Jewish month to validate. It will reject a month < 1 or > 12 (or 13 on a leap year) .
   * @param dayOfMonth
   *            the day of the Jewish month to validate. It will reject any value < 1 or > 30 TODO: check calling
   *            methods to see if there is any reason that the class can validate that 30 is invalid for some months.
   * @param hours
   *            the hours (for molad calculations). It will reject an hour < 0 or > 23
   * @param minutes
   *            the minutes (for molad calculations). It will reject a minute < 0 or > 59
   * @param chalakim
   *            the chalakim/parts (for molad calculations). It will reject a chalakim < 0 or > 17. For larger numbers
   *            such as 793 (TaShTzaG) break the chalakim into minutes (18 chalakim per minutes, so it would be 44
   *            minutes and 1 chelek in the case of 793/TaShTzaG)
   *
   * @throws IllegalArgumentException
   *             if a A Jewish date earlier than 18 Teves, 3761 (1/1/1 Gregorian), a month < 1 or > 12 (or 13 on a
   *             leap year), the day of month is < 1 or > 30, an hour < 0 or > 23, a minute < 0 > 59 or chalakim < 0 >
   *             17. For larger a larger number of chalakim such as 793 (TaShTzaG) break the chalakim into minutes (18
   *             chalakim per minutes, so it would be 44 minutes and 1 chelek in the case of 793 (TaShTzaG).
   */
  private static validateJewishDate(year: number, month: number, dayOfMonth: number, hours: number, minutes: number, chalakim: number): void {
    if (month < JewishDate.NISSAN || month > JewishDate.getLastMonthOfJewishYear(year)) {
      throw new IllegalArgumentException(`The Jewish month has to be between 1 and 12 (or 13 on a leap year). ${month} is invalid for the year ${year}.`);
    }
    if (dayOfMonth < 1 || dayOfMonth > 30) {
      throw new IllegalArgumentException(`The Jewish day of month can't be < 1 or > 30. ${dayOfMonth} is invalid.`);
    }
    // reject dates prior to 18 Teves, 3761 (1/1/1 AD). This restriction can be relaxed if the date coding is
    // changed/corrected
    if ((year < 3761) || (year === 3761 && (month >= JewishDate.TISHREI && month < JewishDate.TEVES))
      || (year === 3761 && month === JewishDate.TEVES && dayOfMonth < 18)) {
      throw new IllegalArgumentException(`A Jewish date earlier than 18 Teves, 3761 (1/1/1 Gregorian) can't be set. ${year}, ${month}, ${dayOfMonth} is invalid.`);
    }
    if (hours < 0 || hours > 23) {
      throw new IllegalArgumentException(`Hours < 0 or > 23 can't be set. ${hours} is invalid.`);
    }

    if (minutes < 0 || minutes > 59) {
      throw new IllegalArgumentException(`Minutes < 0 or > 59 can't be set. ${minutes} is invalid.`);
    }

    if (chalakim < 0 || chalakim > 17) {
      throw new IllegalArgumentException(`Chalakim/parts < 0 or > 17 can't be set. ${chalakim} is invalid. For larger numbers such as 793 (TaShTzaG) break the chalakim into minutes (18 chalakim per minutes, so it would be 44 minutes and 1 chelek in the case of 793 (TaShTzaG)`);
    }
  }

  /**
   * Validates the components of a Gregorian date for validity. It will throw an {@link IllegalArgumentException} if a
   * year of < 1, a month < 0 or > 11 or a day of month < 1 is passed in.
   *
   * @param year
   *            the Gregorian year to validate. It will reject any year < 1.
   * @param month
   *            the Gregorian month number to validate. It will enforce that the month is between 0 - 11 like a
   *            {@link GregorianCalendar}, where {@link Calendar#JANUARY} has a value of 0.
   * @param dayOfMonth
   *            the day of the Gregorian month to validate. It will reject any value < 1, but will allow values > 31
   *            since calling methods will simply set it to the maximum for that month. TODO: check calling methods to
   *            see if there is any reason that the class needs days > the maximum.
   * @throws IllegalArgumentException
   *             if a year of < 1, a month < 0 or > 11 or a day of month < 1 is passed in
   * @see #validateGregorianYear(int)
   * @see #validateGregorianMonth(int)
   * @see #validateGregorianDayOfMonth(int)
   */
  private static validateGregorianDate(year: number, month: number, dayOfMonth: number): void {
    JewishDate.validateGregorianMonth(month);
    JewishDate.validateGregorianDayOfMonth(dayOfMonth);
    JewishDate.validateGregorianYear(year);
  }

  /**
   * Validates a Gregorian month for validity.
   *
   * @param month
   *            the Gregorian month number to validate. It will enforce that the month is between 0 - 11 like a
   *            {@link GregorianCalendar}, where {@link Calendar#JANUARY} has a value of 0.
   */
  private static validateGregorianMonth(month: number): void {
    if (month > 11 || month < 0) {
      throw new IllegalArgumentException(`The Gregorian month has to be between 0 - 11. ${month} is invalid.`);
    }
  }

  /**
   * Validates a Gregorian day of month for validity.
   *
   * @param dayOfMonth
   *            the day of the Gregorian month to validate. It will reject any value < 1, but will allow values > 31
   *            since calling methods will simply set it to the maximum for that month. TODO: check calling methods to
   *            see if there is any reason that the class needs days > the maximum.
   */
  private static validateGregorianDayOfMonth(dayOfMonth: number): void {
    if (dayOfMonth <= 0) {
      throw new IllegalArgumentException(`The day of month can't be less than 1. ${dayOfMonth} is invalid.`);
    }
  }

  /**
   * Validates a Gregorian year for validity.
   *
   * @param year
   *            the Gregorian year to validate. It will reject any year < 1.
   */
  private static validateGregorianYear(year: number): void {
    if (year < 1) {
      throw new IllegalArgumentException(`Years < 1 can't be calculated. ${year} is invalid.`);
    }
  }

  /**
   * Returns the number of days for a given Jewish year. ND+ER
   *
   * @param year
   *            the Jewish year
   * @return the number of days for a given Jewish year.
   * @see #isCheshvanLong()
   * @see #isKislevShort()
   */
  public static getDaysInJewishYear(year: number): number {
    return JewishDate.getJewishCalendarElapsedDays(year + 1) - JewishDate.getJewishCalendarElapsedDays(year);
  }

  /**
   * Returns the number of days for the current year that the calendar is set to.
   *
   * @return the number of days for the Object's current Jewish year.
   * @see #isCheshvanLong()
   * @see #isKislevShort()
   * @see #isJewishLeapYear()
   */
  public getDaysInJewishYear(): number {
    return JewishDate.getDaysInJewishYear(this.getJewishYear());
  }

  /**
   * Returns if Cheshvan is long in a given Jewish year. The method name isLong is done since in a Kesidran (ordered)
   * year Cheshvan is short. ND+ER
   *
   * @param year
   *            the year
   * @return true if Cheshvan is long in Jewish year.
   * @see #isCheshvanLong()
   * @see #getCheshvanKislevKviah()
   */
  private static isCheshvanLong(year: number): boolean {
    return JewishDate.getDaysInJewishYear(year) % 10 === 5;
  }

  /**
   * Returns if Cheshvan is long (30 days VS 29 days) for the current year that the calendar is set to. The method
   * name isLong is done since in a Kesidran (ordered) year Cheshvan is short.
   *
   * @return true if Cheshvan is long for the current year that the calendar is set to
   * @see #isCheshvanLong()
   */
  public isCheshvanLong(): boolean {
    return JewishDate.isCheshvanLong(this.getJewishYear());
  }

  /**
   * Returns if Kislev is short (29 days VS 30 days) in a given Jewish year. The method name isShort is done since in
   * a Kesidran (ordered) year Kislev is long. ND+ER
   *
   * @param year
   *            the Jewish year
   * @return true if Kislev is short for the given Jewish year.
   * @see #isKislevShort()
   * @see #getCheshvanKislevKviah()
   */
  private static isKislevShort(year: number): boolean {
    return JewishDate.getDaysInJewishYear(year) % 10 === 3;
  }

  /**
   * Returns if the Kislev is short for the year that this class is set to. The method name isShort is done since in a
   * Kesidran (ordered) year Kislev is long.
   *
   * @return true if Kislev is short for the year that this class is set to
   */
  public isKislevShort(): boolean {
    return JewishDate.isKislevShort(this.getJewishYear());
  }

  /**
   * Returns the Cheshvan and Kislev kviah (whether a Jewish year is short, regular or long). It will return
   * {@link #SHELAIMIM} if both cheshvan and kislev are 30 days, {@link #KESIDRAN} if Cheshvan is 29 days and Kislev
   * is 30 days and {@link #CHASERIM} if both are 29 days.
   *
   * @return {@link #SHELAIMIM} if both cheshvan and kislev are 30 days, {@link #KESIDRAN} if Cheshvan is 29 days and
   *         Kislev is 30 days and {@link #CHASERIM} if both are 29 days.
   * @see #isCheshvanLong()
   * @see #isKislevShort()
   */
  public getCheshvanKislevKviah(): number {
    if (this.isCheshvanLong() && !this.isKislevShort()) {
      return JewishDate.SHELAIMIM;
    } else if (!this.isCheshvanLong() && this.isKislevShort()) {
      return JewishDate.CHASERIM;
    }
    return JewishDate.KESIDRAN;
  }

  /**
   * Returns the number of days of a Jewish month for a given month and year.
   *
   * @param month
   *            the Jewish month
   * @param year
   *            the Jewish Year
   * @return the number of days for a given Jewish month
   */
  private static getDaysInJewishMonth(month: number, year: number): number {
    const shortMonths = [
      JewishDate.IYAR,
      JewishDate.TAMMUZ,
      JewishDate.ELUL,
      JewishDate.ADAR_II,
    ];
    if (shortMonths.includes(month)
      || ((month === JewishDate.CHESHVAN) && !(JewishDate.isCheshvanLong(year)))
      || ((month === JewishDate.KISLEV) && JewishDate.isKislevShort(year)) || (month === JewishDate.TEVES)
      || ((month === JewishDate.ADAR) && !(JewishDate.isJewishLeapYear(year)))) {
      return 29;
    }
    return 30;
  }

  /**
   * Returns the number of days of the Jewish month that the calendar is currently set to.
   *
   * @return the number of days for the Jewish month that the calendar is currently set to.
   */
  public getDaysInJewishMonth(): number {
    return JewishDate.getDaysInJewishMonth(this.getJewishMonth(), this.getJewishYear());
  }

  /**
   * Computes the Jewish date from the absolute date.
   */
  private absDateToJewishDate(): void {
    // Approximation from below
    this.jewishYear = Math.trunc((this.gregorianAbsDate - JewishDate.JEWISH_EPOCH) / 366);
    // Search forward for year from the approximation
    while (this.gregorianAbsDate >= JewishDate.jewishDateToAbsDate(this.jewishYear + 1, JewishDate.TISHREI, 1)) {
      this.jewishYear++;
    }
    // Search forward for month from either Tishri or Nisan.
    if (this.gregorianAbsDate < JewishDate.jewishDateToAbsDate(this.jewishYear, JewishDate.NISSAN, 1)) {
      this.jewishMonth = JewishDate.TISHREI; // Start at Tishri
    } else {
      this.jewishMonth = JewishDate.NISSAN; // Start at Nisan
    }
    while (this.gregorianAbsDate > JewishDate.jewishDateToAbsDate(this.jewishYear, this.jewishMonth, this.getDaysInJewishMonth())) {
      this.jewishMonth++;
    }
    // Calculate the day by subtraction
    this.jewishDay = this.gregorianAbsDate - JewishDate.jewishDateToAbsDate(this.jewishYear, this.jewishMonth, 1) + 1;
  }

  /**
   * Returns the absolute date of Jewish date. ND+ER
   *
   * @param year
   *            the Jewish year. The year can't be negative
   * @param month
   *            the Jewish month starting with Nisan. Nisan expects a value of 1 etc till Adar with a value of 12. For
   *            a leap year, 13 will be the expected value for Adar II. Use the constants {@link JewishDate#NISSAN}
   *            etc.
   * @param dayOfMonth
   *            the Jewish day of month. valid values are 1-30. If the day of month is set to 30 for a month that only
   *            has 29 days, the day will be set as 29.
   * @return the absolute date of the Jewish date.
   */
  private static jewishDateToAbsDate(year: number, month: number, dayOfMonth: number): number {
    const elapsed: number = JewishDate.getDaysSinceStartOfJewishYear(year, month, dayOfMonth);
    // add elapsed days this year + Days in prior years + Days elapsed before absolute year 1
    return elapsed + JewishDate.getJewishCalendarElapsedDays(year) + JewishDate.JEWISH_EPOCH;
  }

  /**
   * Returns the molad for a given year and month. Returns a JewishDate {@link Object} set to the date of the molad
   * with the {@link #getMoladHours() hours}, {@link #getMoladMinutes() minutes} and {@link #getMoladChalakim()
     * chalakim} set. In the current implementation, it sets the molad time based on a midnight date rollover. This
   * means that Rosh Chodesh Adar II, 5771 with a molad of 7 chalakim past midnight on Shabbos 29 Adar I / March 5,
   * 2011 12:00 AM and 7 chalakim, will have the following values: hours: 0, minutes: 0, Chalakim: 7.
   *
   * @return a JewishDate {@link Object} set to the date of the molad with the {@link #getMoladHours() hours},
   *         {@link #getMoladMinutes() minutes} and {@link #getMoladChalakim() chalakim} set.
   */
  public getMolad(): JewishDate {
    const moladDate: JewishDate = new JewishDate(this.getChalakimSinceMoladTohu());
    if (moladDate.getMoladHours() >= 6) {
      moladDate.forward(Calendar.DATE, 1);
    }
    moladDate.setMoladHours((moladDate.getMoladHours() + 18) % 24);
    return moladDate;
  }

  /**
   * Returns the number of days from the Jewish epoch from the number of chalakim from the epoch passed in.
   *
   * @param chalakim
   *            the number of chalakim since the beginning of Sunday prior to BaHaRaD
   * @return the number of days from the Jewish epoch
   */
  private static moladToAbsDate(chalakim: number): number {
    return Math.trunc(chalakim / JewishDate.CHALAKIM_PER_DAY) + JewishDate.JEWISH_EPOCH;
  }

  /**
   * Constructor that creates a JewishDate based on a molad passed in. The molad would be the number of chalakim/parts
   * starting at the beginning of Sunday prior to the molad Tohu BeHaRaD (Be = Monday, Ha= 5 hours and Rad =204
   * chalakim/parts) - prior to the start of the Jewish calendar. BeHaRaD is 23:11:20 on Sunday night(5 hours 204/1080
   * chalakim after sunset on Sunday evening).
   *
   * @param molad the number of chalakim since the beginning of Sunday prior to BaHaRaD
   */

  /*
      public JewishDate(molad: number) {
          this.absDateToDate(JewishDate.moladToAbsDate(molad));
          // long chalakimSince = getChalakimSinceMoladTohu(year, JewishDate.TISHREI);// tishrei
          const conjunctionDay: number = Math.trunc(molad / JewishDate.CHALAKIM_PER_DAY);
          const conjunctionParts: number = Math.trunc(molad - conjunctionDay * JewishDate.CHALAKIM_PER_DAY);
          this.setMoladTime(conjunctionParts);
      }
  */

  /**
   * Sets the molad time (hours minutes and chalakim) based on the number of chalakim since the start of the day.
   *
   * @param chalakim
   *            the number of chalakim since the start of the day.
   */
  private setMoladTime(chalakim: number): void {
    let adjustedChalakim: number = chalakim;
    this.setMoladHours(Math.trunc(adjustedChalakim / JewishDate.CHALAKIM_PER_HOUR));
    adjustedChalakim = adjustedChalakim - (this.getMoladHours() * JewishDate.CHALAKIM_PER_HOUR);
    this.setMoladMinutes(Math.trunc(adjustedChalakim / JewishDate.CHALAKIM_PER_MINUTE));
    this.setMoladChalakim(adjustedChalakim - this.moladMinutes * JewishDate.CHALAKIM_PER_MINUTE);
  }

  /**
   * returns the number of days from Rosh Hashana of the date passed in, to the full date passed in.
   *
   * @return the number of days
   */
  public getDaysSinceStartOfJewishYear(): number {
    return JewishDate.getDaysSinceStartOfJewishYear(this.getJewishYear(), this.getJewishMonth(), this.getJewishDayOfMonth());
  }

  /**
   * returns the number of days from Rosh Hashana of the date passed in, to the full date passed in.
   *
   * @param year
   *            the Jewish year
   * @param month
   *            the Jewish month
   * @param dayOfMonth
   *            the day in the Jewish month
   * @return the number of days
   */
  private static getDaysSinceStartOfJewishYear(year: number, month: number, dayOfMonth: number): number {
    let elapsedDays: number = dayOfMonth;
    // Before Tishrei (from Nissan to Tishrei), add days in prior months
    if (month < JewishDate.TISHREI) {
      // this year before and after Nisan.
      for (let m: number = JewishDate.TISHREI; m <= JewishDate.getLastMonthOfJewishYear(year); m++) {
        elapsedDays += JewishDate.getDaysInJewishMonth(m, year);
      }
      for (let m: number = JewishDate.NISSAN; m < month; m++) {
        elapsedDays += JewishDate.getDaysInJewishMonth(m, year);
      }
    } else { // Add days in prior months this year
      for (let m: number = JewishDate.TISHREI; m < month; m++) {
        elapsedDays += JewishDate.getDaysInJewishMonth(m, year);
      }
    }
    return elapsedDays;
  }

  constructor(jewishYear: number, jewishMonth: number, jewishDayOfMonth: number)
  constructor(molad: number)
  constructor(date: Date)
  constructor(date: DateTime)
  constructor()
  constructor(jewishYearOrDateTimeOrDateOrMolad?: number | Date | DateTime, jewishMonth?: number, jewishDayOfMonth?: number) {
    if (!jewishYearOrDateTimeOrDateOrMolad) {
      this.resetDate();
    } else if (jewishMonth) {
      this.setJewishDate(jewishYearOrDateTimeOrDateOrMolad as number, jewishMonth, jewishDayOfMonth!);
    } else if (jewishYearOrDateTimeOrDateOrMolad instanceof Date) {
      this.setDate(DateTime.fromJSDate(jewishYearOrDateTimeOrDateOrMolad as Date));
    } else if (DateTime.isDateTime(jewishYearOrDateTimeOrDateOrMolad)) {
      this.setDate(jewishYearOrDateTimeOrDateOrMolad as DateTime);
    } else if (typeof jewishYearOrDateTimeOrDateOrMolad === 'number') {
      const molad = jewishYearOrDateTimeOrDateOrMolad as number;
      this.absDateToDate(JewishDate.moladToAbsDate(molad));
      // long chalakimSince = getChalakimSinceMoladTohu(year, JewishDate.TISHREI);// tishrei
      const conjunctionDay: number = Math.trunc(molad / JewishDate.CHALAKIM_PER_DAY);
      const conjunctionParts: number = Math.trunc(molad - conjunctionDay * JewishDate.CHALAKIM_PER_DAY);
      this.setMoladTime(conjunctionParts);
    }
  }

  /**
   * Creates a Jewish date based on a Jewish year, month and day of month.
   *
   * @param jewishYear
   *            the Jewish year
   * @param jewishMonth
   *            the Jewish month. The method expects a 1 for Nissan ... 12 for Adar and 13 for Adar II. Use the
   *            constants {@link #NISSAN} ... {@link #ADAR} (or {@link #ADAR_II} for a leap year Adar II) to avoid any
   *            confusion.
   * @param jewishDayOfMonth
   *            the Jewish day of month. If 30 is passed in for a month with only 29 days (for example {@link #IYAR},
   *            or {@link #KISLEV} in a year that {@link #isKislevShort()}), the 29th (last valid date of the month)
   *            will be set
   * @throws IllegalArgumentException
   *             if the day of month is &lt; 1 or &gt; 30, or a year of &lt; 0 is passed in.
   */
  /*
      public JewishDate(jewishYear: number, jewishMonth: number, jewishDayOfMonth: number) {
          this.setJewishDate(jewishYear, jewishMonth, jewishDayOfMonth);
      }
  */

  /**
   * Default constructor will set a default date to the current system date.
   */
  /*
      public JewishDate() {
          this.resetDate();
      }
  */

  /**
   * A constructor that initializes the date to the {@link java.util.Date Date} paremeter.
   *
   * @param date
   *            the <code>Date</code> to set the calendar to
   * @throws IllegalArgumentException
   *             if the date would fall prior to the January 1, 1 AD
   */
  /*
      public JewishDate(date: Date) {
          this.setDate(date);
      }
  */

  /**
   * A constructor that initializes the date to the {@link java.util.Calendar Calendar} paremeter.
   *
   * @param calendar
   *            the <code>Calendar</code> to set the calendar to
   * @throws IllegalArgumentException
   *             if the {@link Calendar#ERA} is {@link GregorianCalendar#BC}
   */

  /*
      public JewishDate(calendar: GregorianCalendar) {
          this.setDate(calendar);
      }
  */

  /**
   * Sets the date based on a {@link java.util.Calendar Calendar} object. Modifies the Jewish date as well.
   *
   * @param date
   *            the <code>Calendar</code> to set the calendar to
   * @throws IllegalArgumentException
   *             if the {@link Calendar#ERA} is {@link GregorianCalendar#BC}
   */
  public setDate(date: DateTime): void {
    if (date.year < 1) {
      throw new IllegalArgumentException(`Dates with a BC era are not supported. The year ${date.year} is invalid.`);
    }

    this.gregorianMonth = date.month;
    this.gregorianDayOfMonth = date.day;
    this.gregorianYear = date.year;
    this.gregorianAbsDate = JewishDate.gregorianDateToAbsDate(this.gregorianYear, this.gregorianMonth, this.gregorianDayOfMonth); // init the date
    this.absDateToJewishDate();

    this.dayOfWeek = Math.abs(this.gregorianAbsDate % 7) + 1; // set day of week
  }

  /**
   * Sets the date based on a {@link java.util.Date Date} object. Modifies the Jewish date as well.
   *
   * @param date
   *            the <code>Date</code> to set the calendar to
   * @throws IllegalArgumentException
   *             if the date would fall prior to the year 1 AD
   */

  /*
      public setDate(date: Date): void {
          const cal: GregorianCalendar = new GregorianCalendar();
          cal.setTime(date);
          this.setDate(cal);
      }
  */

  /**
   * Sets the Gregorian Date, and updates the Jewish date accordingly. Like the Java Calendar A value of 0 is expected
   * for January.
   *
   * @param year
   *            the Gregorian year
   * @param month
   *            the Gregorian month. Like the Java Calendar, this class expects 0 for January
   * @param dayOfMonth
   *            the Gregorian day of month. If this is &gt; the number of days in the month/year, the last valid date of
   *            the month will be set
   * @throws IllegalArgumentException
   *             if a year of &lt; 1, a month &lt; 0 or &gt; 11 or a day of month &lt; 1 is passed in
   */
  public setGregorianDate(year: number, month: number, dayOfMonth: number): void {
    JewishDate.validateGregorianDate(year, month, dayOfMonth);
    this.setInternalGregorianDate(year, month + 1, dayOfMonth);
  }

  /**
   * Sets the hidden internal representation of the Gregorian date , and updates the Jewish date accordingly. While
   * public getters and setters have 0 based months matching the Java Calendar classes, This class internally
   * represents the Gregorian month starting at 1. When this is called it will not adjust the month to match the Java
   * Calendar classes.
   *
   * @param year - the year
   * @param month - the month
   * @param dayOfMonth - the day of month
   */
  private setInternalGregorianDate(year: number, month: number, dayOfMonth: number): void {
    // make sure date is a valid date for the given month, if not, set to last day of month
    if (dayOfMonth > JewishDate.getLastDayOfGregorianMonth(month, year)) {
      dayOfMonth = JewishDate.getLastDayOfGregorianMonth(month, year);
    }
    // init month, date, year
    this.gregorianMonth = month;
    this.gregorianDayOfMonth = dayOfMonth;
    this.gregorianYear = year;

    this.gregorianAbsDate = JewishDate.gregorianDateToAbsDate(this.gregorianYear, this.gregorianMonth, this.gregorianDayOfMonth); // init date
    this.absDateToJewishDate();

    this.dayOfWeek = Math.abs(this.gregorianAbsDate % 7) + 1; // set day of week
  }

  /**
   * Sets the Jewish Date and updates the Gregorian date accordingly.
   *
   * @param year
   *            the Jewish year. The year can't be negative
   * @param month
   *            the Jewish month starting with Nisan. A value of 1 is expected for Nissan ... 12 for Adar and 13 for
   *            Adar II. Use the constants {@link #NISSAN} ... {@link #ADAR} (or {@link #ADAR_II} for a leap year Adar
   *            II) to avoid any confusion.
   * @param dayOfMonth
   *            the Jewish day of month. valid values are 1-30. If the day of month is set to 30 for a month that only
   *            has 29 days, the day will be set as 29.
   * @throws IllegalArgumentException
   *             if a A Jewish date earlier than 18 Teves, 3761 (1/1/1 Gregorian), a month &lt; 1 or &gt; 12 (or 13 on a
   *             leap year) or the day of month is &lt; 1 or &gt; 30 is passed in
   */

  /*
      public setJewishDate(year: number, month: number, dayOfMonth: number): void {
          this.setJewishDate(year, month, dayOfMonth, 0, 0, 0);
      }
  */

  /**
   * Sets the Jewish Date and updates the Gregorian date accordingly.
   *
   * @param year
   *            the Jewish year. The year can't be negative
   * @param month
   *            the Jewish month starting with Nisan. A value of 1 is expected for Nissan ... 12 for Adar and 13 for
   *            Adar II. Use the constants {@link #NISSAN} ... {@link #ADAR} (or {@link #ADAR_II} for a leap year Adar
   *            II) to avoid any confusion.
   * @param dayOfMonth
   *            the Jewish day of month. valid values are 1-30. If the day of month is set to 30 for a month that only
   *            has 29 days, the day will be set as 29.
   *
   * @param hours
   *            the hour of the day. Used for Molad calculations
   * @param minutes
   *            the minutes. Used for Molad calculations
   * @param chalakim
   *            the chalakim/parts. Used for Molad calculations. The chalakim should not exceed 17. Minutes should be
   *            used for larger numbers.
   *
   * @throws IllegalArgumentException
   *             if a A Jewish date earlier than 18 Teves, 3761 (1/1/1 Gregorian), a month &lt; 1 or &gt; 12 (or 13 on a
   *             leap year), the day of month is &lt; 1 or &gt; 30, an hour &lt; 0 or &gt; 23, a minute &lt; 0 &gt; 59 or chalakim &lt; 0 &gt;
   *             17. For larger a larger number of chalakim such as 793 (TaShTzaG) break the chalakim into minutes (18
   *             chalakim per minutes, so it would be 44 minutes and 1 chelek in the case of 793 (TaShTzaG).
   */
  public setJewishDate(year: number, month: number, dayOfMonth: number, hours: number, minutes: number, chalakim: number): void;
  public setJewishDate(year: number, month: number, dayOfMonth: number): void;
  public setJewishDate(year: number, month: number, dayOfMonth: number, hours: number = 0, minutes: number = 0, chalakim: number = 0): void {
    JewishDate.validateJewishDate(year, month, dayOfMonth, hours, minutes, chalakim);

    // if 30 is passed for a month that only has 29 days (for example by rolling the month from a month that had 30
    // days to a month that only has 29) set the date to 29th
    if (dayOfMonth > JewishDate.getDaysInJewishMonth(month, year)) {
      dayOfMonth = JewishDate.getDaysInJewishMonth(month, year);
    }

    this.jewishMonth = month;
    this.jewishDay = dayOfMonth;
    this.jewishYear = year;
    this.moladHours = hours;
    this.moladMinutes = minutes;
    this.moladChalakim = chalakim;

    this.gregorianAbsDate = JewishDate.jewishDateToAbsDate(this.jewishYear, this.jewishMonth, this.jewishDay); // reset Gregorian date
    this.absDateToDate(this.gregorianAbsDate);

    this.dayOfWeek = Math.abs(this.gregorianAbsDate % 7) + 1; // reset day of week
  }

  /**
   * Returns this object's date as a {@link java.util.Calendar} object.
   *
   * @return The {@link java.util.Calendar}
   */
  public getDate(): DateTime {
    return DateTime.fromObject({
      year: this.gregorianYear,
      month: this.gregorianMonth,
      day: this.gregorianDayOfMonth,
    });
  }

  /**
   * Resets this date to the current system date.
   */
  public resetDate(): void {
    this.setDate(DateTime.local());
  }

  /**
   * Returns a string containing the Jewish date in the form, "day Month, year" e.g. "21 Shevat, 5729". For more
   * complex formatting, use the formatter classes.
   *
   * This functionality is duplicated from {@link HebrewDateFormatter} to avoid circular dependencies.
   *
   * @return the Jewish date in the form "day Month, year" e.g. "21 Shevat, 5729"
   * @see HebrewDateFormatter#format(JewishDate)
   */
  public toString(): string {
    const transliteratedMonths: string[] = ['Nissan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul', 'Tishrei', 'Cheshvan',
      'Kislev', 'Teves', 'Shevat', 'Adar', 'Adar II', 'Adar I'];

    let formattedMonth: string;
    if (this.isJewishLeapYear() && this.jewishMonth === JewishDate.ADAR) {
      formattedMonth = transliteratedMonths[13]; // return Adar I, not Adar in a leap year
    } else {
      formattedMonth = transliteratedMonths[this.jewishMonth - 1];
    }

    return `${this.getJewishDayOfMonth()} ${formattedMonth}, ${this.getJewishYear()}`;
  }

  /**
   * Rolls the date, month or year forward by the amount passed in. It modifies both the Gregorian and Jewish dates
   * accordingly. If manipulation beyond the fields supported here is required, use the {@link Calendar} class
   * {@link Calendar#add(int, int)} or {@link Calendar#roll(int, int)} methods in the following manner.
   *
   * <pre>
   * <code>
   *     Calendar cal = jewishDate.getTime(); // get a java.util.Calendar representation of the JewishDate
   *     cal.add(Calendar.MONTH, 3); // add 3 Gregorian months
   *     jewishDate.setDate(cal); // set the updated calendar back to this class
   * </code>
   * </pre>
   *
   * @param field the calendar field to be forwarded. The must be {@link Calendar#DATE}, {@link Calendar#MONTH} or {@link Calendar#YEAR}
   * @param amount the positive amount to move forward
   * @throws IllegalArgumentException if the field is anything besides {@link Calendar#DATE}, {@link Calendar#MONTH}
   * or {@link Calendar#YEAR} or if the amount is less than 1
   *
   * @see #back()
   * @see Calendar#add(int, int)
   * @see Calendar#roll(int, int)
   */
  public forward(field: number, amount: number): void {
    if (field !== Calendar.DATE && field !== Calendar.MONTH && field !== Calendar.YEAR) {
      throw new IllegalArgumentException('Unsupported field was passed to Forward. Only Calendar.DATE, Calendar.MONTH or Calendar.YEAR are supported.');
    }
    if (amount < 1) {
      throw new IllegalArgumentException('JewishDate.forward() does not support amounts less than 1. See JewishDate.back()');
    }
    if (field === Calendar.DATE) {
      // Change Gregorian date
      for (let i = 0; i < amount; i++) {
        if (this.gregorianDayOfMonth === JewishDate.getLastDayOfGregorianMonth(this.gregorianMonth, this.gregorianYear)) {
          this.gregorianDayOfMonth = 1;

          // if last day of year
          if (this.gregorianMonth === 12) {
            this.gregorianYear++;
          } else {
            this.gregorianMonth++;
          }
        } else {
          // if not last day of month
          this.gregorianDayOfMonth++;
        }

        // Change the Jewish Date
        if (this.jewishDay === this.getDaysInJewishMonth()) {
          // if it last day of elul (i.e. last day of Jewish year)
          if (this.jewishMonth === JewishDate.ELUL) {
            this.jewishYear++;
            this.jewishMonth++;
            this.jewishDay = 1;
          } else if (this.jewishMonth === JewishDate.getLastMonthOfJewishYear(this.jewishYear)) {
            // if it is the last day of Adar, or Adar II as case may be
            this.jewishMonth = JewishDate.NISSAN;
            this.jewishDay = 1;
          } else {
            this.jewishMonth++;
            this.jewishDay = 1;
          }
        } else {
          // if not last date of month
          this.jewishDay++;
        }

        if (this.dayOfWeek === 7) {
          // if last day of week, loop back to Sunday
          this.dayOfWeek = 1;
        } else {
          this.dayOfWeek++;
        }

        // increment the absolute date
        this.gregorianAbsDate++;
      }
    } else if (field === Calendar.MONTH) {
      this.forwardJewishMonth(amount);
    } else if (field === Calendar.YEAR) {
      this.setJewishYear(this.getJewishYear() + amount);
    }
  }

  /**
   * Forward the Jewish date by the number of months passed in.
   * FIXME: Deal with forwarding a date such as 30 Nisan by a month. 30 Iyar does not exist. This should be dealt with similar to
   * the way that the Java Calendar behaves (not that simple since there is a difference between add() or roll().
   *
   * @throws IllegalArgumentException if the amount is less than 1
   * @param amount the number of months to roll the month forward
   */
  private forwardJewishMonth(amount: number): void {
    if (amount < 1) {
      throw new IllegalArgumentException('the amount of months to forward has to be greater than zero.');
    }
    for (let i = 0; i < amount; i++) {
      if (this.getJewishMonth() === JewishDate.ELUL) {
        this.setJewishMonth(JewishDate.TISHREI);
        this.setJewishYear(this.getJewishYear() + 1);
      } else if ((!this.isJewishLeapYear() && this.getJewishMonth() === JewishDate.ADAR)
        || (this.isJewishLeapYear() && this.getJewishMonth() === JewishDate.ADAR_II)) {
        this.setJewishMonth(JewishDate.NISSAN);
      } else {
        this.setJewishMonth(this.getJewishMonth() + 1);
      }
    }
  }

  /**
   * Rolls the date back by 1 day. It modifies both the Gregorian and Jewish dates accordingly. The API does not
   * currently offer the ability to forward more than one day t a time, or to forward by month or year. If such
   * manipulation is required use the {@link Calendar} class {@link Calendar#add(int, int)} or
   * {@link Calendar#roll(int, int)} methods in the following manner.
   *
   * <pre>
   * <code>
   *     Calendar cal = jewishDate.getTime(); // get a java.util.Calendar representation of the JewishDate
   *     cal.add(Calendar.MONTH, -3); // subtract 3 Gregorian months
   *     jewishDate.setDate(cal); // set the updated calendar back to this class
   * </code>
   * </pre>
   *
   * @see #back()
   * @see Calendar#add(int, int)
   * @see Calendar#roll(int, int)
   */
  public back(): void {
    // Change Gregorian date
    if (this.gregorianDayOfMonth === 1) { // if first day of month
      if (this.gregorianMonth === 1) { // if first day of year
        this.gregorianMonth = 12;
        this.gregorianYear--;
      } else {
        this.gregorianMonth--;
      }
      // change to last day of previous month
      this.gregorianDayOfMonth = JewishDate.getLastDayOfGregorianMonth(this.gregorianMonth, this.gregorianYear);
    } else {
      this.gregorianDayOfMonth--;
    }
    // change Jewish date
    if (this.jewishDay === 1) { // if first day of the Jewish month
      if (this.jewishMonth === JewishDate.NISSAN) {
        this.jewishMonth = JewishDate.getLastMonthOfJewishYear(this.jewishYear);
      } else if (this.jewishMonth === JewishDate.TISHREI) { // if Rosh Hashana
        this.jewishYear--;
        this.jewishMonth--;
      } else {
        this.jewishMonth--;
      }
      this.jewishDay = this.getDaysInJewishMonth();
    } else {
      this.jewishDay--;
    }

    if (this.dayOfWeek === 1) { // if first day of week, loop back to Saturday
      this.dayOfWeek = 7;
    } else {
      this.dayOfWeek--;
    }
    this.gregorianAbsDate--; // change the absolute date
  }

  /**
   * Indicates whether some other object is "equal to" this one.
   * @see Object#equals(Object)
   */
  public equals(object: object): boolean {
    if (this === object as JewishDate) {
      return true;
    }
    if (!(object instanceof JewishDate)) {
      return false;
    }
    const jewishDate: JewishDate = object as JewishDate;
    return this.gregorianAbsDate === jewishDate.getAbsDate();
  }

  /**
   * Compares two dates as per the compareTo() method in the Comparable interface. Returns a value less than 0 if this
   * date is "less than" (before) the date, greater than 0 if this date is "greater than" (after) the date, or 0 if
   * they are equal.
   */
  public compareTo(jewishDate: JewishDate): number {
    return IntegerUtils.compare(this.gregorianAbsDate, jewishDate.getAbsDate());
  }

  /**
   * Returns the Gregorian month (between 0-11).
   *
   * @return the Gregorian month (between 0-11). Like the java.util.Calendar, months are 0 based.
   */
  public getGregorianMonth(): number {
    return this.gregorianMonth - 1;
  }

  /**
   * Returns the Gregorian day of the month.
   *
   * @return the Gregorian day of the mont
   */
  public getGregorianDayOfMonth(): number {
    return this.gregorianDayOfMonth;
  }

  /**
   * Returns the Gregotian year.
   *
   * @return the Gregorian year
   */
  public getGregorianYear(): number {
    return this.gregorianYear;
  }

  /**
   * Returns the Jewish month 1-12 (or 13 years in a leap year). The month count starts with 1 for Nisan and goes to
   * 13 for Adar II
   *
   * @return the Jewish month from 1 to 12 (or 13 years in a leap year). The month count starts with 1 for Nisan and
   *         goes to 13 for Adar II
   */
  public getJewishMonth(): number {
    return this.jewishMonth;
  }

  /**
   * Returns the Jewish day of month.
   *
   * @return the Jewish day of the month
   */
  public getJewishDayOfMonth(): number {
    return this.jewishDay;
  }

  /**
   * Returns the Jewish year.
   *
   * @return the Jewish year
   */
  public getJewishYear(): number {
    return this.jewishYear;
  }

  /**
   * Returns the day of the week as a number between 1-7.
   *
   * @return the day of the week as a number between 1-7.
   */
  public getDayOfWeek(): number {
    return this.dayOfWeek;
  }

  /**
   * Sets the Gregorian month.
   *
   * @param month
   *            the Gregorian month
   *
   * @throws IllegalArgumentException
   *             if a month &lt; 0 or &gt; 11 is passed in
   */
  public setGregorianMonth(month: number): void {
    JewishDate.validateGregorianMonth(month);
    this.setInternalGregorianDate(this.gregorianYear, month + 1, this.gregorianDayOfMonth);
  }

  /**
   * sets the Gregorian year.
   *
   * @param year
   *            the Gregorian year.
   * @throws IllegalArgumentException
   *             if a year of &lt; 1 is passed in
   */
  public setGregorianYear(year: number): void {
    JewishDate.validateGregorianYear(year);
    this.setInternalGregorianDate(year, this.gregorianMonth, this.gregorianDayOfMonth);
  }

  /**
   * sets the Gregorian Day of month.
   *
   * @param dayOfMonth
   *            the Gregorian Day of month.
   * @throws IllegalArgumentException
   *             if the day of month of &lt; 1 is passed in
   */
  public setGregorianDayOfMonth(dayOfMonth: number): void {
    JewishDate.validateGregorianDayOfMonth(dayOfMonth);
    this.setInternalGregorianDate(this.gregorianYear, this.gregorianMonth, dayOfMonth);
  }

  /**
   * sets the Jewish month.
   *
   * @param month
   *            the Jewish month from 1 to 12 (or 13 years in a leap year). The month count starts with 1 for Nisan
   *            and goes to 13 for Adar II
   * @throws IllegalArgumentException
   *             if a month &lt; 1 or &gt; 12 (or 13 on a leap year) is passed in
   */
  public setJewishMonth(month: number): void {
    this.setJewishDate(this.jewishYear, month, this.jewishDay);
  }

  /**
   * sets the Jewish year.
   *
   * @param year
   *            the Jewish year
   * @throws IllegalArgumentException
   *             if a year of &lt; 3761 is passed in. The same will happen if the year is 3761 and the month and day
   *             previously set are &lt; 18 Teves (preior to Jan 1, 1 AD)
   */
  public setJewishYear(year: number): void {
    this.setJewishDate(year, this.jewishMonth, this.jewishDay);
  }

  /**
   * sets the Jewish day of month.
   *
   * @param dayOfMonth
   *            the Jewish day of month
   * @throws IllegalArgumentException
   *             if the day of month is &lt; 1 or &gt; 30 is passed in
   */
  public setJewishDayOfMonth(dayOfMonth: number): void {
    this.setJewishDate(this.jewishYear, this.jewishMonth, dayOfMonth);
  }

  /**
   * A method that creates a <a href="http://en.wikipedia.org/wiki/Object_copy#Deep_copy">deep copy</a> of the object.
   *
   * @see Object#clone()
   */
  public clone(): JewishDate {
    const clone: JewishDate = new JewishDate(this.jewishYear, this.jewishMonth, this.jewishDay);
    clone.setMoladHours(this.moladHours);
    clone.setMoladMinutes(this.moladMinutes);
    clone.setMoladChalakim(this.moladChalakim);

    return clone;
  }
}

import { DateTime } from 'luxon';

import { GeoLocation } from '../util/GeoLocation';
import { Daf } from './Daf';
import { JewishDate } from './JewishDate';
import { Calendar } from '../polyfills/Utils';
import { UnsupportedError } from '../polyfills/errors';

const { MONDAY, TUESDAY, THURSDAY, FRIDAY, SATURDAY } = Calendar;

/**
 * List of <em>parshiyos</em>. {@link #NONE} indicates a week without a <em>parsha</em>, while the enum for the <em>parsha</em> of
 * {@link #VZOS_HABERACHA} exists for consistency, but is not currently used.
 *
 */
export enum Parsha {
  /** NONE - A week without any <em>parsha</em> such as <em>Shabbos Chol Hamoed</em> */
  NONE,
  BERESHIS, NOACH, LECH_LECHA, VAYERA, CHAYEI_SARA, TOLDOS, VAYETZEI,
  VAYISHLACH, VAYESHEV, MIKETZ, VAYIGASH, VAYECHI, SHEMOS, VAERA, BO,
  BESHALACH, YISRO, MISHPATIM, TERUMAH, TETZAVEH, KI_SISA, VAYAKHEL,
  PEKUDEI, VAYIKRA, TZAV, SHMINI, TAZRIA, METZORA, ACHREI_MOS, KEDOSHIM,
  EMOR, BEHAR, BECHUKOSAI, BAMIDBAR, NASSO, BEHAALOSCHA, SHLACH, KORACH,
  CHUKAS, BALAK, PINCHAS, MATOS, MASEI, DEVARIM, VAESCHANAN, EIKEV,
  REEH, SHOFTIM, KI_SEITZEI, KI_SAVO, NITZAVIM, VAYEILECH, HAAZINU,
  VZOS_HABERACHA,
  /** The double parsha of Vayakhel &amp; Peudei */
  VAYAKHEL_PEKUDEI,
  /** The double <em>parsha</em> of Tazria &amp; Metzora */
  TAZRIA_METZORA,
  /** The double <em>parsha</em> of Achrei Mos &amp; Kedoshim */
  ACHREI_MOS_KEDOSHIM,
  /** The double <em>parsha</em> of Behar &amp; Bechukosai */
  BEHAR_BECHUKOSAI,
  /** The double <em>parsha</em> of Chukas &amp; Balak */
  CHUKAS_BALAK,
  /** The double <em>parsha</em> of Matos &amp; Masei */
  MATOS_MASEI,
  /** The double <em>parsha</em> of Nitzavim &amp; Vayelech */
  NITZAVIM_VAYEILECH,
  /** The special <em>parsha</em> of Shekalim */
  SHKALIM,
  /** The special <em>parsha</em> of Zachor */
  ZACHOR,
  /** The special <em>parsha</em> of Para */
  PARA,
  /** The special <em>parsha</em> of Hachodesh */
  HACHODESH,
}

/**
 * The JewishCalendar extends the JewishDate class and adds calendar methods.
 *
 * This open source Java code was originally ported by <a href="https://www.facebook.com/avromf">Avrom Finkelstien</a>
 * from his C++ code. It was refactored to fit the KosherJava Zmanim API with simplification of the code, enhancements
 * and some bug fixing. The class allows setting whether the holiday and parsha scheme follows the Israel scheme or outside Israel
 * scheme. The default is the outside Israel scheme.
 * The parsha code was ported by Y. Paritcher from his <a href="https://github.com/yparitcher/libzmanim">libzmanim</a> code.
 *
 * TODO: Some do not belong in this class, but here is a partial list of what should still be implemented in some form:
 * <ol>
 * <li>Add Isru Chag</li>
 * <li>Mishna yomis etc</li>
 * </ol>
 *
 * @see java.util.Date
 * @see java.util.Calendar
 * @author &copy; Y. Paritcher 2019
 * @author &copy; Avrom Finkelstien 2002
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 */
export class JewishCalendar extends JewishDate {
  /** The 14th day of Nisan, the day before of Pesach (Passover). */
  public static readonly EREV_PESACH: number = 0;

  /** The holiday of Pesach (Passover) on the 15th (and 16th out of Israel) day of Nisan. */
  public static readonly PESACH: number = 1;

  /** Chol Hamoed (interim days) of Pesach (Passover) */
  public static readonly CHOL_HAMOED_PESACH: number = 2;

  /** Pesach Sheni, the 14th day of Iyar, a minor holiday. */
  public static readonly PESACH_SHENI: number = 3;

  /** Erev Shavuos (the day before Shavuos), the 5th of Sivan */
  public static readonly EREV_SHAVUOS: number = 4;

  /** Shavuos (Pentecost), the 6th of Sivan */
  public static readonly SHAVUOS: number = 5;

  /** The fast of the 17th day of Tamuz */
  public static readonly SEVENTEEN_OF_TAMMUZ: number = 6;

  /** The fast of the 9th of Av */
  public static readonly TISHA_BEAV: number = 7;

  /** The 15th day of Av, a minor holiday */
  public static readonly TU_BEAV: number = 8;

  /** Erev Rosh Hashana (the day before Rosh Hashana), the 29th of Elul */
  public static readonly EREV_ROSH_HASHANA: number = 9;

  /** Rosh Hashana, the first of Tishrei. */
  public static readonly ROSH_HASHANA: number = 10;

  /** The fast of Gedalyah, the 3rd of Tishrei. */
  public static readonly FAST_OF_GEDALYAH: number = 11;

  /** The 9th day of Tishrei, the day before of Yom Kippur. */
  public static readonly EREV_YOM_KIPPUR: number = 12;

  /** The holiday of Yom Kippur, the 10th day of Tishrei */
  public static readonly YOM_KIPPUR: number = 13;

  /** The 14th day of Tishrei, the day before of Succos/Sukkos (Tabernacles). */
  public static readonly EREV_SUCCOS: number = 14;

  /** The holiday of Succos/Sukkos (Tabernacles), the 15th (and 16th out of Israel) day of Tishrei */
  public static readonly SUCCOS: number = 15;

  /** Chol Hamoed (interim days) of Succos/Sukkos (Tabernacles) */
  public static readonly CHOL_HAMOED_SUCCOS: number = 16;

  /** Hoshana Rabba, the 7th day of Succos/Sukkos that occurs on the 21st of Tishrei. */
  public static readonly HOSHANA_RABBA: number = 17;

  /** Shmini Atzeres, the 8th day of Succos/Sukkos is an independent holiday that occurs on the 22nd of Tishrei. */
  public static readonly SHEMINI_ATZERES: number = 18;

  /** Simchas Torah, the 9th day of Succos/Sukkos, or the second day of Shmini Atzeres that is celebrated
   * {@link #getInIsrael() out of Israel} on the 23rd of Tishrei.
   */
  public static readonly SIMCHAS_TORAH: number = 19;

  // public static final int EREV_CHANUKAH = 20;// probably remove this

  /** The holiday of Chanukah. 8 days starting on the 25th day Kislev. */
  public static readonly CHANUKAH: number = 21;

  /** The fast of the 10th day of Teves. */
  public static readonly TENTH_OF_TEVES: number = 22;

  /** Tu Bishvat on the 15th day of Shevat, a minor holiday. */
  public static readonly TU_BESHVAT: number = 23;

  /** The fast of Esther, usually on the 13th day of Adar (or Adar II on leap years). It is earlier on some years. */
  public static readonly FAST_OF_ESTHER: number = 24;

  /** The holiday of Purim on the 14th day of Adar (or Adar II on leap years). */
  public static readonly PURIM: number = 25;

  /** The holiday of Shushan Purim on the 15th day of Adar (or Adar II on leap years). */
  public static readonly SHUSHAN_PURIM: number = 26;

  /** The holiday of Purim Katan on the 14th day of Adar I on a leap year when Purim is on Adar II, a minor holiday. */
  public static readonly PURIM_KATAN: number = 27;

  /**
   * Rosh Chodesh, the new moon on the first day of the Jewish month, and the 30th day of the previous month in the
   * case of a month with 30 days.
   */
  public static readonly ROSH_CHODESH: number = 28;

  /** Yom HaShoah, Holocaust Remembrance Day, usually held on the 27th of Nisan. If it falls on a Friday, it is moved
   * to the 26th, and if it falls on a Sunday it is moved to the 28th. A {@link #isUseModernHolidays() modern holiday}.
   */
  public static readonly YOM_HASHOAH: number = 29;

  /**
   * Yom HaZikaron, Israeli Memorial Day, held a day before Yom Ha'atzmaut.  A {@link #isUseModernHolidays() modern holiday}.
   */
  public static readonly YOM_HAZIKARON: number = 30;

  /** Yom Ha'atzmaut, Israel Independence Day, the 5th of Iyar, but if it occurs on a Friday or Saturday, the holiday is
   * moved back to Thursday, the 3rd of 4th of Iyar, and if it falls on a Monday, it is moved forward to Tuesday the
   * 6th of Iyar.  A {@link #isUseModernHolidays() modern holiday}. */
  public static readonly YOM_HAATZMAUT: number = 31;

  /**
   * Yom Yerushalayim or Jerusalem Day, on 28 Iyar. A {@link #isUseModernHolidays() modern holiday}.
   */
  public static readonly YOM_YERUSHALAYIM: number = 32;

  /** The 33rd day of the Omer, the 18th of Iyar, a minor holiday. */
  public static readonly LAG_BAOMER: number = 33;

  /** The holiday of Purim Katan on the 15th day of Adar I on a leap year when Purim is on Adar II, a minor holiday. */
  public static readonly SHUSHAN_PURIM_KATAN: number = 34;

  /**
   * Is the calendar set to Israel, where some holidays have different rules.
   * @see #getInIsrael()
   * @see #setInIsrael(boolean)
   */
  private inIsrael: boolean = false;

  /**
   * Is the calendar set to use modern Israeli holidays such as Yom Haatzmaut.
   * @see #isUseModernHolidays()
   * @see #setUseModernHolidays(boolean)
   */
  private useModernHolidays: boolean = false;

  /**
   * An array of <em>parshiyos</em> in the 17 possible combinations.
   */
  public static readonly parshalist: Parsha[][] = [
    [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
    [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NONE, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS_BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
    [Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
    [Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
    [Parsha.NONE, Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
    [Parsha.NONE, Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
    [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NONE, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS_BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
    [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
    [Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.ACHREI_MOS, Parsha.NONE, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS, Parsha.MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
    [Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.ACHREI_MOS, Parsha.NONE, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS, Parsha.MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
    [Parsha.NONE, Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
    [Parsha.NONE, Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NONE, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS_BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
    [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
    [Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
    [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
    [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS, Parsha.MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
    [Parsha.NONE, Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
  ];

  /**
   * Is this calendar set to return modern Israeli national holidays. By default this value is false. The holidays
   * are: <em>Yom HaShoah</em>, <em>Yom Hazikaron</em>, <em>Yom Ha'atzmaut</em> and <em>Yom Yerushalayim</em>.
   *
   * @return the useModernHolidays true if set to return modern Israeli national holidays
   *
   * @see #setUseModernHolidays(boolean)
   */
  public isUseModernHolidays(): boolean {
    return this.useModernHolidays;
  }

  /**
   * Sets the calendar to return modern Israeli national holidays. By default this value is false. The holidays are:
   * <em>Yom HaShoah</em>, <em>Yom Hazikaron</em>, <em>Yom Ha'atzmaut</em> and <em>Yom Yerushalayim</em>.
   *
   * @param useModernHolidays
   *            the useModernHolidays to set
   *
   * @see #isUseModernHolidays()
   */
  public setUseModernHolidays(useModernHolidays: boolean): void {
    this.useModernHolidays = useModernHolidays;
  }

  /**
   * Default constructor will set a default date to the current system date.
   */
  /*
      public JewishCalendar() {
          super();
      }
  */

  /**
   * A constructor that initializes the date to the {@link java.util.Date Date} parameter.
   *
   * @param date
   *            the <code>Date</code> to set the calendar to
   */
  /*
      public JewishCalendar(date: Date) {
          super(date);
      }
  */

  /**
   * A constructor that initializes the date to the {@link java.util.Calendar Calendar} parameter.
   *
   * @param calendar
   *            the <code>Calendar</code> to set the calendar to
   */
  /*
      public JewishCalendar(calendar: GregorianCalendar) {
          super(calendar);
      }
  */

  /**
   * Creates a Jewish date based on a Jewish year, month and day of month.
   *
   * @param jewishYear
   *            the Jewish year
   * @param jewishMonth
   *            the Jewish month. The method expects a 1 for <em>Nissan</em> ... 12 for <em>Adar</em> and 13 for
   *            <em>Adar II</em>. Use the constants {@link #NISSAN} ... {@link #ADAR} (or {@link #ADAR_II} for a
   *            leap year Adar II) to avoid any confusion.
   * @param jewishDayOfMonth
   *            the Jewish day of month. If 30 is passed in for a month with only 29 days (for example {@link #IYAR},
   *            or {@link #KISLEV} in a year that {@link #isKislevShort()}), the 29th (last valid date of the month)
   *            will be set.
   * @param inIsrael
   *            whether in Israel. This affects <em>Yom Tov</em> calculations
   */
  /*
      public JewishCalendar(jewishYear: number, jewishMonth: number, jewishDayOfMonth: number, inIsrael: boolean) {
          super(jewishYear, jewishMonth, jewishDayOfMonth, inIsrael);
          setInIsrael(inIsrael);
      }
  */

  /**
   * Creates a Jewish date based on a Jewish date and whether in Israel
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
   * @param inIsrael
   *            whether in Israel. This affects Yom Tov calculations
   */
  constructor(jewishYear: number, jewishMonth: number, jewishDayOfMonth: number, inIsrael?: boolean)
  constructor(date: Date)
  constructor(date: DateTime)
  constructor()
  constructor(jewishYearOrDateTimeOrDate?: number | Date | DateTime, jewishMonth?: number, jewishDayOfMonth?: number, inIsrael?: boolean) {
    // @ts-ignore
    super(jewishYearOrDateTimeOrDate, jewishMonth, jewishDayOfMonth);
    if (inIsrael) this.setInIsrael(inIsrael);
  }

  /**
   * Sets whether to use Israel holiday scheme or not. Default is false.
   *
   * @param inIsrael
   *            set to true for calculations for Israel
   *
   * @see #getInIsrael()
   */
  public setInIsrael(inIsrael: boolean): void {
    this.inIsrael = inIsrael;
  }

  /**
   * Gets whether Israel holiday scheme is used or not. The default (if not set) is false.
   *
   * @return if the if the calendar is set to Israel
   *
   * @see #setInIsrael(boolean)
   */
  public getInIsrael(): boolean {
    return this.inIsrael;
  }

  /**
   * <a href="https://en.wikipedia.org/wiki/Birkat_Hachama">Birkas Hachamah</a> is recited every 28 years based on
   * Tekufas Shmulel (Julian years) that a year is 365.25 days. The <a href="https://en.wikipedia.org/wiki/Maimonides">Rambam</a>
   * in <a href="https://hebrewbooks.org/pdfpager.aspx?req=14278&amp;st=&amp;pgnum=323">Hilchos Kiddush Hachodesh 9:3</a> states that
   * tekufas Nisan of year 1 was 7 days + 9 hours before molad Nisan. This is calculated as every 10,227 days (28 * 365.25).
   * @return true for a day that Birkas Hachamah is recited.
   */
  public isBirkasHachamah(): boolean {
    // elapsed days since molad ToHu
    let elapsedDays: number = JewishCalendar.getJewishCalendarElapsedDays(this.getJewishYear());
    // elapsed days to the current calendar date
    elapsedDays += this.getDaysSinceStartOfJewishYear();

    /* Molad Nisan year 1 was 177 days after molad tohu of Tishrei. We multiply 29.5 day months * 6 months from Tishrei
     * to Nisan = 177. Subtract 7 days since tekufas Nisan was 7 days and 9 hours before the molad as stated in the Rambam
     * and we are now at 170 days. Because getJewishCalendarElapsedDays and getDaysSinceStartOfJewishYear use the value for
     * Rosh Hashana as 1, we have to add 1 day days for a total of 171. To this add a day since the tekufah is on a Tuesday
     * night and we push off the bracha to Wednesday AM resulting in the 172 used in the calculation.
     */
    // 28 years of 365.25 days + the offset from molad tohu mentioned above
    return elapsedDays % (28 * 365.25) === 172;
  }

  /**
   * Return the type of year for parsha calculations. The algorithm follows the
   * <a href="https://hebrewbooks.org/pdfpager.aspx?req=14268&amp;st=&amp;pgnum=222">Luach Arba'ah Shearim</a> in the Tur Ohr Hachaim.
   * @return the type of year for parsha calculations.
   * @todo Use constants in this class.
   */
  private getParshaYearType(): number {
    // plus one to the original Rosh Hashana of year 1 to get a week starting on Sunday
    let roshHashanaDayOfWeek: number = (JewishCalendar.getJewishCalendarElapsedDays(this.getJewishYear()) + 1) % 7;
    if (roshHashanaDayOfWeek === 0) {
      // convert 0 to 7 for Shabbos for readability
      roshHashanaDayOfWeek = SATURDAY;
    }

    if (this.isJewishLeapYear()) {
      // eslint-disable-next-line default-case
      switch (roshHashanaDayOfWeek) {
        case MONDAY:
          // BaCh
          if (this.isKislevShort()) {
            if (this.getInIsrael()) {
              return 14;
            }
            return 6;
          }

          // BaSh
          if (this.isCheshvanLong()) {
            if (this.getInIsrael()) {
              return 15;
            }
            return 7;
          }
          break;
        // GaK
        case TUESDAY:
          if (this.getInIsrael()) {
            return 15;
          }
          return 7;
        case THURSDAY:
          // HaCh
          if (this.isKislevShort()) {
            return 8;
          }

          // HaSh
          if (this.isCheshvanLong()) {
            return 9;
          }

          break;
        case SATURDAY:
          // ZaCh
          if (this.isKislevShort()) {
            return 10;
          }

          // ZaSh
          if (this.isCheshvanLong()) {
            if (this.getInIsrael()) {
              return 16;
            }
            return 11;
          }

          break;
      }
    } else {
      // not a leap year
      // eslint-disable-next-line default-case
      switch (roshHashanaDayOfWeek) {
        case MONDAY:
          // BaCh
          if (this.isKislevShort()) {
            return 0;
          }

          // BaSh
          if (this.isCheshvanLong()) {
            if (this.getInIsrael()) {
              return 12;
            }
            return 1;
          }

          break;
        case TUESDAY:
          // GaK
          if (this.getInIsrael()) {
            return 12;
          }
          return 1;
        case THURSDAY:
          // HaSh
          if (this.isCheshvanLong()) {
            return 3;
          }

          // HaK
          if (!this.isKislevShort()) {
            if (this.getInIsrael()) {
              return 13;
            }
            return 2;
          }

          break;
        case SATURDAY:
          // ZaCh
          if (this.isKislevShort()) {
            return 4;
          }

          // ZaSh
          if (this.isCheshvanLong()) {
            return 5;
          }

          break;
      }
    }

    // keep the compiler happy
    return -1;
  }

  /**
   * Returns this week's {@link Parsha} if it is <em>Shabbos</em>.
   * returns Parsha.NONE if a weekday or if there is no <em>parsha</em> that week (for example <em>Yomtov</em> is on <em>Shabbos</em>).
   *
   * @return the current <em>parsha</em>.
   */
  public getParsha(): Parsha {
    if (this.getDayOfWeek() !== SATURDAY) {
      return Parsha.NONE;
    }

    const yearType: number = this.getParshaYearType();
    const roshHashanaDayOfWeek: number = JewishCalendar.getJewishCalendarElapsedDays(this.getJewishYear()) % 7;
    const day: number = roshHashanaDayOfWeek + this.getDaysSinceStartOfJewishYear();

    // negative year should be impossible, but lets cover all bases
    if (yearType >= 0) {
      return JewishCalendar.parshalist[yearType][day / 7];
    }

    // keep the compiler happy
    return Parsha.NONE;
  }

  /**
   * Returns a <em>parsha</em> enum if the <em>Shabbos</em> is one of the four <em>parshiyos</em> of Parsha.SHKALIM, Parsha.ZACHOR,
   * Parsha.PARA, Parsha.HACHODESH or Parsha.NONE for a regular <em>Shabbos</em> (or any weekday).
   *
   * @return one of the four <em>parshiyos</em> of Parsha.SHKALIM, Parsha.ZACHOR, Parsha.PARA, Parsha.HACHODESH or Parsha.NONE.
   */
  public getSpecialShabbos(): Parsha {
    if (this.getDayOfWeek() === SATURDAY) {
      if (((this.getJewishMonth() === JewishCalendar.SHEVAT && !this.isJewishLeapYear())
        || (this.getJewishMonth() === JewishCalendar.ADAR && this.isJewishLeapYear()))
        && [25, 27, 29].includes(this.getJewishDayOfMonth())) {
        return Parsha.SHKALIM;
      }

      if ((this.getJewishMonth() === JewishCalendar.ADAR && !this.isJewishLeapYear())
        || this.getJewishMonth() === JewishCalendar.ADAR_II) {
        if (this.getJewishDayOfMonth() === 1) {
          return Parsha.SHKALIM;
        }

        if ([8, 9, 11, 13].includes(this.getJewishDayOfMonth())) {
          return Parsha.ZACHOR;
        }

        if ([18, 20, 22, 23].includes(this.getJewishDayOfMonth())) {
          return Parsha.PARA;
        }

        if ([25, 27, 29].includes(this.getJewishDayOfMonth())) {
          return Parsha.HACHODESH;
        }
      }

      if (this.getJewishMonth() === JewishCalendar.NISSAN && this.getJewishDayOfMonth() === 1) {
        return Parsha.HACHODESH;
      }
    }
    return Parsha.NONE;
  }

  /**
   * Returns an index of the Jewish holiday or fast day for the current day, or a -1 if there is no holiday for this day.
   * There are constants in this class representing each <em>Yom Tov</em>. Formatting of the <em>Yomim tovim</em> is done
   * in the {@link HebrewDateFormatter#formatYomTov(JewishCalendar)}.
   *
   * @todo Consider using enums instead of the constant ints.
   *
   * @return the index of the holiday such as the constant {@link #LAG_BAOMER} or {@link #YOM_KIPPUR} or a -1 if it is not a holiday.
   *
   * @see HebrewDateFormatter#formatYomTov(JewishCalendar)
   */
  public getYomTovIndex(): number {
    const day: number = this.getJewishDayOfMonth();
    const dayOfWeek: number = this.getDayOfWeek();

    // check by month (starting from Nissan)
    // eslint-disable-next-line default-case
    switch (this.getJewishMonth()) {
      case JewishCalendar.NISSAN:
        if (day === 14) {
          return JewishCalendar.EREV_PESACH;
        } else if (day === 15 || day === 21 || (!this.inIsrael && (day === 16 || day === 22))) {
          return JewishCalendar.PESACH;
        } else if ((day >= 17 && day <= 20) || (day === 16 && this.inIsrael)) {
          return JewishCalendar.CHOL_HAMOED_PESACH;
        }

        if (this.isUseModernHolidays()
          && ((day === 26 && dayOfWeek === Calendar.THURSDAY) || (day === 28 && dayOfWeek === Calendar.MONDAY)
            || (day === 27 && dayOfWeek !== Calendar.SUNDAY && dayOfWeek !== Calendar.FRIDAY))) {
          return JewishCalendar.YOM_HASHOAH;
        }
        break;
      case JewishCalendar.IYAR:
        if (this.isUseModernHolidays()
          && ((day === 4 && dayOfWeek === Calendar.TUESDAY) || ((day === 3 || day === 2) && dayOfWeek === Calendar.WEDNESDAY)
            || (day === 5 && dayOfWeek === Calendar.MONDAY))) {
          return JewishCalendar.YOM_HAZIKARON;
        }

        // if 5 Iyar falls on Wed Yom Haatzmaut is that day. If it fal1s on Friday or Shabbos it is moved back to
        // Thursday. If it falls on Monday it is moved to Tuesday
        if (this.isUseModernHolidays() && ((day === 5 && dayOfWeek === Calendar.WEDNESDAY)
          || ((day === 4 || day === 3) && dayOfWeek === Calendar.THURSDAY) || (day === 6 && dayOfWeek === Calendar.TUESDAY))) {
          return JewishCalendar.YOM_HAATZMAUT;
        }

        if (day === 14) {
          return JewishCalendar.PESACH_SHENI;
        }

        if (day === 18) {
          return JewishCalendar.LAG_BAOMER;
        }

        if (this.isUseModernHolidays() && day === 28) {
          return JewishCalendar.YOM_YERUSHALAYIM;
        }
        break;
      case JewishCalendar.SIVAN:
        if (day === 5) {
          return JewishCalendar.EREV_SHAVUOS;
        } else if (day === 6 || (day === 7 && !this.inIsrael)) {
          return JewishCalendar.SHAVUOS;
        }
        break;
      case JewishCalendar.TAMMUZ:
        // push off the fast day if it falls on Shabbos
        if ((day === 17 && dayOfWeek !== Calendar.SATURDAY) || (day === 18 && dayOfWeek === Calendar.SUNDAY)) {
          return JewishCalendar.SEVENTEEN_OF_TAMMUZ;
        }
        break;
      case JewishCalendar.AV:
        // if Tisha B'av falls on Shabbos, push off until Sunday
        if ((dayOfWeek === Calendar.SUNDAY && day === 10) || (dayOfWeek !== Calendar.SATURDAY && day === 9)) {
          return JewishCalendar.TISHA_BEAV;
        } else if (day === 15) {
          return JewishCalendar.TU_BEAV;
        }
        break;
      case JewishCalendar.ELUL:
        if (day === 29) {
          return JewishCalendar.EREV_ROSH_HASHANA;
        }
        break;
      case JewishCalendar.TISHREI:
        if (day === 1 || day === 2) {
          return JewishCalendar.ROSH_HASHANA;
        } else if ((day === 3 && dayOfWeek !== Calendar.SATURDAY) || (day === 4 && dayOfWeek === Calendar.SUNDAY)) {
          // push off Tzom Gedalia if it falls on Shabbos
          return JewishCalendar.FAST_OF_GEDALYAH;
        } else if (day === 9) {
          return JewishCalendar.EREV_YOM_KIPPUR;
        } else if (day === 10) {
          return JewishCalendar.YOM_KIPPUR;
        } else if (day === 14) {
          return JewishCalendar.EREV_SUCCOS;
        }

        if (day === 15 || (day === 16 && !this.inIsrael)) {
          return JewishCalendar.SUCCOS;
        }

        if ((day >= 17 && day <= 20) || (day === 16 && this.inIsrael)) {
          return JewishCalendar.CHOL_HAMOED_SUCCOS;
        }

        if (day === 21) {
          return JewishCalendar.HOSHANA_RABBA;
        }

        if (day === 22) {
          return JewishCalendar.SHEMINI_ATZERES;
        }

        if (day === 23 && !this.inIsrael) {
          return JewishCalendar.SIMCHAS_TORAH;
        }
        break;
      case JewishCalendar.KISLEV: // no yomtov in CHESHVAN
        // if (day == 24) {
        // return EREV_CHANUKAH;
        // } else
        if (day >= 25) {
          return JewishCalendar.CHANUKAH;
        }
        break;
      case JewishCalendar.TEVES:
        if (day === 1 || day === 2 || (day === 3 && this.isKislevShort())) {
          return JewishCalendar.CHANUKAH;
        } else if (day === 10) {
          return JewishCalendar.TENTH_OF_TEVES;
        }
        break;
      case JewishCalendar.SHEVAT:
        if (day === 15) {
          return JewishCalendar.TU_BESHVAT;
        }
        break;
      case JewishCalendar.ADAR:
        if (!this.isJewishLeapYear()) {
          // if 13th Adar falls on Friday or Shabbos, push back to Thursday
          if (((day === 11 || day === 12) && dayOfWeek === Calendar.THURSDAY)
              || (day === 13 && !(dayOfWeek === Calendar.FRIDAY || dayOfWeek === Calendar.SATURDAY))) {
            return JewishCalendar.FAST_OF_ESTHER;
          }

          if (day === 14) {
            return JewishCalendar.PURIM;
          } else if (day === 15) {
            return JewishCalendar.SHUSHAN_PURIM;
          }
        } else {
          // else if a leap year
          if (day === 14) {
            return JewishCalendar.PURIM_KATAN;
          }

          if (day === 15) {
            return JewishCalendar.SHUSHAN_PURIM_KATAN;
          }
        }
        break;
      case JewishCalendar.ADAR_II:
        // if 13th Adar falls on Friday or Shabbos, push back to Thursday
        if (((day === 11 || day === 12) && dayOfWeek === Calendar.THURSDAY)
            || (day === 13 && !(dayOfWeek === Calendar.FRIDAY || dayOfWeek === Calendar.SATURDAY))) {
          return JewishCalendar.FAST_OF_ESTHER;
        }

        if (day === 14) {
          return JewishCalendar.PURIM;
        } else if (day === 15) {
          return JewishCalendar.SHUSHAN_PURIM;
        }
        break;
    }
    // if we get to this stage, then there are no holidays for the given date return -1
    return -1;
  }

  /**
   * Returns true if the current day is <em>Yom Tov</em>. The method returns true even for holidays such as {@link #CHANUKAH}
   * and minor ones such as {@link #TU_BEAV} and {@link #PESACH_SHENI}. <em>Erev Yom Tov</em> (with the exception of
   * {@link #HOSHANA_RABBA}, <em>erev</em> the second days of <em>Pesach</em>) returns false, as do {@link #isTaanis() fast
   * days} besides {@link #YOM_KIPPUR}. Use {@link #isAssurBemelacha()} to find the days that have a prohibition of work.
   *
   * @return true if the current day is a Yom Tov
   *
   * @see #getYomTovIndex()
   * @see #isErevYomTov()
   * @see #isErevYomTovSheni()
   * @see #isTaanis()
   * @see #isAssurBemelacha()
   * @see #isCholHamoed()
   */
  public isYomTov(): boolean {
    const holidayIndex: number = this.getYomTovIndex();

    if ((this.isErevYomTov() && (holidayIndex !== JewishCalendar.HOSHANA_RABBA
      && (holidayIndex === JewishCalendar.CHOL_HAMOED_PESACH && this.getJewishDayOfMonth() !== 20)))
      || (this.isTaanis() && holidayIndex !== JewishCalendar.YOM_KIPPUR)) {
      return false;
    }

    return this.getYomTovIndex() !== -1;
  }

  /**
   * Returns true if the <em>Yom Tov</em> day has a <em>melacha</em> (work) prohibition. This method will return false for a
   * non-<em>Yom Tov</em> day, even if it is <em>Shabbos</em>.
   *
   * @return if the <em>Yom Tov</em> day has a <em>melacha</em> (work) prohibition.
   */
  public isYomTovAssurBemelacha(): boolean {
    const yamimTovimAssurBemelacha = [
      JewishCalendar.PESACH,
      JewishCalendar.SHAVUOS,
      JewishCalendar.SUCCOS,
      JewishCalendar.SHEMINI_ATZERES,
      JewishCalendar.SIMCHAS_TORAH,
      JewishCalendar.ROSH_HASHANA,
      JewishCalendar.YOM_KIPPUR,
    ];
    const holidayIndex: number = this.getYomTovIndex();
    return yamimTovimAssurBemelacha.includes(holidayIndex);
  }

  /**
   * Returns true if it is <em>Shabbos</em> or if it is a <em>Yom Tov</em> day that has a <em>melacha</em> (work)  prohibition.
   *
   * @return if the day is a <em>Yom Tov</em> that is <em>assur bemlacha</em> or <em>Shabbos</em>
   */
  public isAssurBemelacha(): boolean {
    return this.getDayOfWeek() === SATURDAY || this.isYomTovAssurBemelacha();
  }

  /**
   * Returns true if the day has candle lighting. This will return true on erev <em>Shabbos</em>, erev <em>Yom Tov</em>, the
   * first day of <em>Rosh Hashana</em> and the first days of <em>Yom Tov</em> out of Israel. It is identical
   * to calling {@link #isTomorrowShabbosOrYomTov()}.
   *
   * @return if the day has candle lighting.
   *
   * @see #isTomorrowShabbosOrYomTov()
   */
  public hasCandleLighting(): boolean {
    return this.isTomorrowShabbosOrYomTov();
  }

  /**
   * Returns true if tomorrow is <em>Shabbos</em> or <em>Yom Tov</em>. This will return true on erev <em>Shabbos</em>,
   * <em>erev Yom Tov</em>, the first day of <em>Rosh Hashana</em> and <em>erev</em> the first days of <em>Yom Tov</em>
   * out of Israel. It is identical to calling {@link #hasCandleLighting()}.
   *
   * @return will return if the next day is <em>Shabbos</em> or <em>Yom Tov</em>.
   *
   * @see #hasCandleLighting()
   */
  public isTomorrowShabbosOrYomTov(): boolean {
    return this.getDayOfWeek() === FRIDAY || this.isErevYomTov() || this.isErevYomTovSheni();
  }

  /**
   * Returns true if the day is the second day of <em>Yom Tov</em>. This impacts the second day of <em>Rosh Hashana</em>
   * everywhere, and the second days of Yom Tov in <em>chutz laaretz</em> (out of Israel).
   *
   * @return  if the day is the second day of <em>Yom Tov</em>.
   */
  public isErevYomTovSheni(): boolean {
    return (this.getJewishMonth() === JewishCalendar.TISHREI && (this.getJewishDayOfMonth() === 1))
      || (!this.getInIsrael()
        && ((this.getJewishMonth() === JewishCalendar.NISSAN && [15, 21].includes(this.getJewishDayOfMonth()))
          || (this.getJewishMonth() === JewishCalendar.TISHREI && [15, 22].includes(this.getJewishDayOfMonth()))
          || (this.getJewishMonth() === JewishCalendar.SIVAN && this.getJewishDayOfMonth() === 6)));
  }

  /**
   * Returns true if the current day is <em>Aseret Yemei Teshuva</em>.
   *
   * @return if the current day is <em>Aseret Yemei Teshuvah</em>
   */
  public isAseresYemeiTeshuva(): boolean {
    return this.getJewishMonth() === JewishCalendar.TISHREI && this.getJewishDayOfMonth() <= 10;
  }

  /**
   * Returns true if the current day is <em>Chol Hamoed</em> of <em>Pesach</em> or <em>Succos</em>.
   *
   * @return true if the current day is <em>Chol Hamoed</em> of <em>Pesach</em> or <em>Succos</em>
   * @see #isYomTov()
   * @see #CHOL_HAMOED_PESACH
   * @see #CHOL_HAMOED_SUCCOS
   */
  public isCholHamoed(): boolean {
    return this.isCholHamoedPesach() || this.isCholHamoedSuccos();
  }

  /**
   * Returns true if the current day is <em>Chol Hamoed</em> of <em>Pesach</em>.
   *
   * @return true if the current day is <em>Chol Hamoed</em> of <em>Pesach</em>
   * @see #isYomTov()
   * @see #CHOL_HAMOED_PESACH
   */
  public isCholHamoedPesach(): boolean {
    const holidayIndex: number = this.getYomTovIndex();
    return holidayIndex === JewishCalendar.CHOL_HAMOED_PESACH;
  }

  /**
   * Returns true if the current day is <em>Chol Hamoed</em> of <em>Succos</em>.
   *
   * @return true if the current day is <em>Chol Hamoed</em> of <em>Succos</em>
   * @see #isYomTov()
   * @see #CHOL_HAMOED_SUCCOS
   */
  public isCholHamoedSuccos(): boolean {
    const holidayIndex: number = this.getYomTovIndex();
    return holidayIndex === JewishCalendar.CHOL_HAMOED_SUCCOS;
  }

  /**
   * Returns true if the current day is erev Yom Tov. The method returns true for <em>Erev</em> - <em>Pesach</em> (first and
   * last days), <em>Shavuos</em>, <em>Rosh Hashana</em>, <em>Yom Kippur</em>, <em>Succos</em> and <em>Hoshana Rabba</em>.
   *
   * @return true if the current day is <em>Erev</em> - <em>Pesach</em>, <em>Shavuos</em>, <em>Rosh Hashana</em>, <em>Yom
   * Kippur</em>, <em>Succos</em> and <em>Hoshana Rabba</em>.
   * @see #isYomTov()
   * @see #isErevYomTovSheni()
   */
  public isErevYomTov(): boolean {
    const erevYomTov = [
      JewishCalendar.EREV_PESACH,
      JewishCalendar.EREV_SHAVUOS,
      JewishCalendar.EREV_ROSH_HASHANA,
      JewishCalendar.EREV_YOM_KIPPUR,
      JewishCalendar.EREV_SUCCOS,
      JewishCalendar.HOSHANA_RABBA,
    ];
    const holidayIndex: number = this.getYomTovIndex();
    return erevYomTov.includes(holidayIndex)
      || (holidayIndex === JewishCalendar.CHOL_HAMOED_PESACH && this.getJewishDayOfMonth() === 20);
  }

  /**
   * Returns true if the current day is Erev Rosh Chodesh. Returns false for Erev Rosh Hashana
   *
   * @return true if the current day is Erev Rosh Chodesh. Returns false for Erev Rosh Hashana
   * @see #isRoshChodesh()
   */
  public isErevRoshChodesh(): boolean {
    // Erev Rosh Hashana is not Erev Rosh Chodesh.
    return (this.getJewishDayOfMonth() === 29 && this.getJewishMonth() !== JewishCalendar.ELUL);
  }

  /**
   * Return true if the day is a Taanis (fast day). Return true for <em>17 of Tammuz</em>, <em>Tisha B'Av</em>,
   * <em>Yom Kippur</em>, <em>Fast of Gedalyah</em>, <em>10 of Teves</em> and the <em>Fast of Esther</em>.
   *
   * @return true if today is a fast day
   */
  public isTaanis(): boolean {
    const taaniyos = [
      JewishCalendar.SEVENTEEN_OF_TAMMUZ,
      JewishCalendar.TISHA_BEAV,
      JewishCalendar.YOM_KIPPUR,
      JewishCalendar.FAST_OF_GEDALYAH,
      JewishCalendar.TENTH_OF_TEVES,
      JewishCalendar.FAST_OF_ESTHER,
    ];
    const holidayIndex: number = this.getYomTovIndex();
    return taaniyos.includes(holidayIndex);
  }

  /**
   * Return true if the day is <em>Taanis Bechoros</em> (on <em>erev Pesach</em>). It will return true for the 14th
   * of <em>Nissan</em> if it is not on <em>Shabbos</em>, or if the 12th of <em>Nissan</em> occurs on a Thursday.
   *
   * @return true if today is <em>Taanis Bechoros</em>.
   */
  public isTaanisBechoros(): boolean {
    const day: number = this.getJewishDayOfMonth();
    const dayOfWeek: number = this.getDayOfWeek();
    // on 14 Nisan unless that is Shabbos where the fast is moved back to Thursday
    return this.getJewishMonth() === JewishCalendar.NISSAN && ((day === 14 && dayOfWeek !== Calendar.SATURDAY)
        || (day === 12 && dayOfWeek === Calendar.THURSDAY));
  }

  /**
   * Returns the day of <em>Chanukah</em> or -1 if it is not <em>Chanukah</em>.
   *
   * @return the day of <em>Chanukah</em> or -1 if it is not <em>Chanukah</em>.
   * @see #isChanukah()
   */
  public getDayOfChanukah(): number {
    const day: number = this.getJewishDayOfMonth();

    if (this.isChanukah()) {
      if (this.getJewishMonth() === JewishCalendar.KISLEV) {
        return day - 24;
      }
      // teves
      return this.isKislevShort() ? day + 5 : day + 6;
    }
    return -1;
  }

  /**
   * Returns true if the current day is one of the 8 days of <em>Chanukah</em>.
   *
   * @return if the current day is one of the 8 days of <em>Chanukah</em>.
   *
   * @see #getDayOfChanukah()
   */
  public isChanukah(): boolean {
    return this.getYomTovIndex() === JewishCalendar.CHANUKAH;
  }

  /**
   * Returns if the day is Rosh Chodesh. Rosh Hashana will return false
   *
   * @return true if it is Rosh Chodesh. Rosh Hashana will return false
   */
  public isRoshChodesh(): boolean {
    // Rosh Hashana is not rosh chodesh. Elul never has 30 days
    return (this.getJewishDayOfMonth() === 1 && this.getJewishMonth() !== JewishCalendar.TISHREI) || this.getJewishDayOfMonth() === 30;
  }

  /**
   * Returns if the day is <em>Shabbos</em> and Sunday is <em>Rosh Chodesh</em>.
   *
   * @return true if it is <em>Shabbos</em> and Sunday is <em>Rosh Chodesh</em>.
   * @todo There is more to tweak in this method (it does not cover all cases and opinions), and it may be removed.
   */
  public isMacharChodesh(): boolean {
    return (this.getDayOfWeek() === SATURDAY && (this.getJewishDayOfMonth() === 30 || this.getJewishDayOfMonth() === 29));
  }

  /**
   * Returns if the day is <em>Shabbos Mevorchim</em>.
   *
   * @return true if it is <em>Shabbos Mevorchim</em>.
   */
  public isShabbosMevorchim(): boolean {
    return this.getDayOfWeek() === SATURDAY
      && this.getJewishDayOfMonth() >= 23
      && this.getJewishDayOfMonth() <= 29
      && this.getJewishMonth() !== JewishCalendar.ELUL;
  }

  /**
   * Returns the int value of the <em>Omer</em> day or -1 if the day is not in the <em>Omer</em>.
   *
   * @return The <em>Omer</em> count as an int or -1 if it is not a day of the <em>Omer</em>.
   */
  public getDayOfOmer(): number {
    let omer: number = -1; // not a day of the Omer
    const month: number = this.getJewishMonth();
    const day: number = this.getJewishDayOfMonth();

    // if Nissan and second day of Pesach and on
    if (month === JewishCalendar.NISSAN && day >= 16) {
      omer = day - 15;
      // if Iyar
    } else if (month === JewishCalendar.IYAR) {
      omer = day + 15;
      // if Sivan and before Shavuos
    } else if (month === JewishCalendar.SIVAN && day < 6) {
      omer = day + 44;
    }
    return omer;
  }

  /**
   * Returns the molad in Standard Time in Yerushalayim as a Date. The traditional calculation uses local time. This
   * method subtracts 20.94 minutes (20 minutes and 56.496 seconds) from the local time (Har Habayis with a longitude
   * of 35.2354&deg; is 5.2354&deg; away from the %15 timezone longitude) to get to standard time. This method
   * intentionally uses standard time and not dailight savings time. Java will implicitly format the time to the
   * default (or set) Timezone.
   *
   * @return the Date representing the moment of the molad in Yerushalayim standard time (GMT + 2)
   */
  public getMoladAsDate(): DateTime {
    const molad: JewishDate = this.getMolad();
    const locationName: string = 'Jerusalem, Israel';

    const latitude: number = 31.778; // Har Habayis latitude
    const longitude: number = 35.2354; // Har Habayis longitude

    // The raw molad Date (point in time) must be generated using standard time. Using "Asia/Jerusalem" timezone will result in the time
    // being incorrectly off by an hour in the summer due to DST. Proper adjustment for the actual time in DST will be done by the date
    // formatter class used to display the Date.
    const yerushalayimStandardTZ: string = 'Etc/GMT+2';
    const geo: GeoLocation = new GeoLocation(locationName, latitude, longitude, yerushalayimStandardTZ);

    const moladSeconds: number = (molad.getMoladChalakim() * 10) / 3;
    // subtract local time difference of 20.94 minutes (20 minutes and 56.496 seconds) to get to Standard time
    const milliseconds: number = Math.trunc(1000 * (moladSeconds - Math.trunc(moladSeconds)));

    return DateTime.fromObject({
      year: molad.getGregorianYear(),
      month: molad.getGregorianMonth() + 1,
      day: molad.getGregorianDayOfMonth(),
      hour: molad.getMoladHours(),
      minute: molad.getMoladMinutes(),
      second: Math.trunc(moladSeconds),
      millisecond: milliseconds,
      zone: geo.getTimeZone(),
    })
      .minus({ milliseconds: Math.trunc(geo.getLocalMeanTimeOffset()) });
  }

  /**
   * Returns the earliest time of <em>Kiddush Levana</em> calculated as 3 days after the molad. This method returns the time
   * even if it is during the day when <em>Kiddush Levana</em> can't be said. Callers of this method should consider
   * displaying the next <em>tzais</em> if the zman is between <em>alos</em> and <em>tzais</em>.
   *
   * @return the Date representing the moment 3 days after the molad.
   *
   * @see ComplexZmanimCalendar#getTchilasZmanKidushLevana3Days()
   * @see ComplexZmanimCalendar#getTchilasZmanKidushLevana3Days(Date, Date)
   */
  public getTchilasZmanKidushLevana3Days(): DateTime {
    const molad: DateTime = this.getMoladAsDate();

    return molad.plus({ hours: 72 });
  }

  /**
   * Returns the earliest time of Kiddush Levana calculated as 7 days after the molad as mentioned by the <a
   * href="https://en.wikipedia.org/wiki/Yosef_Karo">Mechaber</a>. See the <a
   * href="https://en.wikipedia.org/wiki/Yoel_Sirkis">Bach's</a> opinion on this time. This method returns the time
   * even if it is during the day when <em>Kiddush Levana</em> can't be said. Callers of this method should consider
   * displaying the next <em>tzais</em> if the zman is between <em>alos</em> and <em>tzais</em>.
   *
   * @return the Date representing the moment 7 days after the molad.
   *
   * @see ComplexZmanimCalendar#getTchilasZmanKidushLevana7Days()
   * @see ComplexZmanimCalendar#getTchilasZmanKidushLevana7Days(Date, Date)
   */
  public getTchilasZmanKidushLevana7Days(): DateTime {
    const molad: DateTime = this.getMoladAsDate();

    return molad.plus({ hours: 168 });
  }

  /**
   * Returns the latest time of Kiddush Levana according to the <a
   * href="https://en.wikipedia.org/wiki/Yaakov_ben_Moshe_Levi_Moelin">Maharil's</a> opinion that it is calculated as
   * halfway between molad and molad. This adds half the 29 days, 12 hours and 793 chalakim time between molad and
   * molad (14 days, 18 hours, 22 minutes and 666 milliseconds) to the month's molad. This method returns the time
   * even if it is during the day when <em>Kiddush Levana</em> can't be said. Callers of this method should consider
   * displaying <em>alos</em> before this time if the zman is between <em>alos</em> and <em>tzais</em>.
   *
   * @return the Date representing the moment halfway between molad and molad.
   *
   * @see #getSofZmanKidushLevana15Days()
   * @see ComplexZmanimCalendar#getSofZmanKidushLevanaBetweenMoldos()
   * @see ComplexZmanimCalendar#getSofZmanKidushLevanaBetweenMoldos(Date, Date)
   */
  public getSofZmanKidushLevanaBetweenMoldos(): DateTime {
    const molad: DateTime = this.getMoladAsDate();

    // add half the time between molad and molad (half of 29 days, 12 hours and 793 chalakim (44 minutes, 3.3
    // seconds), or 14 days, 18 hours, 22 minutes and 666 milliseconds). Add it as hours, not days, to avoid
    // DST/ST crossover issues.
    return molad.plus({
      hours: (24 * 14) + 18,
      minutes: 22,
      seconds: 1,
      milliseconds: 666,
    });
  }

  /**
   * Returns the latest time of Kiddush Levana calculated as 15 days after the molad. This is the opinion brought down
   * in the Shulchan Aruch (Orach Chaim 426). It should be noted that some opinions hold that the
   * <a href="https://en.wikipedia.org/wiki/Moses_Isserles">Rema</a> who brings down the opinion of the <a
   * href="https://en.wikipedia.org/wiki/Yaakov_ben_Moshe_Levi_Moelin">Maharil's</a> of calculating
   * {@link #getSofZmanKidushLevanaBetweenMoldos() half way between molad and mold} is of the opinion that Mechaber
   * agrees to his opinion. Also see the Aruch Hashulchan. For additional details on the subject, See Rabbi Dovid
   * Heber's very detailed writeup in Siman Daled (chapter 4) of <a
   * href="https://www.worldcat.org/oclc/461326125">Shaarei Zmanim</a>. This method returns the time even if it is during
   * the day when <em>Kiddush Levana</em> can't be said. Callers of this method should consider displaying <em>alos</em>
   * before this time if the zman is between <em>alos</em> and <em>tzais</em>.
   *
   * @return the Date representing the moment 15 days after the molad.
   * @see #getSofZmanKidushLevanaBetweenMoldos()
   * @see ComplexZmanimCalendar#getSofZmanKidushLevana15Days()
   * @see ComplexZmanimCalendar#getSofZmanKidushLevana15Days(Date, Date)
   */
  public getSofZmanKidushLevana15Days(): DateTime {
    const molad: DateTime = this.getMoladAsDate();

    // 15 days after the molad. Add it as hours, not days, to avoid DST/ST crossover issues.
    return molad.plus({ hours: 24 * 15 });
  }

  /**
   * Returns the <em>Daf Yomi (Bavli)</em> for the date that the calendar is set to. See the
   * {@link HebrewDateFormatter#formatDafYomiBavli(Daf)} for the ability to format the <em>daf</em> in
   * Hebrew or transliterated <em>masechta</em> names.
   *
   * @deprecated This depends on a circular dependency. Use <pre>YomiCalculator.getDafYomiBavli(jewishCalendar)</pre> instead.
   * @return the daf as a {@link Daf}
   */
  // eslint-disable-next-line class-methods-use-this
  public getDafYomiBavli(): Daf {
    // return YomiCalculator.getDafYomiBavli(this);
    throw new UnsupportedError('This method is not supported, due to a circular dependency. Use `YomiCalculator.getDafYomiBavli(jewishCalendar)` instead');
  }

  /**
   * Returns the <em>Daf Yomi (Yerushalmi)</em> for the date that the calendar is set to. See the
   * {@link HebrewDateFormatter#formatDafYomiYerushalmi(Daf)} for the ability to format the <em>daf</em>
   * in Hebrew or transliterated <em>masechta</em> names.
   *
   * @deprecated This depends on a circular dependency. Use <pre>YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar)</pre> instead.
   * @return the daf as a {@link Daf}
   */
  // eslint-disable-next-line class-methods-use-this
  public getDafYomiYerushalmi(): Daf {
    // return YerushalmiYomiCalculator.getDafYomiYerushalmi(this);
    throw new UnsupportedError('This method is not supported, due to a circular dependency. Use `YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar)` instead');
  }

  /**
   * Indicates whether some other object is "equal to" this one.
   * @see Object#equals(Object)
   */
  public equals(object: object): boolean {
    if (this === object as JewishCalendar) return true;
    if (!(object instanceof JewishCalendar)) return false;

    const jewishCalendar: JewishCalendar = object as JewishCalendar;
    return this.getAbsDate() === jewishCalendar.getAbsDate() && this.getInIsrael() === jewishCalendar.getInIsrael();
  }
}

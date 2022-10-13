/// Tefila Rules is a utility class that covers the various <em>halachos</em> and <em>minhagim</em> regarding
/// changes to daily <em>tefila</em> / prayers,
/// based on the Jewish calendar. This is mostly useful for use in
/// developing <em>siddur</em> type applications,
/// but it is also valuable for <em>shul</em> calendars that set
/// <em>tefila</em> times based on if <a href="https://en.wikipedia.org/wiki/Tachanun"><em>tachanun</em></a> is
/// recited that day. There are many settings in this class to cover the vast majority of <em>minhagim</em>,
/// but
/// there are likely some not covered here. The source for many of the <em>chasidishe minhagim</em> can be found
/// in the <a href="https://www.nli.org.il/he/books/NNL_ALEPH001141272/NLI">Minhag Yisrael Torah</a> on Orach
/// Chaim 131.
/// Dates used in specific communities such as specific <em>yahrzeits</em> or a holidays like Purim Mezhbizh
/// (Medzhybizh) celebrated on 11 {@link JewishDate#TEVES <em>Teves</em>} or <a href=
/// "https://en.wikipedia.org/wiki/Second_Purim#Purim_Saragossa_(18_Shevat)">Purim Saragossa</a> celebrated on
/// the (17th or) 18th of {@link JewishDate#SHEVAT <em>Shevat</em>} are not (and likely will not be) supported by
/// this class.
/// <p>Sample code:
/// <pre style="background: #FEF0C9; display: inline-block;">
/// TefilaRules tr = new TefilaRules();
/// JewishCalendar jewishCalendar = new JewishCalendar();
/// HebrewDateFormatter hdf = new HebrewDateFormatter();
/// jewishCalendar.setJewishDate(5783,
/// JewishDate.TISHREI,
/// 1); // Rosh Hashana
/// System.out.println(hdf.format(jewishCalendar) + ": " + tr.isTachanunRecitedShacharis(jd));
/// jewishCalendar.setJewishDate(5783,
/// JewishDate.ADAR,
/// 17);
/// System.out.println(hdf.format(jewishCalendar) + ": " + tr.isTachanunRecitedShacharis(jewishCalendar));
/// tr.setTachanunRecitedWeekOfPurim(false);
/// System.out.println(hdf.format(jewishCalendar) + ": " + tr.isTachanunRecitedShacharis(jewishCalendar));</pre>
///
/// ### Authors
/// - &copy; Y. Paritcher 2019 - 2021
/// - &copy; Eliyahu Hershfeld 2019 - 2022
///
///
/// TODO The following items may be added at a future date.
/// - *Lamnatzaiach*
/// - *Mizmor Lesoda*
/// - *Behab*
/// - *Selichos*

import { Calendar } from '../kosher-zmanim';
import { JewishCalendar } from './JewishCalendar';
import { JewishDate } from './JewishDate';

/// - ...
export class TefilaRules {
  /// Whether or not <em>tachanun</em> recited at the end Of {@link JewishDate#TISHREI <em>Tishrei</em>}.
  ///
  /// The Magen Avraham 669:1 and the Pri Chadash 131:7 state that some places to not recite
  /// <em>tachanun</em> during this period. The Sh"UT Chasam Sofer on Choshen Mishpat 77 writes
  /// that this is the <em>minhag</em> in Ashkenaz. The Shaarei Teshuva 131:19 quotes the
  /// Sheyarie Kneses Hagdola who also states that it should not be recited. The Aderes wanted
  /// to institute saying <em>tachanun</em> during this period, but was dissuaded from this by Rav
  /// Shmuel Salant who did not want to change the <em>minhag</em> in Yerushalayim. The Aruch
  /// Hashulchan is of the opinion that that this <em>minhag</em> is incorrect, and it should be
  /// recited, and The Chazon Ish also recited <em>tachanun</em> during this period. See the Dirshu
  /// edition of the Mishna Berurah for details.
  private tachanunRecitedEndOfTishrei: boolean = true;

  /**
   * Is <em>tachanun</em> recited during the week after <em>Shavuos</em>. This is the opinion of the Pri Megadim
   * quoted by the Mishna Berurah. This is since <em>karbanos</em> of <em>Shavuos</em> have <em>tashlumim</em> for
   * 7 days, it is still considered like a Yom Tov. The Chazon Ish quoted in the Orchos Rabainu vol. 1 page 68
   * recited <em>tachanun</em> during this week.
   *
   * @return If <em>tachanun</em> is set to be recited during the week after Shavuos.
   * @see #setTachanunRecitedWeekAfterShavuos(boolean)
   */
  private tachanunRecitedWeekAfterShavuos: boolean = false;

  /**
   * Is <em>tachanun</em> is recited on the 13th of {@link JewishDate#SIVAN <em>Sivan</em>} (<a href=
   * "https://en.wikipedia.org/wiki/Yom_tov_sheni_shel_galuyot"><em>Yom Tov Sheni shel Galuyos</em></a> of the 7th
   * day) outside Israel. This is brought down by the Shaarie Teshuva 131:19 quoting the <a href=
   * "https://hebrewbooks.org/pdfpager.aspx?req=41295&st=&pgnum=39">Sheyarei Kneses Hagedola 131:12</a>that
   * <em>tachanun</em> should not be recited on this day. Rav Shlomo Zalman Orbach in Halichos Shlomo on
   * Shavuos 12:16:25 is of the opinion that even in <em>chutz laaretz</em> it should be recited since the <em>yemei
   * Tashlumin</em> are counted based on Israel since that is where the <em>karbanos</em> are brought. Both
   * {@link #isTachanunRecitedShacharis(JewishCalendar)} and {@link #isTachanunRecitedMincha(JewishCalendar)}
   * only return false if the location is not set to {@link JewishCalendar#getInIsrael() Israel} and both
   * {@link #tachanunRecitedWeekAfterShavuos} and {@link #setTachanunRecited13SivanOutOfIsrael} are set to false.
   *
   * @return If <em>tachanun</em> is set to be recited on the 13th of {@link JewishDate#SIVAN <em>Sivan</em>} out of Israel.
   * @see #setTachanunRecited13SivanOutOfIsrael(isTachanunRecitedThirteenSivanOutOfIsrael)
   * @see #isTachanunRecitedWeekAfterShavuos()
   */
  private tachanunRecited13SivanOutOfIsrael: boolean = true;

  /**
   * Is <em>tachanun</em> recited on {@link JewishCalendar#PESACH_SHENI <em>Pesach Sheni</em>}. The Pri Chadash 131:7 states
   * that <em>tachanun</em> should not be recited. The Aruch Hashulchan states that this is the minhag of the <em>sephardim</em>.
   * the Shaarei Efraim 10:27 also mentions that it is not recited, as does the Siddur Yaavetz (Shaar Hayesod, Chodesh Iyar).
   * The Pri Megadim (Mishbetzes Hazahav 131:15) and the Chazon Ish (Erev Pesahc Shchal Beshabos, page 203 in <a href=
   * "https://he.wikipedia.org/wiki/%D7%A9%D7%A8%D7%99%D7%94_%D7%93%D7%91%D7%9C%D7%99%D7%A6%D7%A7%D7%99">Rav Sheraya
   * Devlitzky's</a> comments).
   *
   * @return If <em>tachanun</em> is recited on {@link JewishCalendar#PESACH_SHENI <em>Pesach Sheni</em>}.
   * @see #setTachanunRecitedPesachSheni(boolean)
   */
  private tachanunRecitedPesachSheni: boolean = false;

  /**
   * Is <em>tachanun</em> recited on 15 {@link JewishDate#IYAR <em>Iyar</em>} (<em>sfaika deyoma</em> of {@link JewishCalendar#PESACH_SHENI
   * <em>Pesach Sheni</em>}) out of Israel. If {@link #isTachanunRecitedPesachSheni()} is <code>true</code> this will be
   * ignored even if <code>false</code>.
   *
   * @return if <em>tachanun</em> is recited on 15 {@link JewishDate#IYAR <em>Iyar</em>}  (<em>sfaika deyoma</em> of {@link
   *          JewishCalendar#PESACH_SHENI <em>Pesach Sheni</em>} out of Israel. If {@link #isTachanunRecitedPesachSheni()}
   *          is <code>true</code> this will be ignored even if <code>false</code>.
   * @see #setTachanunRecited15IyarOutOfIsrael(boolean)
   * @see #setTachanunRecitedPesachSheni(boolean)
   * @see #isTachanunRecitedPesachSheni()
   */
  private tachanunRecited15IyarOutOfIsrael: boolean = true;

  /**
   * Is <em>tachanun</em> recited on <em>mincha</em> on <em>erev {@link JewishCalendar#LAG_BAOMER Lag Baomer}</em>.
   * @return if <em>tachanun</em> is recited in <em>mincha</em> on <em>erev</em>
   *          {@link JewishCalendar#LAG_BAOMER <em>Lag Baomer</em>}.
   * @see #setTachanunRecitedMinchaErevLagBaomer(boolean)
   */
  private tachanunRecitedMinchaErevLagBaomer: boolean = false;

  /**
   * Is <em>tachanun</em> recited during the <em>Shivas Yemei Hamiluim</em>, from the 23 of {@link
   * JewishDate#ADAR <em>Adar</em>} on a non-leap-year or {@link JewishDate#ADAR_II <em>Adar II</em>} on a
   * leap year to the end of the month. Some <em>chasidishe</em> communities do not say <em>tachanun</em>
   * during this week. See <a href="https://hebrewbooks.org/pdfpager.aspx?req=4692&st=&pgnum=70">Darkei
   * Chaim Veshalom 191</a>.
   * @return if <em>tachanun</em> is recited during the <em>Shivas Yemei Hamiluim</em>, from the 23 of {@link
   *          JewishDate#ADAR <em>Adar</em>} on a non-leap-year or {@link JewishDate#ADAR_II <em>Adar II</em>}
   *          on a leap year to the end of the month.
   * @see #setTachanunRecitedShivasYemeiHamiluim(boolean)
   */
  private tachanunRecitedShivasYemeiHamiluim: boolean = true;

  /**
   * Is <em>tachanun</em> recited during the <em>sefira</em> week of <em>Hod</em> (14 - 20 {@link JewishDate#IYAR <em>Iyar</em>},
   * or the 29th - 35th of the {@link JewishCalendar#getDayOfOmer() <em>Omer</em>}). Some <em>chasidishe</em> communities
   * do not recite <em>tachanun</em> during this week. See Minhag Yisrael Torah 131:Iyar.
   * @return If <em>tachanun</em> is set to be recited during the <em>sefira</em> week of <em>Hod</em> (14 - 20 {@link
   *         JewishDate#IYAR <em>Iyar</em>}, or the 29th - 35th of the {@link JewishCalendar#getDayOfOmer() <em>Omer</em>}).
   * @see #setTachanunRecitedWeekOfHod(boolean)
   */
  private tachanunRecitedWeekOfHod: boolean = true;

  /**
   * Is <em>tachanun</em> recited during the week of Purim, from the 11th through the 17th of {@link
   * JewishDate#ADAR <em>Adar</em>} (on a non-leap year, or {@link JewishDate#ADAR_II <em>Adar II</em>} on a leap year). Some
   * <em>chasidishe</em> communities do not recite <em>tachanun</em> during this period. See the <a href=
   * "https://www.nli.org.il/he/books/NNL_ALEPH001141272/NLI">Minhag Yisrael Torah</a> 131 and <a href=
   * "https://hebrewbooks.org/pdfpager.aspx?req=4692&st=&pgnum=70">Darkei Chaim Veshalom 191</a>who discuss the
   * <em>minhag</em> not to recite <em>tachanun</em>. Also see the <a href=
   * "https://hebrewbooks.org/pdfpager.aspx?req=8944&st=&pgnum=160">Mishmeres Shalom (Hadras Shalom)</a> who discusses the
   * <em>minhag</em> of not reciting it on the 16th and 17th.
   * @return If <em>tachanun</em> is set to be recited during the week of Purim from the 11th through the 17th of {@link
   *         JewishDate#ADAR <em>Adar</em>} (on a non-leap year, or {@link JewishDate#ADAR_II <em>Adar II</em>} on a leap year).
   * @see #setTachanunRecitedWeekOfPurim(boolean)
   */
  private tachanunRecitedWeekOfPurim: boolean = true;

  /**
   * Is <em>tachanun</em> recited on Fridays. Some <em>chasidishe</em> communities do not recite
   * <em>tachanun</em> on Fridays. See <a href="https://hebrewbooks.org/pdfpager.aspx?req=41190&st=&pgnum=10">Likutei
   * Maharich Vol 2 Seder Hanhagos Erev Shabbos</a>. This is also the <em>minhag</em> in Satmar.
   * @return if <em>tachanun</em> is recited on Fridays.
   * @see #setTachanunRecitedFridays(boolean)
   */
  private tachanunRecitedFridays: boolean = true;

  /**
   * Is <em>tachanun</em> recited on Sundays. Some <em>chasidishe</em> communities do not recite
   * <em>tachanun</em> on Sundays. See <a href="https://hebrewbooks.org/pdfpager.aspx?req=41190&st=&pgnum=10">Likutei
   * Maharich Vol 2 Seder Hanhagos Erev Shabbos</a>.
   * @return if <em>tachanun</em> is recited on Sundays.
   * @see #setTachanunRecitedSundays(boolean)
   */
  private tachanunRecitedSundays: boolean = true;

  /**
   * Is <em>tachanun</em> recited in <em>Mincha</em> the entire year. Some <em>chasidishe</em> communities do not recite
   * <em>tachanun</em> by <em>Mincha</em> all year round. See<a href=
   * "https://hebrewbooks.org/pdfpager.aspx?req=4751&st=&pgnum=105">Nemukei Orach Chaim 131:3</a>.
   * @return if <em>tachanun</em> is recited in <em>Mincha</em> the entire year.
   * @see #setTachanunRecitedMinchaAllYear(boolean)
   */
  private tachanunRecitedMinchaAllYear: boolean = true;

  /**
   * Returns if <em>tachanun</em> is recited during <em>shacharis</em> on the day in question. See the many
   * <em>minhag</em> based settings that are available in this class.
   *
   * @param jewishCalendar the Jewish calendar day.
   * @return if <em>tachanun</em> is recited during <em>shacharis</em>.
   * @see #isTachanunRecitedMincha(JewishCalendar)
   */
  public isTachanunRecitedShacharis(jewishCalendar: JewishCalendar): boolean {
    const holidayIndex = jewishCalendar.getYomTovIndex();
    const day = jewishCalendar.getJewishDayOfMonth();
    const month = jewishCalendar.getJewishMonth();

    const res =
      jewishCalendar.getDayOfWeek() === JewishDate.saturday ||
      (!this.tachanunRecitedSundays &&
        jewishCalendar.getDayOfWeek() === JewishDate.sunday) ||
      (!this.tachanunRecitedFridays &&
        jewishCalendar.getDayOfWeek() === JewishDate.friday) ||
      month === JewishDate.NISSAN ||
      (month === JewishDate.TISHREI &&
        ((!this.tachanunRecitedEndOfTishrei && day > 8) ||
          (this.tachanunRecitedEndOfTishrei && day > 8 && day < 22))) ||
      (month === JewishDate.SIVAN &&
        ((this.tachanunRecitedWeekAfterShavuos && day < 7) ||
          (!this.tachanunRecitedWeekAfterShavuos &&
            day <
              (!jewishCalendar.getInIsrael() &&
              !this.tachanunRecited13SivanOutOfIsrael
                ? 14
                : 13)))) ||
      (jewishCalendar.isYomTov() &&
        (!jewishCalendar.isTaanis() ||
          (!this.tachanunRecitedPesachSheni &&
            holidayIndex === JewishCalendar.PESACH_SHENI))) || // Erev YT is included in isYomTov()
      (!jewishCalendar.getInIsrael() &&
        !this.tachanunRecitedPesachSheni &&
        !this.tachanunRecited15IyarOutOfIsrael &&
        jewishCalendar.getJewishMonth() === JewishDate.IYAR &&
        day === 15) ||
      holidayIndex === JewishCalendar.TISHA_BEAV ||
      jewishCalendar.isIsruChag() ||
      jewishCalendar.isRoshChodesh() ||
      (!this.tachanunRecitedShivasYemeiHamiluim &&
        ((!jewishCalendar.isJewishLeapYear() && month === JewishDate.ADAR) ||
          (jewishCalendar.isJewishLeapYear() &&
            month === JewishDate.ADAR_II)) &&
        day > 22) ||
      (!this.tachanunRecitedWeekOfPurim &&
        ((!jewishCalendar.isJewishLeapYear() && month === JewishDate.ADAR) ||
          (jewishCalendar.isJewishLeapYear() &&
            month === JewishDate.ADAR_II)) &&
        day > 10 &&
        day < 18) ||
      (jewishCalendar.isUseModernHolidays() &&
        (holidayIndex === JewishCalendar.YOM_HAATZMAUT ||
          holidayIndex === JewishCalendar.YOM_YERUSHALAYIM)) ||
      (!this.tachanunRecitedWeekOfHod &&
        month === JewishDate.IYAR &&
        day > 13 &&
        day < 21);

    return !res;
  }

  /**
   * Returns if <em>tachanun</em> is recited during <em>mincha</em> on the day in question.
   *
   * @param jewishCalendar the Jewish calendar day.
   * @return if <em>tachanun</em> is recited during <em>mincha</em>.
   * @see #isTachanunRecitedShacharis(JewishCalendar)
   */
  public isTachanunRecitedMincha(jewishCalendar: JewishCalendar): boolean {
    const tomorrow = jewishCalendar.clone();

    tomorrow.forward(Calendar.DATE, 1);

    const res =
      !this.tachanunRecitedMinchaAllYear ||
      jewishCalendar.getDayOfWeek() === JewishDate.friday ||
      !this.isTachanunRecitedShacharis(jewishCalendar) ||
      (!this.isTachanunRecitedShacharis(tomorrow) &&
        !(tomorrow.getYomTovIndex() === JewishCalendar.EREV_ROSH_HASHANA) &&
        !(tomorrow.getYomTovIndex() === JewishCalendar.EREV_YOM_KIPPUR) &&
        !(tomorrow.getYomTovIndex() === JewishCalendar.PESACH_SHENI)) ||
      (!this.tachanunRecitedMinchaErevLagBaomer &&
        tomorrow.getYomTovIndex() === JewishCalendar.LAG_BAOMER);

    return !res;
  }

  /**
   * Returns if it is the Jewish day (starting the evening before) to start reciting <em>Vesein Tal Umatar Livracha</em>
   * (<em>Sheailas Geshamim</em>). In Israel this is the 7th day of {@link JewishDate#CHESHVAN <em>Marcheshvan</em>}.
   * Outside Israel recitation starts on the evening of December 4th (or 5th if it is the year before a civil leap year)
   * in the 21st century and shifts a day forward every century not evenly divisible by 400. This method will return true
   * if <em>vesein tal umatar</em> on the current Jewish date that starts on the previous night, so Dec 5/6 will be
   * returned by this method in the 21st century. <em>vesein tal umatar</em> is not recited on <em>Shabbos</em> and the
   * start date will be delayed a day when the start day is on a <em>Shabbos</em> (this can only occur out of Israel).
   *
   * @param jewishCalendar the Jewish calendar day.
   *
   * @return true if it is the first Jewish day (starting the prior evening of reciting <em>Vesein Tal Umatar Livracha</em>
   *         (<em>Sheailas Geshamim</em>).
   *
   * @see #isVeseinTalUmatarStartingTonight(JewishCalendar)
   * @see #isVeseinTalUmatarRecited(JewishCalendar)
   */
  public static isVeseinTalUmatarStartDate(jewishCalendar: JewishCalendar) {
    if (
      jewishCalendar.getInIsrael() &&
      jewishCalendar.getJewishMonth() === JewishDate.CHESHVAN &&
      jewishCalendar.getJewishDayOfMonth() === 7
    ) {
      // The 7th Cheshvan can't occur on Shabbos, so always return true for 7 Cheshvan
      return true;
    }

    // Not recited on Friday night
    if (jewishCalendar.getDayOfWeek() === JewishDate.saturday) {
      return false;
    }

    // When starting on Sunday, it can be the start date or delayed from Shabbos
    const tted = jewishCalendar.getTekufasTishreiElapsedDays();
    return (
      (jewishCalendar.getDayOfWeek() === JewishDate.sunday && tted === 48) ||
      tted === 47
    );
  }

  /**
   * Returns if true if tonight is the first night to start reciting <em>Vesein Tal Umatar Livracha</em> (
   * <em>Sheailas Geshamim</em>). In Israel this is the 7th day of {@link JewishDate#CHESHVAN
   * <em>Marcheshvan</em>} (so the 6th will return true). Outside Israel recitation starts on the evening
   * of December 4th (or 5th if it is the year before a civil leap year) in the 21st century and shifts a
   * day forward every century not evenly divisible by 400. <em>Vesein tal umatar</em> is not recited on
   * <em>Shabbos</em> and the start date will be delayed a day when the start day is on a <em>Shabbos</em>
   * (this can only occur out of Israel).
   *
   * @param jewishCalendar the Jewish calendar day.
   *
   * @return true if it is the first Jewish day (starting the prior evening of reciting <em>Vesein Tal Umatar
   *         Livracha</em> (<em>Sheailas Geshamim</em>).
   *
   * @see #isVeseinTalUmatarStartDate(JewishCalendar)
   * @see #isVeseinTalUmatarRecited(JewishCalendar)
   */
  public static isVeseinTalUmatarStartingTonight(
    jewishCalendar: JewishCalendar
  ) {
    if (
      jewishCalendar.getInIsrael() &&
      jewishCalendar.getJewishMonth() === JewishDate.CHESHVAN &&
      jewishCalendar.getJewishDayOfMonth() === 6
    ) {
      // The 7th Cheshvan can't occur on Shabbos, so always return true for 6 Cheshvan
      return true;
    }

    // Not recited on Friday night
    if (jewishCalendar.getDayOfWeek() === JewishDate.friday) {
      return false;
    }

    // When starting on motzai Shabbos, it can be the start date or delayed from Friday night
    const tted = jewishCalendar.getTekufasTishreiElapsedDays();
    return (
      (jewishCalendar.getDayOfWeek() === JewishDate.sunday && tted === 47) ||
      tted === 46
    );
  }

  /**
   * Returns if <em>Vesein Tal Umatar Livracha</em> (<em>Sheailas Geshamim</em>) is recited. This will return
   * true for the entire season, even on <em>Shabbos</em> when it is not recited.
   *
   * @param jewishCalendar the Jewish calendar day.
   *
   * @return true if <em>Vesein Tal Umatar Livracha</em> (<em>Sheailas Geshamim</em>) is recited.
   *
   * @see #isVeseinTalUmatarStartDate(JewishCalendar)
   * @see #isVeseinTalUmatarStartingTonight(JewishCalendar)
   */
  public static isVeseinTalUmatarRecited(jewishCalendar: JewishCalendar) {
    if (
      jewishCalendar.getJewishMonth() === JewishDate.NISSAN &&
      jewishCalendar.getJewishDayOfMonth() < 15
    ) {
      return true;
    }
    if (jewishCalendar.getJewishMonth() < JewishDate.CHESHVAN) {
      return false;
    }
    if (jewishCalendar.getInIsrael()) {
      return (
        jewishCalendar.getJewishMonth() !== JewishDate.CHESHVAN ||
        jewishCalendar.getJewishDayOfMonth() >= 7
      );
    }
    return jewishCalendar.getTekufasTishreiElapsedDays() >= 47;
  }

  /**
   * Returns if <em>Vesein Beracha</em> is recited. It is recited from 15 {@link JewishDate#NISSAN <em>Nissan</em>} to the
   * point that {@link #isVeseinTalUmatarRecited(JewishCalendar) <em>vesein tal umatar</em> is recited}.
   *
   * @param jewishCalendar the Jewish calendar day.
   * @return true if <em>Vesein Beracha</em> is recited.
   * @see #isVeseinTalUmatarRecited(JewishCalendar)
   */
  public isVeseinBerachaRecited(jewishCalendar: JewishCalendar) {
    return !this.isVeseinTalUmatarRecited(jewishCalendar);
  }

  /**
   * Returns if the date is the start date for reciting <em>Mashiv Haruach Umorid Hageshem</em>. The date is 22
   * {@link JewishDate#TISHREI <em>Tishrei</em>}.
   *
   * @param jewishCalendar the Jewish calendar day.
   * @return true if the date is the start date for reciting <em>Mashiv Haruach Umorid Hageshem</em>.
   * @see #isMashivHaruachEndDate(JewishCalendar)
   * @see #isMashivHaruachRecited(JewishCalendar)
   */
  public static isMashivHaruachStartDate(jewishCalendar: JewishCalendar) {
    return (
      jewishCalendar.getJewishMonth() === JewishDate.TISHREI &&
      jewishCalendar.getJewishDayOfMonth() === 22
    );
  }

  /**
   * Returns if the date is the end date for reciting <em>Mashiv Haruach Umorid Hageshem</em>. The date is 15
   * {@link JewishDate#NISSAN <em>Nissan</em>}.
   *
   * @param jewishCalendar the Jewish calendar day.
   * @return true if the date is the end date for reciting <em>Mashiv Haruach Umorid Hageshem</em>.
   * @see #isMashivHaruachStartDate(JewishCalendar)
   * @see #isMashivHaruachRecited(JewishCalendar)
   */
  public static isMashivHaruachEndDate(jewishCalendar: JewishCalendar) {
    return (
      jewishCalendar.getJewishMonth() === JewishDate.NISSAN &&
      jewishCalendar.getJewishDayOfMonth() === 15
    );
  }

  /**
   * Returns if <em>Mashiv Haruach Umorid Hageshem</em> is recited. This period starts on 22 {@link
   * JewishDate#TISHREI <em>Tishrei</em>} and ends on the 15th day of {@link JewishDate#NISSAN <em>Nissan</em>}.
   *
   * @param jewishCalendar the Jewish calendar day.
   * @return true if <em>Mashiv Haruach Umorid Hageshem</em> is recited.
   * @see #isMashivHaruachStartDate(JewishCalendar)
   * @see #isMashivHaruachEndDate(JewishCalendar)
   */
  public static isMashivHaruachRecited(jewishCalendar: JewishCalendar) {
    const startDate = new JewishDate(
      jewishCalendar.getJewishYear(),
      JewishDate.TISHREI,
      22,
    );

    const endDate = new JewishDate(
      jewishCalendar.getJewishYear(),
      JewishDate.NISSAN,
      15,
    );

    return (
      jewishCalendar.compareTo(startDate) > 0 &&
      jewishCalendar.compareTo(endDate) < 0
    );
  }

  /**
   * Returns if <em>Morid Hatal</em> (or the lack of reciting <em>Mashiv Haruach</em> following <em>nussach Ashkenaz</em>) is
   * recited. This period starts on the 15th day of {@link JewishDate#NISSAN <em>Nissan</em>} and ends on 22 {@link
   * JewishDate#TISHREI <em>Tishrei</em>}.
   *
   * @param jewishCalendar the Jewish calendar day.
   *
   * @return true if <em>Morid Hatal</em> (or the lack of reciting <em>Mashiv Haruach</em> following <em>nussach Ashkenaz</em>) is recited.
   */
  public static isMoridHatalRecited(jewishCalendar: JewishCalendar) {
    return (
      !TefilaRules.isMashivHaruachRecited(jewishCalendar)
      || TefilaRules.isMashivHaruachStartDate(jewishCalendar)
      || TefilaRules.isMashivHaruachEndDate(jewishCalendar)
    );
  }

  /**
   * Returns if <em>hallel</em> is recited on the day in question. This will return true for both <em>hallel shalem</em>
   * and <em>chatzi hallel</em>. See {@link #isHallelShalemRecited(JewishCalendar)} to know if the complete <em>hallel</em>
   * is recited.
   *
   * @param jewishCalendar the Jewish calendar day.
   * @return if <em>hallel</em> is recited.
   * @see #isHallelShalemRecited(JewishCalendar)
   */
  public static isHallelRecited(jewishCalendar: JewishCalendar) {
    const day = jewishCalendar.getJewishDayOfMonth();
    const month = jewishCalendar.getJewishMonth();
    const holidayIndex = jewishCalendar.getYomTovIndex();
    const inIsrael = jewishCalendar.getInIsrael();

    if (jewishCalendar.isRoshChodesh()) {
      // RH returns false for RC
      return true;
    }
    if (jewishCalendar.isChanukah()) {
      return true;
    }
    // eslint-disable-next-line default-case
    switch (month) {
      case JewishDate.NISSAN:
        if (
          day >= 15
          && ((inIsrael && day <= 21) || (!inIsrael && day <= 22))
        ) {
          return true;
        }
        break;
      case JewishDate.IYAR: // modern holidays
        if (
          jewishCalendar.isUseModernHolidays()
           && (holidayIndex === JewishCalendar.YOM_HAATZMAUT
          || holidayIndex === JewishCalendar.YOM_YERUSHALAYIM)
        ) {
          return true;
        }
        break;
      case JewishDate.SIVAN:
        if (day === 6 || (!inIsrael && day === 7)) {
          return true;
        }
        break;
      case JewishDate.TISHREI:
        if (day >= 15 && (day <= 22 || (!inIsrael && day <= 23))) {
          return true;
        }
    }
    return false;
  }

  /**
   * Returns if <em>hallel shalem</em> is recited on the day in question. This will always return false if {@link
   * #isHallelRecited(JewishCalendar)} returns false.
   *
   * @param jewishCalendar the Jewish calendar day.
   * @return if <em>hallel shalem</em> is recited.
   * @see #isHallelRecited(JewishCalendar)
   */
  public static isHallelShalemRecited(jewishCalendar: JewishCalendar) {
    const day = jewishCalendar.getJewishDayOfMonth();
    const month = jewishCalendar.getJewishMonth();
    const inIsrael = jewishCalendar.getInIsrael();

    if (TefilaRules.isHallelRecited(jewishCalendar)) {
      if (
        (jewishCalendar.isRoshChodesh() && !jewishCalendar.isChanukah()) ||
        (month === JewishDate.NISSAN
         && ((inIsrael && day > 15) || (!inIsrael && day > 16)))
      ) {
        return false;
      }
      return true;
    }
    return false;
  }
}

import Daf from "./Daf";
import JewishDate from "./JewishDate";
import JewishCalendar from "./JewishCalendar";
import {StringUtils} from "../polyfills/Utils";

/**
 * The HebrewDateFormatter class formats a {@link JewishDate}.
 * 
 * The class formats Jewish dates in Hebrew or Latin chars, and has various settings. Sample full date output includes
 * (using various options):
 * <ul>
 * <li>21 Shevat, 5729</li>
 * <li>&#x5DB;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DB;&#x5D8;</li>
 * <li>&#x5D4;&#x5F3; &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;</li>
 * <li>&#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DA;&#x5F3;</li>
 * </ul>
 * 
 * @see net.sourceforge.zmanim.hebrewcalendar.JewishDate
 * @see net.sourceforge.zmanim.hebrewcalendar.JewishCalendar
 * 
 * @author &copy; Eliyahu Hershfeld 2011 - 2015
 * @version 0.3
 */
export default class HebrewDateFormatter {
    private hebrewFormat: boolean = false;
    private useLonghebrewYears: boolean = false;
    private useGershGershayim: boolean = true;
    private longWeekFormat: boolean = true;

    /**
     * returns if the {@link #formatDayOfWeek(JewishDate)} will use the long format such as
     * &#x05E8;&#x05D0;&#x05E9;&#x05D5;&#x05DF; or short such as &#x05D0; when formatting the day of week in
     * {@link #isHebrewFormat() Hebrew}.
     *
     * @return the longWeekFormat
     * @see #setLongWeekFormat(boolean)
     * @see #formatDayOfWeek(JewishDate)
     */
    public isLongWeekFormat(): boolean {
        return this.longWeekFormat;
    }

    /**
     * Setting to control if the {@link #formatDayOfWeek(JewishDate)} will use the long format such as
     * &#x05E8;&#x05D0;&#x05E9;&#x05D5;&#x05DF; or short such as &#x05D0; when formatting the day of week in
     * {@link #isHebrewFormat() Hebrew}.
     *
     * @param longWeekFormat
     *            the longWeekFormat to set
     */
    public setLongWeekFormat(longWeekFormat: boolean): void {
        this.longWeekFormat = longWeekFormat;
    }

    private static readonly GERESH: string = "\u05F3";
    private static readonly GERSHAYIM: string = "\u05F4";
    private transliteratedMonths: string[] = [ "Nissan", "Iyar", "Sivan", "Tammuz", "Av", "Elul", "Tishrei", "Cheshvan",
            "Kislev", "Teves", "Shevat", "Adar", "Adar II", "Adar I" ];
    private hebrewOmerPrefix: string = "\u05D1";

    private transliteratedShabbosDayOfweek: string = "Shabbos";

    /**
     * Returns the day of Shabbos transliterated into Latin chars. The default uses Ashkenazi pronounciation "Shabbos".
     * This can be overwritten using the {@link #setTransliteratedShabbosDayOfWeek(String)}
     *
     * @return the transliteratedShabbos. The default list of months uses Ashkenazi pronounciation "Shabbos".
     * @see #setTransliteratedShabbosDayOfWeek(String)
     * @see #formatDayOfWeek(JewishDate)
     */
    public getTransliteratedShabbosDayOfWeek(): string {
        return this.transliteratedShabbosDayOfweek;
    }

    /**
     * Setter to override the default transliterated name of "Shabbos" to alternate spelling such as "Shabbat" used by
     * the {@link #formatDayOfWeek(JewishDate)}
     *
     * @param transliteratedShabbos
     *            the transliteratedShabbos to set
     *
     * @see #getTransliteratedShabbosDayOfWeek()
     * @see #formatDayOfWeek(JewishDate)
     */
    public setTransliteratedShabbosDayOfWeek(transliteratedShabbos: string): void {
        this.transliteratedShabbosDayOfweek = transliteratedShabbos;
    }

    private transliteratedHolidays: string[] = [ "Erev Pesach", "Pesach", "Chol Hamoed Pesach", "Pesach Sheni",
            "Erev Shavuos", "Shavuos", "Seventeenth of Tammuz", "Tishah B'Av", "Tu B'Av", "Erev Rosh Hashana",
            "Rosh Hashana", "Fast of Gedalyah", "Erev Yom Kippur", "Yom Kippur", "Erev Succos", "Succos",
            "Chol Hamoed Succos", "Hoshana Rabbah", "Shemini Atzeres", "Simchas Torah", "Erev Chanukah", "Chanukah",
            "Tenth of Teves", "Tu B'Shvat", "Fast of Esther", "Purim", "Shushan Purim", "Purim Katan", "Rosh Chodesh",
            "Yom HaShoah", "Yom Hazikaron", "Yom Ha'atzmaut", "Yom Yerushalayim" ];

    /**
     * Returns the list of holidays transliterated into Latin chars. This is used by the
     * {@link #formatYomTov(JewishCalendar)} when formatting the Yom Tov String. The default list of months uses
     * Ashkenazi pronunciation in typical American English spelling.
     *
     * @return the list of holidays "Adar", "Adar II", "Adar I". The default list is currently "Erev Pesach", "Pesach",
     *         "Chol Hamoed Pesach", "Pesach Sheni", "Erev Shavuos", "Shavuos", "Seventeenth of Tammuz", "Tishah B'Av",
     *         "Tu B'Av", "Erev Rosh Hashana", "Rosh Hashana", "Fast of Gedalyah", "Erev Yom Kippur", "Yom Kippur",
     *         "Erev Succos", "Succos", "Chol Hamoed Succos", "Hoshana Rabbah", "Shemini Atzeres", "Simchas Torah",
     *         "Erev Chanukah", "Chanukah", "Tenth of Teves", "Tu B'Shvat", "Fast of Esther", "Purim", "Shushan Purim",
     *         "Purim Katan", "Rosh Chodesh", "Yom HaShoah", "Yom Hazikaron", "Yom Ha'atzmaut", "Yom Yerushalayim"
     *
     * @see #setTransliteratedMonthList(String[])
     * @see #formatYomTov(JewishCalendar)
     * @see #isHebrewFormat()
     */
    public getTransliteratedHolidayList(): string[] {
        return this.transliteratedHolidays;
    }

    /**
     * Sets the list of holidays transliterated into Latin chars. This is used by the
     * {@link #formatYomTov(JewishCalendar)} when formatting the Yom Tov String.
     *
     * @param transliteratedHolidays
     *            the transliteratedHolidays to set. Ensure that the sequence exactly matches the list returned by the
     *            defaulyt
     */
    public setTransliteratedHolidayList(transliteratedHolidays: string[]): void {
        this.transliteratedHolidays = transliteratedHolidays;
    }

    /**
     * Hebrew holiday list
     */
    private static readonly hebrewHolidays: string[] = [ "\u05E2\u05E8\u05D1 \u05E4\u05E1\u05D7", "\u05E4\u05E1\u05D7",
            "\u05D7\u05D5\u05DC \u05D4\u05DE\u05D5\u05E2\u05D3 \u05E4\u05E1\u05D7",
            "\u05E4\u05E1\u05D7 \u05E9\u05E0\u05D9", "\u05E2\u05E8\u05D1 \u05E9\u05D1\u05D5\u05E2\u05D5\u05EA",
            "\u05E9\u05D1\u05D5\u05E2\u05D5\u05EA",
            "\u05E9\u05D1\u05E2\u05D4 \u05E2\u05E9\u05E8 \u05D1\u05EA\u05DE\u05D5\u05D6",
            "\u05EA\u05E9\u05E2\u05D4 \u05D1\u05D0\u05D1", "\u05D8\u05F4\u05D5 \u05D1\u05D0\u05D1",
            "\u05E2\u05E8\u05D1 \u05E8\u05D0\u05E9 \u05D4\u05E9\u05E0\u05D4",
            "\u05E8\u05D0\u05E9 \u05D4\u05E9\u05E0\u05D4", "\u05E6\u05D5\u05DD \u05D2\u05D3\u05DC\u05D9\u05D4",
            "\u05E2\u05E8\u05D1 \u05D9\u05D5\u05DD \u05DB\u05D9\u05E4\u05D5\u05E8",
            "\u05D9\u05D5\u05DD \u05DB\u05D9\u05E4\u05D5\u05E8", "\u05E2\u05E8\u05D1 \u05E1\u05D5\u05DB\u05D5\u05EA",
            "\u05E1\u05D5\u05DB\u05D5\u05EA",
            "\u05D7\u05D5\u05DC \u05D4\u05DE\u05D5\u05E2\u05D3 \u05E1\u05D5\u05DB\u05D5\u05EA",
            "\u05D4\u05D5\u05E9\u05E2\u05E0\u05D0 \u05E8\u05D1\u05D4",
            "\u05E9\u05DE\u05D9\u05E0\u05D9 \u05E2\u05E6\u05E8\u05EA",
            "\u05E9\u05DE\u05D7\u05EA \u05EA\u05D5\u05E8\u05D4", "\u05E2\u05E8\u05D1 \u05D7\u05E0\u05D5\u05DB\u05D4",
            "\u05D7\u05E0\u05D5\u05DB\u05D4", "\u05E2\u05E9\u05E8\u05D4 \u05D1\u05D8\u05D1\u05EA",
            "\u05D8\u05F4\u05D5 \u05D1\u05E9\u05D1\u05D8", "\u05EA\u05E2\u05E0\u05D9\u05EA \u05D0\u05E1\u05EA\u05E8",
            "\u05E4\u05D5\u05E8\u05D9\u05DD", "\u05E4\u05D5\u05E8\u05D9\u05DD \u05E9\u05D5\u05E9\u05DF",
            "\u05E4\u05D5\u05E8\u05D9\u05DD \u05E7\u05D8\u05DF", "\u05E8\u05D0\u05E9 \u05D7\u05D5\u05D3\u05E9",
            "\u05D9\u05D5\u05DD \u05D4\u05E9\u05D5\u05D0\u05D4",
            "\u05D9\u05D5\u05DD \u05D4\u05D6\u05D9\u05DB\u05E8\u05D5\u05DF",
            "\u05D9\u05D5\u05DD \u05D4\u05E2\u05E6\u05DE\u05D0\u05D5\u05EA",
            "\u05D9\u05D5\u05DD \u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD" ];

    /**
     * Formats the Yom Tov (holiday) in Hebrew or transliterated Latin characters.
     *
     * @param jewishCalendar the JewishCalendar
     * @return the formatted holiday or an empty String if the day is not a holiday.
     * @see #isHebrewFormat()
     */
    public formatYomTov(jewishCalendar: JewishCalendar): string {
        const index: number = jewishCalendar.getYomTovIndex();
        if (index === JewishCalendar.CHANUKAH) {
            const dayOfChanukah: number = jewishCalendar.getDayOfChanukah();
            return this.hebrewFormat ? (this.formatHebrewNumber(dayOfChanukah) + " " + HebrewDateFormatter.hebrewHolidays[index])
                    : (this.transliteratedHolidays[index] + " " + dayOfChanukah);
        }
        return index === -1 ? "" : this.hebrewFormat ? HebrewDateFormatter.hebrewHolidays[index] : this.transliteratedHolidays[index];
    }

    public formatRoshChodesh(jewishCalendar: JewishCalendar): string {
        if (!jewishCalendar.isRoshChodesh()) {
            return "";
        }
        let formattedRoshChodesh: string;
        let month: number = jewishCalendar.getJewishMonth();
        if (jewishCalendar.getJewishDayOfMonth() === 30) {
            if (month < JewishCalendar.ADAR || (month === JewishCalendar.ADAR && jewishCalendar.isJewishLeapYear())) {
                month++;
            } else { // roll to Nissan
                month = JewishCalendar.NISSAN;
            }
        }

        // This method is only about formatting, so we shouldn't make any changes to the params passed in...
        jewishCalendar = jewishCalendar.clone() as JewishCalendar;
        jewishCalendar.setJewishMonth(month);
        formattedRoshChodesh = this.hebrewFormat ? HebrewDateFormatter.hebrewHolidays[JewishCalendar.ROSH_CHODESH]
                : this.transliteratedHolidays[JewishCalendar.ROSH_CHODESH];
        formattedRoshChodesh += " " + this.formatMonth(jewishCalendar);
        return formattedRoshChodesh;
    }

    /**
     * Returns if the formatter is set to use Hebrew formatting in the various formatting methods.
     *
     * @return the hebrewFormat
     * @see #setHebrewFormat(boolean)
     * @see #format(JewishDate)
     * @see #formatDayOfWeek(JewishDate)
     * @see #formatMonth(JewishDate)
     * @see #formatOmer(JewishCalendar)
     * @see #formatParsha(JewishCalendar)
     * @see #formatYomTov(JewishCalendar)
     */
    public isHebrewFormat(): boolean {
        return this.hebrewFormat;
    }

    /**
     * Sets the formatter to format in Hebrew in the various formatting methods.
     *
     * @param hebrewFormat
     *            the hebrewFormat to set
     * @see #isHebrewFormat()
     * @see #format(JewishDate)
     * @see #formatDayOfWeek(JewishDate)
     * @see #formatMonth(JewishDate)
     * @see #formatOmer(JewishCalendar)
     * @see #formatParsha(JewishCalendar)
     * @see #formatYomTov(JewishCalendar)
     */
    public setHebrewFormat(hebrewFormat: boolean): void {
        this.hebrewFormat = hebrewFormat;
    }

    /**
     * Returns the Hebrew Omer prefix. By default it is the letter &#x5D1;, but can be set to &#x5DC; (or any other
     * prefix) using the {@link #setHebrewOmerPrefix(String)}.
     *
     * @return the hebrewOmerPrefix
     *
     * @see #setHebrewOmerPrefix(String)
     * @see #formatOmer(JewishCalendar)
     */
    public getHebrewOmerPrefix(): string {
        return this.hebrewOmerPrefix;
    }

    /**
     * Method to set the Hebrew Omer prefix. By default it is the letter &#x5D1;, but this allows setting it to a
     * &#x5DC; (or any other prefix).
     *
     * @param hebrewOmerPrefix
     *            the hebrewOmerPrefix to set. You can use the Unicode &#92;u05DC to set it to &#x5DC;.
     * @see #getHebrewOmerPrefix()
     * @see #formatOmer(JewishCalendar)
     */
    public setHebrewOmerPrefix(hebrewOmerPrefix: string): void {
        this.hebrewOmerPrefix = hebrewOmerPrefix;
    }

    /**
     * Returns the list of months transliterated into Latin chars. The default list of months uses Ashkenazi
     * pronunciation in typical American English spelling. This list has a length of 14 with 3 variations for Adar -
     * "Adar", "Adar II", "Adar I"
     *
     * @return the list of months beginning in Nissan and ending in in "Adar", "Adar II", "Adar I". The default list is
     *         currently "Nissan", "Iyar", "Sivan", "Tammuz", "Av", "Elul", "Tishrei", "Cheshvan", "Kislev", "Teves",
     *         "Shevat", "Adar", "Adar II", "Adar I"
     * @see #setTransliteratedMonthList(String[])
     */
    public getTransliteratedMonthList(): string[] {
        return this.transliteratedMonths;
    }

    /**
     * Setter method to allow overriding of the default list of months transliterated into into Latin chars. The default
     * uses Ashkenazi American English transliteration.
     *
     * @param transliteratedMonths
     *            an array of 14 month names such as { "Nissan", "Iyar", "Sivan", "Tamuz", "Av", "Elul", "Tishrei",
     *            "Heshvan", "Kislev", "Tevet", "Shevat", "Adar", "Adar II", "Adar I" }
     * @see #getTransliteratedMonthList()
     */
    public setTransliteratedMonthList(transliteratedMonths: string[]): void {
        this.transliteratedMonths = transliteratedMonths;
    }

    /**
     * Unicode list of Hebrew months.
     *
     * @see #formatMonth(JewishDate)
     */
    private hebrewMonths: string[] = [ "\u05E0\u05D9\u05E1\u05DF", "\u05D0\u05D9\u05D9\u05E8",
            "\u05E1\u05D9\u05D5\u05DF", "\u05EA\u05DE\u05D5\u05D6", "\u05D0\u05D1", "\u05D0\u05DC\u05D5\u05DC",
            "\u05EA\u05E9\u05E8\u05D9", "\u05D7\u05E9\u05D5\u05D5\u05DF", "\u05DB\u05E1\u05DC\u05D5",
            "\u05D8\u05D1\u05EA", "\u05E9\u05D1\u05D8", "\u05D0\u05D3\u05E8", "\u05D0\u05D3\u05E8 \u05D1",
            "\u05D0\u05D3\u05E8 \u05D0" ];

    /**
     * list of transliterated parshiyos using the default Ashkenazi pronounciation. The formatParsha method uses this
     * for transliterated parsha display. This list can be overridden (for Sephardi English transliteration for example)
     * by setting the {@link #setTransliteratedParshiosList(String[])}.
     *
     * @see #formatParsha(JewishCalendar)
     */
    private transliteratedParshios: string[] = [ "Bereshis", "Noach", "Lech Lecha", "Vayera", "Chayei Sara", "Toldos",
            "Vayetzei", "Vayishlach", "Vayeshev", "Miketz", "Vayigash", "Vayechi", "Shemos", "Vaera", "Bo",
            "Beshalach", "Yisro", "Mishpatim", "Terumah", "Tetzaveh", "Ki Sisa", "Vayakhel", "Pekudei", "Vayikra",
            "Tzav", "Shmini", "Tazria", "Metzora", "Achrei Mos", "Kedoshim", "Emor", "Behar", "Bechukosai", "Bamidbar",
            "Nasso", "Beha'aloscha", "Sh'lach", "Korach", "Chukas", "Balak", "Pinchas", "Matos", "Masei", "Devarim",
            "Vaeschanan", "Eikev", "Re'eh", "Shoftim", "Ki Seitzei", "Ki Savo", "Nitzavim", "Vayeilech", "Ha'Azinu",
            "Vayakhel Pekudei", "Tazria Metzora", "Achrei Mos Kedoshim", "Behar Bechukosai", "Chukas Balak",
            "Matos Masei", "Nitzavim Vayeilech" ];

    /**
     * Retruns the list of transliterated parshiyos used by this formatter.
     *
     * @return the list of transliterated Parshios
     */
    public getTransliteratedParshiosList(): string[] {
        return this.transliteratedParshios;
    }

    /**
     * Setter method to allow overriding of the default list of parshiyos transliterated into into Latin chars. The
     * default uses Ashkenazi American English transliteration.
     *
     * @param transliteratedParshios
     *            the transliterated Parshios to set
     * @see #getTransliteratedParshiosList()
     */
    public setTransliteratedParshiosList(transliteratedParshios: string[]): void {
        this.transliteratedParshios = transliteratedParshios;
    }

    /**
     * Unicode list of Hebrew parshiyos.
     */
    private hebrewParshiyos: string[] = [ "\u05D1\u05E8\u05D0\u05E9\u05D9\u05EA", "\u05E0\u05D7",
            "\u05DC\u05DA \u05DC\u05DA", "\u05D5\u05D9\u05E8\u05D0", "\u05D7\u05D9\u05D9 \u05E9\u05E8\u05D4",
            "\u05EA\u05D5\u05DC\u05D3\u05D5\u05EA", "\u05D5\u05D9\u05E6\u05D0", "\u05D5\u05D9\u05E9\u05DC\u05D7",
            "\u05D5\u05D9\u05E9\u05D1", "\u05DE\u05E7\u05E5", "\u05D5\u05D9\u05D2\u05E9", "\u05D5\u05D9\u05D7\u05D9",

            "\u05E9\u05DE\u05D5\u05EA", "\u05D5\u05D0\u05E8\u05D0", "\u05D1\u05D0", "\u05D1\u05E9\u05DC\u05D7",
            "\u05D9\u05EA\u05E8\u05D5", "\u05DE\u05E9\u05E4\u05D8\u05D9\u05DD", "\u05EA\u05E8\u05D5\u05DE\u05D4",
            "\u05EA\u05E6\u05D5\u05D4", "\u05DB\u05D9 \u05EA\u05E9\u05D0", "\u05D5\u05D9\u05E7\u05D4\u05DC",
            "\u05E4\u05E7\u05D5\u05D3\u05D9",

            "\u05D5\u05D9\u05E7\u05E8\u05D0", "\u05E6\u05D5", "\u05E9\u05DE\u05D9\u05E0\u05D9",
            "\u05EA\u05D6\u05E8\u05D9\u05E2", "\u05DE\u05E6\u05E8\u05E2",
            "\u05D0\u05D7\u05E8\u05D9 \u05DE\u05D5\u05EA", "\u05E7\u05D3\u05D5\u05E9\u05D9\u05DD",
            "\u05D0\u05DE\u05D5\u05E8", "\u05D1\u05D4\u05E8", "\u05D1\u05D7\u05E7\u05EA\u05D9",

            "\u05D1\u05DE\u05D3\u05D1\u05E8", "\u05E0\u05E9\u05D0", "\u05D1\u05D4\u05E2\u05DC\u05EA\u05DA",
            "\u05E9\u05DC\u05D7 \u05DC\u05DA", "\u05E7\u05E8\u05D7", "\u05D7\u05D5\u05E7\u05EA", "\u05D1\u05DC\u05E7",
            "\u05E4\u05D9\u05E0\u05D7\u05E1", "\u05DE\u05D8\u05D5\u05EA", "\u05DE\u05E1\u05E2\u05D9",

            "\u05D3\u05D1\u05E8\u05D9\u05DD", "\u05D5\u05D0\u05EA\u05D7\u05E0\u05DF", "\u05E2\u05E7\u05D1",
            "\u05E8\u05D0\u05D4", "\u05E9\u05D5\u05E4\u05D8\u05D9\u05DD", "\u05DB\u05D9 \u05EA\u05E6\u05D0",
            "\u05DB\u05D9 \u05EA\u05D1\u05D5\u05D0", "\u05E0\u05D9\u05E6\u05D1\u05D9\u05DD",
            "\u05D5\u05D9\u05DC\u05DA", "\u05D4\u05D0\u05D6\u05D9\u05E0\u05D5",

            "\u05D5\u05D9\u05E7\u05D4\u05DC \u05E4\u05E7\u05D5\u05D3\u05D9",
            "\u05EA\u05D6\u05E8\u05D9\u05E2 \u05DE\u05E6\u05E8\u05E2",
            "\u05D0\u05D7\u05E8\u05D9 \u05DE\u05D5\u05EA \u05E7\u05D3\u05D5\u05E9\u05D9\u05DD",
            "\u05D1\u05D4\u05E8 \u05D1\u05D7\u05E7\u05EA\u05D9", "\u05D7\u05D5\u05E7\u05EA \u05D1\u05DC\u05E7",
            "\u05DE\u05D8\u05D5\u05EA \u05DE\u05E1\u05E2\u05D9",
            "\u05E0\u05D9\u05E6\u05D1\u05D9\u05DD \u05D5\u05D9\u05DC\u05DA" ];

    /**
     * Unicode list of Hebrew days of week.
     */
    private static readonly hebrewDaysOfWeek: string[] = [ "\u05E8\u05D0\u05E9\u05D5\u05DF", "\u05E9\u05E0\u05D9",
            "\u05E9\u05DC\u05D9\u05E9\u05D9", "\u05E8\u05D1\u05D9\u05E2\u05D9", "\u05D7\u05DE\u05D9\u05E9\u05D9",
            "\u05E9\u05E9\u05D9", "\u05E9\u05D1\u05EA" ];

    /**
     * Formats the day of week. If {@link #isHebrewFormat() Hebrew formatting} is set, it will display in the format
     * &#x05E8;&#x05D0;&#x05E9;&#x05D5;&#x05DF; etc. If Hebrew formatting is not in use it will return it in the format
     * of Sunday etc. There are various formatting options that will affect the output.
     *
     * @param jewishDate the JewishDate Object
     * @return the formatted day of week
     * @see #isHebrewFormat()
     * @see #isLongWeekFormat()
     */
    public formatDayOfWeek(jewishDate: JewishDate): string {
        if (this.hebrewFormat) {
            return (this.longWeekFormat ? HebrewDateFormatter.hebrewDaysOfWeek[jewishDate.getDayOfWeek() - 1] :
                this.formatHebrewNumber(jewishDate.getDayOfWeek()));
        } else {
            return jewishDate.getDayOfWeek() === 7 ? this.getTransliteratedShabbosDayOfWeek() : jewishDate.getMoment().format("EEEE");
        }
    }

    /**
     * If the formatter is set to format in Hebrew, returns a string of the current parsha(ios) in Hebrew for example
     * &#x05D1;&#x05E8;&#x05D0;&#x05E9;&#x05D9;&#x05EA; or &#x05E0;&#x05D9;&#x05E6;&#x05D1;&#x05D9;&#x05DD;
     * &#x05D5;&#x05D9;&#x05DC;&#x05DA; or an empty string if there are none. If not set to Hebrew, it returns a string
     * of the parsha(ios) transliterated into Latin chars. The default uses Ashkenazi pronunciation in typical American
     * English spelling, for example Bereshis or Nitzavim Vayeilech or an empty string if there are none.
     *
     * @param jewishCalendar the JewishCalendar Object
     * @return today's parsha(ios) in Hebrew for example, if the formatter is set to format in Hebrew, returns a string
     *         of the current parsha(ios) in Hebrew for example &#x05D1;&#x05E8;&#x05D0;&#x05E9;&#x05D9;&#x05EA; or
     *         &#x05E0;&#x05D9;&#x05E6;&#x05D1;&#x05D9;&#x05DD; &#x05D5;&#x05D9;&#x05DC;&#x05DA; or an empty string if
     *         there are none. If not set to Hebrew, it returns a string of the parsha(ios) transliterated into Latin
     *         chars. The default uses Ashkenazi pronunciation in typical American English spelling, for example
     *         Bereshis or Nitzavim Vayeilech or an empty string if there are none.
     */
/*
    public formatParsha(jewishCalendar: JewishCalendar): string {
        const index: number = jewishCalendar.getParshaIndex();
        return index === -1 ? "" : this.hebrewFormat ? this.hebrewParshiyos[index] : this.transliteratedParshios[index];
    }
*/

    /**
     * Returns a string of the parsha(ios) transliterated into Latin chars. The default uses Ashkenazi pronunciation in
     * typical American English spelling, for example Bereshis or Nitzavim Vayeilech or an empty string if there are
     * none.
     *
     * @param jewishCalendar the JewishCalendar Object
     * @return a string of the parsha(ios) transliterated into Latin chars. The default uses Ashkenazi pronunciation in
     *         typical American English spelling, for example Bereshis or Nitzavim Vayeilech or an empty string if there
     *         are none.
     */
    // private getTransliteratedParsha(JewishCalendar jewishCalendar): String {
    // return getTransliteratedParsha(jewishCalendar.getParshaIndex());
    // }

    /**
     * Returns whether the class is set to use the Geresh &#x5F3; and Gershayim &#x5F4; in formatting Hebrew dates and
     * numbers. When true and output would look like &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8;
     * &#x5EA;&#x5E9;&#x5DA;&#x5F3;. When set to false, this output would display as &#x5DB;&#x5D0; &#x5E9;&#x5D1;&#x5D8;
     * &#x5EA;&#x5E9;&#x5DA;.
     *
     * @return true if set to use the Geresh &#x5F3; and Gershayim &#x5F4; in formatting Hebrew dates and numbers.
     */
    public isUseGershGershayim(): boolean {
        return this.useGershGershayim;
    }

    /**
     * Sets whether to use the Geresh &#x5F3; and Gershayim &#x5F4; in formatting Hebrew dates and numbers. The default
     * value is true and output would look like &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8;
     * &#x5EA;&#x5E9;&#x5DA;&#x5F3;. When set to false, this output would display as &#x5DB;&#x5D0; &#x5E9;&#x5D1;&#x5D8;
     * &#x5EA;&#x5E9;&#x5DA;.
     *
     * @param useGershGershayim
     *            set to false to omit the Geresh &#x5F3; and Gershayim &#x5F4; in formatting
     */
    public setUseGershGershayim(useGershGershayim: boolean): void {
        this.useGershGershayim = useGershGershayim;
    }

    /**
     * Returns whether the class is set to use the thousands digit when formatting. When formatting a Hebrew Year,
     * traditionally the thousands digit is omitted and output for a year such as 5729 (1969 Gregorian) would be
     * calculated for 729 and format as &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;. When set to true the long format year such
     * as &#x5D4;&#x5F3; &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8; for 5729/1969 is returned.
     *
     * @return true if set to use the the thousands digit when formatting Hebrew dates and numbers.
     */
    public isUseLongHebrewYears(): boolean {
        return this.useLonghebrewYears;
    }

    /**
     * When formatting a Hebrew Year, traditionally the thousands digit is omitted and output for a year such as 5729
     * (1969 Gregorian) would be calculated for 729 and format as &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;. This method
     * allows setting this to true to return the long format year such as &#x5D4;&#x5F3;
     * &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8; for 5729/1969.
     *
     * @param useLongHebrewYears
     *            Set this to true to use the long formatting
     */
    public setUseLongHebrewYears(useLongHebrewYears: boolean): void {
        this.useLonghebrewYears = useLongHebrewYears;
    }

    /**
     * Formats the Jewish date. If the formatter is set to Hebrew, it will format in the form, "day Month year" for
     * example &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;, and the format
     * "21 Shevat, 5729" if not.
     *
     * @param jewishDate
     *            the JewishDate to be formatted
     * @return the formatted date. If the formatter is set to Hebrew, it will format in the form, "day Month year" for
     *         example &#x5DB;&#x5F4;&#x5D0; &#x5E9;&#x5D1;&#x5D8; &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;, and the format
     *         "21 Shevat, 5729" if not.
     */
    public format(jewishDate: JewishDate): string {
        if (this.isHebrewFormat()) {
            return this.formatHebrewNumber(jewishDate.getJewishDayOfMonth()) + " " + this.formatMonth(jewishDate) + " "
                    + this.formatHebrewNumber(jewishDate.getJewishYear());
        } else {
            return jewishDate.getJewishDayOfMonth() + " " + this.formatMonth(jewishDate) + ", " + jewishDate.getJewishYear();
        }
    }

    /**
     * Returns a string of the current Hebrew month such as "Tishrei". Returns a string of the current Hebrew month such
     * as "&#x5D0;&#x5D3;&#x5E8; &#x5D1;&#x5F3;".
     *
     * @param jewishDate
     *            the JewishDate to format
     * @return the formatted month name
     * @see #isHebrewFormat()
     * @see #setHebrewFormat(boolean)
     * @see #getTransliteratedMonthList()
     * @see #setTransliteratedMonthList(String[])
     */
    public formatMonth(jewishDate: JewishDate): string {
        const month: number = jewishDate.getJewishMonth();
        if (this.isHebrewFormat()) {
            if (jewishDate.isJewishLeapYear() && month === JewishDate.ADAR) {
                return this.hebrewMonths[13] + (this.useGershGershayim ? HebrewDateFormatter.GERESH : ""); // return Adar I, not Adar in a leap year
            } else if (jewishDate.isJewishLeapYear() && month === JewishDate.ADAR_II) {
                return this.hebrewMonths[12] + (this.useGershGershayim ? HebrewDateFormatter.GERESH : "");
            } else {
                return this.hebrewMonths[month - 1];
            }
        } else {
            if (jewishDate.isJewishLeapYear() && month === JewishDate.ADAR) {
                return this.transliteratedMonths[13]; // return Adar I, not Adar in a leap year
            } else {
                return this.transliteratedMonths[month - 1];
            }
        }
    }

    /**
     * Returns a String of the Omer day in the form &#x5DC;&#x5F4;&#x5D2; &#x5D1;&#x05E2;&#x05D5;&#x05DE;&#x5E8; if
     * Hebrew Format is set, or "Omer X" or "Lag BaOmer" if not. An empty string if there is no Omer this day.
     *
     * @param jewishCalendar
     *            the JewishCalendar to be formatted
     *
     * @return a String of the Omer day in the form or an empty string if there is no Omer this day. The default
     *         formatting has a &#x5D1;&#x5F3; prefix that would output &#x5D1;&#x05E2;&#x05D5;&#x05DE;&#x5E8;, but this
     *         can be set via the {@link #setHebrewOmerPrefix(String)} method to use a &#x5DC; and output
     *         &#x5DC;&#x5F4;&#x5D2; &#x5DC;&#x05E2;&#x05D5;&#x05DE;&#x5E8;.
     * @see #isHebrewFormat()
     * @see #getHebrewOmerPrefix()
     * @see #setHebrewOmerPrefix(String)
     */
    public formatOmer(jewishCalendar: JewishCalendar): string {
        const omer: number = jewishCalendar.getDayOfOmer();
        if (omer === -1) {
            return "";
        }
        if (this.hebrewFormat) {
            return this.formatHebrewNumber(omer) + " " + this.hebrewOmerPrefix + "\u05E2\u05D5\u05DE\u05E8";
        } else {
            if (omer === 33) { // if lag b'omer
                return "Lag BaOmer";
            } else {
                return "Omer " + omer;
            }
        }
    }

    /**
     * Experimental and incomplete
     *
     * @param moladChalakim
     * @return the formatted molad. FIXME: define proper format in English and Hebrew.
     */
    private formatMolad(moladChalakim: number): string {
        let adjustedChalakim: number = moladChalakim;
        const MINUTE_CHALAKIM: number = 18;
        const HOUR_CHALAKIM: number = 1080;
        const DAY_CHALAKIM: number = 24 * HOUR_CHALAKIM;

        let days: number = adjustedChalakim / DAY_CHALAKIM;
        adjustedChalakim = adjustedChalakim - (days * DAY_CHALAKIM);
        const hours: number = Math.trunc(adjustedChalakim / HOUR_CHALAKIM);
        if (hours >= 6) {
            days += 1;
        }
        adjustedChalakim = adjustedChalakim - (hours * HOUR_CHALAKIM);
        const minutes: number = Math.trunc(adjustedChalakim / MINUTE_CHALAKIM);
        adjustedChalakim = adjustedChalakim - minutes * MINUTE_CHALAKIM;
        return "Day: " + days % 7 + " hours: " + hours + ", minutes " + minutes + ", chalakim: " + adjustedChalakim;
    }

    /**
     * Returns the kviah in the traditional 3 letter Hebrew format where the first letter represents the day of week of
     * Rosh Hashana, the second letter represents the lengths of Cheshvan and Kislev ({@link JewishDate#SHELAIMIM
     * Shelaimim} , {@link JewishDate#KESIDRAN Kesidran} or {@link JewishDate#CHASERIM Chaserim}) and the 3rd letter
     * represents the day of week of Pesach. For example 5729 (1969) would return &#x5D1;&#x5E9;&#x5D4; (Rosh Hashana on
     * Monday, Shelaimim, and Pesach on Thursday), while 5771 (2011) would return &#x5D4;&#x5E9;&#x5D2; (Rosh Hashana on
     * Thursday, Shelaimim, and Pesach on Tuesday).
     *
     * @param jewishYear
     *            the Jewish year
     * @return the Hebrew String such as &#x5D1;&#x5E9;&#x5D4; for 5729 (1969) and &#x5D4;&#x5E9;&#x5D2; for 5771
     *         (2011).
     */
    public getFormattedKviah(jewishYear: number): string {
        const jewishDate: JewishDate = new JewishDate(jewishYear, JewishDate.TISHREI, 1); // set date to Rosh Hashana
        const kviah: number = jewishDate.getCheshvanKislevKviah();
        const roshHashanaDayOfweek: number = jewishDate.getDayOfWeek();
        let returnValue: string = this.formatHebrewNumber(roshHashanaDayOfweek);
        returnValue += (kviah === JewishDate.CHASERIM ? "\u05D7" : kviah === JewishDate.SHELAIMIM ? "\u05E9" : "\u05DB");
        jewishDate.setJewishDate(jewishYear, JewishDate.NISSAN, 15); // set to Pesach of the given year
        const pesachDayOfweek: number = jewishDate.getDayOfWeek();
        returnValue += this.formatHebrewNumber(pesachDayOfweek);
        returnValue = returnValue.replace(new RegExp(HebrewDateFormatter.GERESH, "g"), ""); // geresh is never used in the kviah format
        // boolean isLeapYear = JewishDate.isJewishLeapYear(jewishYear);
        // for efficiency we can avoid the expensive recalculation of the pesach day of week by adding 1 day to Rosh
        // Hashana for a 353 day year, 2 for a 354 day year, 3 for a 355 or 383 day year, 4 for a 384 day year and 5 for
        // a 385 day year
        return returnValue;
    }

    public formatDafYomiBavli(daf: Daf): string {
        if (this.hebrewFormat) {
            return daf.getMasechta() + " " + this.formatHebrewNumber(daf.getDaf());
        } else {
            return daf.getMasechtaTransliterated() + " " + daf.getDaf();
        }
    }

    public formatDafYomiYerushalmi(daf: Daf): string {
        if (this.hebrewFormat) {
            const dafName: string = daf.getDaf() === 0 ? "" : " " + this.formatHebrewNumber(daf.getDaf());
            return daf.getYerushalmiMasechta() + dafName;
        } else {
            const dafName: string = daf.getDaf() === 0 ? "" : " " + daf.getDaf();
            return daf.getYerushlmiMasechtaTransliterated() + dafName;
        }
    }

    /**
     * Returns a Hebrew formatted string of a number. The method can calculate from 0 - 9999.
     * <ul>
     * <li>Single digit numbers such as 3, 30 and 100 will be returned with a &#x5F3; (<a
     * href="http://en.wikipedia.org/wiki/Geresh">Geresh</a>) appended as at the end. For example &#x5D2;&#x5F3;,
     * &#x5DC;&#x5F3; and &#x5E7;&#x5F3;</li>
     * <li>multi digit numbers such as 21 and 769 will be returned with a &#x5F4; (<a
     * href="http://en.wikipedia.org/wiki/Gershayim">Gershayim</a>) between the second to last and last letters. For
     * example &#x5DB;&#x5F4;&#x5D0;, &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;</li>
     * <li>15 and 16 will be returned as &#x5D8;&#x5F4;&#x5D5; and &#x5D8;&#x5F4;&#x5D6;</li>
     * <li>Single digit numbers (years assumed) such as 6000 (%1000=0) will be returned as &#x5D5;&#x5F3;
     * &#x5D0;&#x5DC;&#x5E4;&#x5D9;&#x5DD;</li>
     * <li>0 will return &#x5D0;&#x5E4;&#x05E1;</li>
     * </ul>
     *
     * @param num
     *            the number to be formatted. It will trow an IllegalArgumentException if the number is &lt; 0 or &gt; 9999.
     * @return the Hebrew formatted number such as &#x5EA;&#x5E9;&#x5DB;&#x5F4;&#x5D8;
     *
     */
    public formatHebrewNumber(num: number): string {
        if (num !== Math.trunc(num)) throw new Error("IllegalArgumentException: number must be an integer.");

        if (num < 0) {
            throw new Error("IllegalArgumentException: negative numbers can't be formatted");
        } else if (num > 9999) {
            throw new Error("IllegalArgumentException: numbers > 9999 can't be formatted");
        }

        const ALAFIM: string = "\u05D0\u05DC\u05E4\u05D9\u05DD";
        const EFES: string = "\u05D0\u05E4\u05E1";

        const jHundreds: string[] = [ "", "\u05E7", "\u05E8", "\u05E9", "\u05EA", "\u05EA\u05E7", "\u05EA\u05E8",
                "\u05EA\u05E9", "\u05EA\u05EA", "\u05EA\u05EA\u05E7" ];
        const jTens: string[] = [ "", "\u05D9", "\u05DB", "\u05DC", "\u05DE", "\u05E0", "\u05E1", "\u05E2",
                "\u05E4", "\u05E6" ];
        const jTenEnds: string[] = [ "", "\u05D9", "\u05DA", "\u05DC", "\u05DD", "\u05DF", "\u05E1", "\u05E2",
                "\u05E3", "\u05E5" ];
        const tavTaz: string[] = [ "\u05D8\u05D5", "\u05D8\u05D6" ];
        const jOnes: string[] = ["", "\u05D0", "\u05D1", "\u05D2", "\u05D3", "\u05D4", "\u05D5", "\u05D6",
                "\u05D7", "\u05D8" ];

        if (num === 0) { // do we realy need this? Should it be applicable to a date?
            return EFES;
        }
        const shortNumber: number = num % 1000; // discard thousands
        // next check for all possible single Hebrew digit years
        const singleDigitNumber: boolean = (shortNumber < 11 || (shortNumber < 100 && shortNumber % 10 === 0) || (shortNumber <= 400 && shortNumber % 100 === 0));
        const thousands: number = Math.trunc(num / 1000); // get # thousands
        let sb: string = "";
        // append thousands to String
        if (num % 1000 === 0) { // in year is 5000, 4000 etc
            sb = sb.concat(jOnes[thousands]);
            if (this.isUseGershGershayim()) {
                sb = sb.concat(HebrewDateFormatter.GERESH);
            }
            sb = sb.concat(" ");
            sb = sb.concat(ALAFIM); // add # of thousands plus word thousand (overide alafim boolean)
            return sb;
        } else if (this.useLonghebrewYears && num >= 1000) { // if alafim boolean display thousands
            sb = sb.concat(jOnes[thousands]);
            if (this.isUseGershGershayim()) {
                sb = sb.concat(HebrewDateFormatter.GERESH); // append thousands quote
            }
            sb = sb.concat(" ");
        }
        num = num % 1000; // remove 1000s
        const hundreds: number = Math.trunc(num / 100); // # of hundreds
        sb = sb.concat(jHundreds[hundreds]); // add hundreds to String
        num = num % 100; // remove 100s
        if (num === 15) { // special case 15
            sb = sb.concat(tavTaz[0]);
        } else if (num === 16) { // special case 16
            sb = sb.concat(tavTaz[1]);
        } else {
            const tens: number = Math.trunc(num / 10);
            if (num % 10 === 0) { // if evenly divisable by 10
                if (singleDigitNumber === false) {
                    sb = sb.concat(jTenEnds[tens]); // end letters so years like 5750 will end with an end nun
                } else {
                    sb = sb.concat(jTens[tens]); // standard letters so years like 5050 will end with a regular nun
                }
            } else {
                sb = sb.concat(jTens[tens]);
                num = num % 10;
                sb = sb.concat(jOnes[num]);
            }
        }
        if (this.isUseGershGershayim()) {
            if (singleDigitNumber === true) {
                sb = sb.concat(HebrewDateFormatter.GERESH); // append single quote
            } else { // append double quote before last digit
                sb = sb.substr(0, sb.length - 1)
                    .concat(HebrewDateFormatter.GERSHAYIM)
                    .concat(sb.substr(sb.length - 1, sb.length - sb.length - 1));
            }
        }
        return sb;
    }
}

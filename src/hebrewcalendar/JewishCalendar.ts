import Calendar from "../polyfills/Calendar";
import GregorianCalendar from "../polyfills/GregorianCalendar";
import GeoLocation from "../util/GeoLocation";
import JewishDate from "./JewishDate";
import Daf from "./Daf";
import YomiCalculator from "./YomiCalculator";

/**
 * The JewishCalendar extends the JewishDate class and adds calendar methods.
 *
 * This open source Java code was originally ported by <a href="http://www.facebook.com/avromf">Avrom Finkelstien</a>
 * from his C++ code. It was refactored to fit the KosherJava Zmanim API with simplification of the code, enhancements
 * and some bug fixing.
 *
 * The class allows setting whether the holiday scheme follows the Israel scheme or outside Israel scheme. The default is the outside Israel scheme.
 *
 * TODO: Some do not belong in this class, but here is a partial list of what should still be implemented in some form:
 * <ol>
 * <li>Add Isru Chag</li>
 * <li>Shabbos Mevarchim</li>
 * <li>Daf Yomi Yerushalmi, Mishna yomis etc)</li>
 * </ol>
 *
 * @see java.util.Date
 * @see java.util.Calendar
 * @author &copy; Avrom Finkelstien 2002
 * @author &copy; Eliyahu Hershfeld 2011 - 2016
 * @version 1.0.0
 */
export default class JewishCalendar extends JewishDate {
    public static readonly EREV_PESACH: number = 0;
    public static readonly PESACH: number = 1;
    public static readonly CHOL_HAMOED_PESACH: number = 2;
    public static readonly PESACH_SHENI: number = 3;
    public static readonly EREV_SHAVUOS: number = 4;
    public static readonly SHAVUOS: number = 5;
    public static readonly SEVENTEEN_OF_TAMMUZ: number = 6;
    public static readonly TISHA_BEAV: number = 7;
    public static readonly TU_BEAV: number = 8;
    public static readonly EREV_ROSH_HASHANA: number = 9;
    public static readonly ROSH_HASHANA: number = 10;
    public static readonly FAST_OF_GEDALYAH: number = 11;
    public static readonly EREV_YOM_KIPPUR: number = 12;
    public static readonly YOM_KIPPUR: number = 13;
    public static readonly EREV_SUCCOS: number = 14;
    public static readonly SUCCOS: number = 15;
    public static readonly CHOL_HAMOED_SUCCOS: number = 16;
    public static readonly HOSHANA_RABBA: number = 17;
    public static readonly SHEMINI_ATZERES: number = 18;
    public static readonly SIMCHAS_TORAH: number = 19;
    // public static final int EREV_CHANUKAH = 20;// probably remove this
    public static readonly CHANUKAH: number = 21;
    public static readonly TENTH_OF_TEVES: number = 22;
    public static readonly TU_BESHVAT: number = 23;
    public static readonly FAST_OF_ESTHER: number = 24;
    public static readonly PURIM: number = 25;
    public static readonly SHUSHAN_PURIM: number = 26;
    public static readonly PURIM_KATAN: number = 27;
    public static readonly ROSH_CHODESH: number = 28;
    public static readonly YOM_HASHOAH: number = 29;
    public static readonly YOM_HAZIKARON: number = 30;
    public static readonly YOM_HAATZMAUT: number = 31;
    public static readonly YOM_YERUSHALAYIM: number = 32;

    private inIsrael: boolean = false;
    private useModernHolidays: boolean = false;

    /**
     * Is this calendar set to return modern Israeli national holidays. By default this value is false. The holidays
     * are: "Yom HaShoah", "Yom Hazikaron", "Yom Ha'atzmaut" and "Yom Yerushalayim"
     *
     * @return the useModernHolidays true if set to return modern Israeli national holidays
     */
    public isUseModernHolidays(): boolean {
        return this.useModernHolidays;
    }

    /**
     * Seth the calendar to return modern Israeli national holidays. By default this value is false. The holidays are:
     * "Yom HaShoah", "Yom Hazikaron", "Yom Ha'atzmaut" and "Yom Yerushalayim"
     *
     * @param useModernHolidays
     *            the useModernHolidays to set
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
    public JewishCalendar(jewishYear: number, jewishMonth: number, jewishDayOfMonth: number) {
        super(jewishYear, jewishMonth, jewishDayOfMonth);
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
    constructor(jewishYear: number, jewishMonth: number, jewishDayOfMonth: number, inIsrael: boolean)
    constructor(jewishYear: number, jewishMonth: number, jewishDayOfMonth: number)
    constructor(calendar: GregorianCalendar)
    constructor(date: Date)
    constructor()
    constructor(jewishYearOrCalendarOrDate?: number | GregorianCalendar | Date, jewishMonth?: number, jewishDayOfMonth?: number, inIsrael?: boolean) {
        super(jewishYearOrCalendarOrDate, jewishMonth, jewishDayOfMonth);
        if (inIsrael) this.setInIsrael(inIsrael);
    }

    /**
     * Sets whether to use Israel holiday scheme or not. Default is false.
     *
     * @param inIsrael
     *            set to true for calculations for Israel
     */
    public setInIsrael(inIsrael: boolean): void {
        this.inIsrael = inIsrael;
    }

    /**
     * Gets whether Israel holiday scheme is used or not. The default (if not set) is false.
     *
     * @return if the if the calendar is set to Israel
     */
    public getInIsrael(): boolean {
        return this.inIsrael;
    }

    /**
     * Returns an index of the Jewish holiday or fast day for the current day, or a null if there is no holiday for this
     * day.
     *
     * @return A String containing the holiday name or an empty string if it is not a holiday.
     */
    public getYomTovIndex(): number {
        // check by month (starts from Nissan)
        switch (this.getJewishMonth()) {
        case JewishCalendar.NISSAN:
            if (this.getJewishDayOfMonth() === 14) {
                return JewishCalendar.EREV_PESACH;
            } else if (this.getJewishDayOfMonth() === 15 || this.getJewishDayOfMonth() === 21
                    || (!this.inIsrael && (this.getJewishDayOfMonth() === 16 || this.getJewishDayOfMonth() === 22))) {
                return JewishCalendar.PESACH;
            } else if (this.getJewishDayOfMonth() >= 17 && this.getJewishDayOfMonth() <= 20
                    || (this.getJewishDayOfMonth() === 16 && this.inIsrael)) {
                return JewishCalendar.CHOL_HAMOED_PESACH;
            }
            if (this.isUseModernHolidays()
                    && ((this.getJewishDayOfMonth() === 26 && this.getDayOfWeek() === 5)
                            || (this.getJewishDayOfMonth() === 28 && this.getDayOfWeek() === 1)
                            || (this.getJewishDayOfMonth() === 27 && this.getDayOfWeek() !== 1 && this.getDayOfWeek() !== 6))) {
                return JewishCalendar.YOM_HASHOAH;
            }
            break;
        case JewishCalendar.IYAR:
            if (this.isUseModernHolidays()
                    && ((this.getJewishDayOfMonth() === 4 && this.getDayOfWeek() === 3)
                            || ((this.getJewishDayOfMonth() === 3 || this.getJewishDayOfMonth() === 2) && this.getDayOfWeek() === 4) || (this.getJewishDayOfMonth() === 5 && this.getDayOfWeek() === 2))) {
                return JewishCalendar.YOM_HAZIKARON;
            }
            // if 5 Iyar falls on Wed Yom Haatzmaut is that day. If it fal1s on Friday or Shabbos it is moved back to
            // Thursday. If it falls on Monday it is moved to Tuesday
            if (this.isUseModernHolidays()
                    && ((this.getJewishDayOfMonth() === 5 && this.getDayOfWeek() === 4)
                            || ((this.getJewishDayOfMonth() === 4 || this.getJewishDayOfMonth() === 3) && this.getDayOfWeek() === 5) || (this.getJewishDayOfMonth() === 6 && this.getDayOfWeek() === 3))) {
                return JewishCalendar.YOM_HAATZMAUT;
            }
            if (this.getJewishDayOfMonth() === 14) {
                return JewishCalendar.PESACH_SHENI;
            }
            if (this.isUseModernHolidays() && this.getJewishDayOfMonth() === 28) {
                return JewishCalendar.YOM_YERUSHALAYIM;
            }
            break;
        case JewishCalendar.SIVAN:
            if (this.getJewishDayOfMonth() === 5) {
                return JewishCalendar.EREV_SHAVUOS;
            } else if (this.getJewishDayOfMonth() === 6 || (this.getJewishDayOfMonth() === 7 && !this.inIsrael)) {
                return JewishCalendar.SHAVUOS;
            }
            break;
        case JewishCalendar.TAMMUZ:
            // push off the fast day if it falls on Shabbos
            if ((this.getJewishDayOfMonth() === 17 && this.getDayOfWeek() !== 7)
                    || (this.getJewishDayOfMonth() === 18 && this.getDayOfWeek() === 1)) {
                return JewishCalendar.SEVENTEEN_OF_TAMMUZ;
            }
            break;
        case JewishCalendar.AV:
            // if Tisha B'av falls on Shabbos, push off until Sunday
            if ((this.getDayOfWeek() === 1 && this.getJewishDayOfMonth() === 10)
                    || (this.getDayOfWeek() !== 7 && this.getJewishDayOfMonth() === 9)) {
                return JewishCalendar.TISHA_BEAV;
            } else if (this.getJewishDayOfMonth() === 15) {
                return JewishCalendar.TU_BEAV;
            }
            break;
        case JewishCalendar.ELUL:
            if (this.getJewishDayOfMonth() === 29) {
                return JewishCalendar.EREV_ROSH_HASHANA;
            }
            break;
        case JewishCalendar.TISHREI:
            if (this.getJewishDayOfMonth() === 1 || this.getJewishDayOfMonth() === 2) {
                return JewishCalendar.ROSH_HASHANA;
            } else if ((this.getJewishDayOfMonth() === 3 && this.getDayOfWeek() !== 7)
                    || (this.getJewishDayOfMonth() === 4 && this.getDayOfWeek() === 1)) {
                // push off Tzom Gedalia if it falls on Shabbos
                return JewishCalendar.FAST_OF_GEDALYAH;
            } else if (this.getJewishDayOfMonth() === 9) {
                return JewishCalendar.EREV_YOM_KIPPUR;
            } else if (this.getJewishDayOfMonth() === 10) {
                return JewishCalendar.YOM_KIPPUR;
            } else if (this.getJewishDayOfMonth() === 14) {
                return JewishCalendar.EREV_SUCCOS;
            }
            if (this.getJewishDayOfMonth() === 15 || (this.getJewishDayOfMonth() === 16 && !this.inIsrael)) {
                return JewishCalendar.SUCCOS;
            }
            if (this.getJewishDayOfMonth() >= 17 && this.getJewishDayOfMonth() <= 20 || (this.getJewishDayOfMonth() === 16 && this.inIsrael)) {
                return JewishCalendar.CHOL_HAMOED_SUCCOS;
            }
            if (this.getJewishDayOfMonth() === 21) {
                return JewishCalendar.HOSHANA_RABBA;
            }
            if (this.getJewishDayOfMonth() === 22) {
                return JewishCalendar.SHEMINI_ATZERES;
            }
            if (this.getJewishDayOfMonth() === 23 && !this.inIsrael) {
                return JewishCalendar.SIMCHAS_TORAH;
            }
            break;
        case JewishCalendar.KISLEV: // no yomtov in CHESHVAN
            // if (getJewishDayOfMonth() == 24) {
            // return EREV_CHANUKAH;
            // } else
            if (this.getJewishDayOfMonth() >= 25) {
                return JewishCalendar.CHANUKAH;
            }
            break;
        case JewishCalendar.TEVES:
            if (this.getJewishDayOfMonth() === 1 || this.getJewishDayOfMonth() === 2
                    || (this.getJewishDayOfMonth() === 3 && this.isKislevShort())) {
                return JewishCalendar.CHANUKAH;
            } else if (this.getJewishDayOfMonth() === 10) {
                return JewishCalendar.TENTH_OF_TEVES;
            }
            break;
        case JewishCalendar.SHEVAT:
            if (this.getJewishDayOfMonth() === 15) {
                return JewishCalendar.TU_BESHVAT;
            }
            break;
        case JewishCalendar.ADAR:
            if (!this.isJewishLeapYear()) {
                // if 13th Adar falls on Friday or Shabbos, push back to Thursday
                if (((this.getJewishDayOfMonth() === 11 || this.getJewishDayOfMonth() === 12) && this.getDayOfWeek() === 5)
                        || (this.getJewishDayOfMonth() === 13 && !(this.getDayOfWeek() === 6 || this.getDayOfWeek() === 7))) {
                    return JewishCalendar.FAST_OF_ESTHER;
                }
                if (this.getJewishDayOfMonth() === 14) {
                    return JewishCalendar.PURIM;
                } else if (this.getJewishDayOfMonth() === 15) {
                    return JewishCalendar.SHUSHAN_PURIM;
                }
            } else { // else if a leap year
                if (this.getJewishDayOfMonth() === 14) {
                    return JewishCalendar.PURIM_KATAN;
                }
            }
            break;
        case JewishCalendar.ADAR_II:
            // if 13th Adar falls on Friday or Shabbos, push back to Thursday
            if (((this.getJewishDayOfMonth() === 11 || this.getJewishDayOfMonth() === 12) && this.getDayOfWeek() === 5)
                    || (this.getJewishDayOfMonth() === 13 && !(this.getDayOfWeek() === 6 || this.getDayOfWeek() === 7))) {
                return JewishCalendar.FAST_OF_ESTHER;
            }
            if (this.getJewishDayOfMonth() === 14) {
                return JewishCalendar.PURIM;
            } else if (this.getJewishDayOfMonth() === 15) {
                return JewishCalendar.SHUSHAN_PURIM;
            }
            break;
        }
        // if we get to this stage, then there are no holidays for the given date return -1
        return -1;
    }

    /**
     * Returns true if the current day is Yom Tov. The method returns false for Chanukah, Erev Yom Tov (with the
     * exception of Hoshana Rabba and Erev the second days of Pesach) and fast days.
     *
     * @return true if the current day is a Yom Tov
     * @see #isErevYomTov()
     * @see #isTaanis()
     */
    public isYomTov(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        if ((this.isErevYomTov() && (holidayIndex !== JewishCalendar.HOSHANA_RABBA && (holidayIndex === JewishCalendar.CHOL_HAMOED_PESACH && this.getJewishDayOfMonth() !== 20)))
                || holidayIndex === JewishCalendar.CHANUKAH || (this.isTaanis() && holidayIndex !== JewishCalendar.YOM_KIPPUR)) {
            return false;
        }
        return this.getYomTovIndex() !== -1;
    }

    /**
     * Returns true if the Yom Tov day has a melacha (work)  prohibition. This method will return false for a non Yom Tov day, even if it is Shabbos.
     *
     * @return if the Yom Tov day has a melacha (work)  prohibition.
     */
    public isYomTovAssurBemelacha(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        return holidayIndex === JewishCalendar.PESACH || holidayIndex === JewishCalendar.SHAVUOS || holidayIndex === JewishCalendar.SUCCOS || holidayIndex === JewishCalendar.SHEMINI_ATZERES ||
                holidayIndex === JewishCalendar.SIMCHAS_TORAH || holidayIndex === JewishCalendar.ROSH_HASHANA  || holidayIndex === JewishCalendar.YOM_KIPPUR;
    }

    /**
     * Returns true if the current day is Chol Hamoed of Pesach or Succos.
     *
     * @return true if the current day is Chol Hamoed of Pesach or Succos
     * @see #isYomTov()
     * @see #CHOL_HAMOED_PESACH
     * @see #CHOL_HAMOED_SUCCOS
     */
    public isCholHamoed(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        return holidayIndex === JewishCalendar.CHOL_HAMOED_PESACH || holidayIndex === JewishCalendar.CHOL_HAMOED_SUCCOS;
    }

    /**
     * Returns true if the current day is erev Yom Tov. The method returns true for Erev - Pesach (first and last days),
     * Shavuos, Rosh Hashana, Yom Kippur and Succos and Hoshana Rabba.
     *
     * @return true if the current day is Erev - Pesach, Shavuos, Rosh Hashana, Yom Kippur and Succos
     * @see #isYomTov()
     */
    public isErevYomTov(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        return holidayIndex === JewishCalendar.EREV_PESACH || holidayIndex === JewishCalendar.EREV_SHAVUOS || holidayIndex === JewishCalendar.EREV_ROSH_HASHANA
                || holidayIndex === JewishCalendar.EREV_YOM_KIPPUR || holidayIndex === JewishCalendar.EREV_SUCCOS || holidayIndex === JewishCalendar.HOSHANA_RABBA
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
     * Return true if the day is a Taanis (fast day). Return true for 17 of Tammuz, Tisha B'Av, Yom Kippur, Fast of
     * Gedalyah, 10 of Teves and the Fast of Esther
     *
     * @return true if today is a fast day
     */
    public isTaanis(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        return holidayIndex === JewishCalendar.SEVENTEEN_OF_TAMMUZ || holidayIndex === JewishCalendar.TISHA_BEAV || holidayIndex === JewishCalendar.YOM_KIPPUR
                || holidayIndex === JewishCalendar.FAST_OF_GEDALYAH || holidayIndex === JewishCalendar.TENTH_OF_TEVES || holidayIndex === JewishCalendar.FAST_OF_ESTHER;
    }

    /**
     * Returns the day of Chanukah or -1 if it is not Chanukah.
     *
     * @return the day of Chanukah or -1 if it is not Chanukah.
     */
    public getDayOfChanukah(): number {
        if (this.isChanukah()) {
            if (this.getJewishMonth() === JewishCalendar.KISLEV) {
                return this.getJewishDayOfMonth() - 24;
            } else { // teves
                return this.isKislevShort() ? this.getJewishDayOfMonth() + 5 : this.getJewishDayOfMonth() + 6;
            }
        } else {
            return -1;
        }
    }

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
     * Returns the int value of the Omer day or -1 if the day is not in the omer
     *
     * @return The Omer count as an int or -1 if it is not a day of the Omer.
     */
    public getDayOfOmer(): number {
        let omer: number = -1; // not a day of the Omer

        // if Nissan and second day of Pesach and on
        if (this.getJewishMonth() === JewishCalendar.NISSAN && this.getJewishDayOfMonth() >= 16) {
            omer = this.getJewishDayOfMonth() - 15;
            // if Iyar
        } else if (this.getJewishMonth() === JewishCalendar.IYAR) {
            omer = this.getJewishDayOfMonth() + 15;
            // if Sivan and before Shavuos
        } else if (this.getJewishMonth() === JewishCalendar.SIVAN && this.getJewishDayOfMonth() < 6) {
            omer = this.getJewishDayOfMonth() + 44;
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
    public getMoladAsDate(): Date {
        const molad: JewishDate = this.getMolad();
        const locationName: string = "Jerusalem, Israel";

        const latitude: number = 31.778; // Har Habayis latitude
        const longitude: number = 35.2354; // Har Habayis longitude

        // The molad calculation always extepcst output in standard time. Using "Asia/Jerusalem" timezone will incorrect
        // adjust for DST.
        const yerushalayimStandardTZ: string = "Israel";
        const geo: GeoLocation = new GeoLocation(locationName, latitude, longitude, yerushalayimStandardTZ);
        const cal: GregorianCalendar = new GregorianCalendar(geo.getTimeZone());
        //cal.clear();
        const moladSeconds: number = molad.getMoladChalakim() * 10 / 3;
        cal.set(molad.getGregorianYear(), molad.getGregorianMonth(), molad.getGregorianDayOfMonth(),
                molad.getMoladHours(), molad.getMoladMinutes(), Math.trunc(moladSeconds));
        cal.set(Calendar.MILLISECOND, Math.trunc(1000 * (moladSeconds - Math.trunc(moladSeconds))));
        // subtract local time difference of 20.94 minutes (20 minutes and 56.496 seconds) to get to Standard time
        cal.add(Calendar.MILLISECOND, -1 * Math.trunc(geo.getLocalMeanTimeOffset()));
        return cal.getTime();
    }

    /**
     * Returns the earliest time of Kiddush Levana calculated as 3 days after the molad. TODO: Currently returns the
     * time even if it is during the day. It should return the
     * {@link net.sourceforge.zmanim.ZmanimCalendar#getTzais72() Tzais} after to the time if the zman is between Alos
     * and Tzais.
     *
     * @return the Date representing the moment 3 days after the molad.
     */
    public getTchilasZmanKidushLevana3Days(): Date {
        const molad: Date = this.getMoladAsDate();
        const cal: GregorianCalendar = new GregorianCalendar();
        cal.setTime(molad);
        cal.add(Calendar.HOUR, 72); // 3 days after the molad
        return cal.getTime();
    }

    /**
     * Returns the earliest time of Kiddush Levana calculated as 7 days after the molad as mentioned by the <a
     * href="http://en.wikipedia.org/wiki/Yosef_Karo">Mechaber</a>. See the <a
     * href="http://en.wikipedia.org/wiki/Yoel_Sirkis">Bach's</a> opinion on this time. TODO: Currently returns the time
     * even if it is during the day. It should return the {@link net.sourceforge.zmanim.ZmanimCalendar#getTzais72()
     * Tzais} after to the time if the zman is between Alos and Tzais.
     *
     * @return the Date representing the moment 7 days after the molad.
     */
    public getTchilasZmanKidushLevana7Days(): Date {
        const molad: Date = this.getMoladAsDate();
        const cal: GregorianCalendar = new GregorianCalendar();
        cal.setTime(molad);
        cal.add(Calendar.HOUR, 168); // 7 days after the molad
        return cal.getTime();
    }

    /**
     * Returns the latest time of Kiddush Levana according to the <a
     * href="http://en.wikipedia.org/wiki/Yaakov_ben_Moshe_Levi_Moelin">Maharil's</a> opinion that it is calculated as
     * halfway between molad and molad. This adds half the 29 days, 12 hours and 793 chalakim time between molad and
     * molad (14 days, 18 hours, 22 minutes and 666 milliseconds) to the month's molad. TODO: Currently returns the time
     * even if it is during the day. It should return the {@link net.sourceforge.zmanim.ZmanimCalendar#getAlos72() Alos}
     * prior to the time if the zman is between Alos and Tzais.
     *
     * @return the Date representing the moment halfway between molad and molad.
     * @see #getSofZmanKidushLevana15Days()
     */
    public getSofZmanKidushLevanaBetweenMoldos(): Date {
        const molad: Date = this.getMoladAsDate();
        const cal: GregorianCalendar = new GregorianCalendar();
        cal.setTime(molad);
        // add half the time between molad and molad (half of 29 days, 12 hours and 793 chalakim (44 minutes, 3.3
        // seconds), or 14 days, 18 hours, 22 minutes and 666 milliseconds)
        cal.add(Calendar.DAY_OF_MONTH, 14);
        cal.add(Calendar.HOUR_OF_DAY, 18);
        cal.add(Calendar.MINUTE, 22);
        cal.add(Calendar.SECOND, 1);
        cal.add(Calendar.MILLISECOND, 666);
        return cal.getTime();
    }

    /**
     * Returns the latest time of Kiddush Levana calculated as 15 days after the molad. This is the opinion brought down
     * in the Shulchan Aruch (Orach Chaim 426). It should be noted that some opinions hold that the
     * <a href="http://en.wikipedia.org/wiki/Moses_Isserles">Rema</a> who brings down the opinion of the <a
     * href="http://en.wikipedia.org/wiki/Yaakov_ben_Moshe_Levi_Moelin">Maharil's</a> of calculating
     * {@link #getSofZmanKidushLevanaBetweenMoldos() half way between molad and mold} is of the opinion that Mechaber
     * agrees to his opinion. Also see the Aruch Hashulchan. For additional details on the subject, See Rabbi Dovid
     * Heber's very detailed writeup in Siman Daled (chapter 4) of <a
     * href="http://www.worldcat.org/oclc/461326125">Shaarei Zmanim</a>. TODO: Currently returns the time even if it is
     * during the day. It should return the {@link net.sourceforge.zmanim.ZmanimCalendar#getAlos72() Alos} prior to the
     * time if the zman is between Alos and Tzais.
     *
     * @return the Date representing the moment 15 days after the molad.
     * @see #getSofZmanKidushLevanaBetweenMoldos()
     */
    public getSofZmanKidushLevana15Days(): Date {
        const molad: Date = this.getMoladAsDate();
        const cal: GregorianCalendar = new GregorianCalendar();
        cal.setTime(molad);
        cal.add(Calendar.DAY_OF_YEAR, 15); // 15 days after the molad
        return cal.getTime();
    }

    /**
     * Returns the Daf Yomi (Bavli) for the date that the calendar is set to. See the
     * {@link HebrewDateFormatter#formatDafYomiBavli(Daf)} for the ability to format the daf in Hebrew or transliterated
     * masechta names.
     *
     * @return the daf as a {@link Daf}
     */
    public getDafYomiBavli(): Daf {
        return YomiCalculator.getDafYomiBavli(this.getGregorianCalendar());
    }

    /**
     * @see Object#equals(Object)
     */
    public equals(object: object): boolean {
        if (this === object) {
            return true;
        }
        if (!(object instanceof JewishCalendar)) {
            return false;
        }
        const jewishCalendar: JewishCalendar = object as JewishCalendar;
        return this.getAbsDate() === jewishCalendar.getAbsDate() && this.getInIsrael() === jewishCalendar.getInIsrael();
    }

    /**
     * @see Object#hashCode()
     */
/*
    public hashCode(): number {
        let result: number = 17;
        result = 37 * result + getClass().hashCode(); // needed or this and subclasses will return identical hash
        result += 37 * result + this.getAbsDate() + (this.getInIsrael() ? 1 : 3);
        return result;
    }
*/
}

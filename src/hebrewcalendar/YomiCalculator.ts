import {Calendar} from "../polyfills/Utils";
import {Daf} from "./Daf";
import {JewishCalendar} from "./JewishCalendar";
import { DateTime } from "luxon";

/**
 * This class calculates the Daf Yomi Bavli page (daf) for a given date. To calculate Daf Yomi Yerushalmi
 * use the {@link YerushalmiYomiCalculator}. The library may cover Mishna Yomi etc. at some point in the future.
 *
 * @author &copy; Bob Newell (original C code)
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 * @version 0.0.1
 */
export class YomiCalculator {
    // TODO: readonly for all?
    private static dafYomiStartDate: DateTime = DateTime.fromObject({ year: 1923, month: Calendar.SEPTEMBER + 1, day: 11 });
    private static dafYomiJulianStartDay: number = YomiCalculator.getJulianDay(YomiCalculator.dafYomiStartDate);
    private static shekalimChangeDate: DateTime = DateTime.fromObject({ year: 1975, month: Calendar.JUNE + 1, day: 24 });
    private static shekalimJulianChangeDay: number = YomiCalculator.getJulianDay(YomiCalculator.shekalimChangeDate);

    /**
     * Returns the <a href="http://en.wikipedia.org/wiki/Daf_yomi">Daf Yomi</a> <a
     * href="http://en.wikipedia.org/wiki/Talmud">Bavli</a> {@link Daf} for a given date. The first Daf Yomi cycle
     * started on Rosh Hashana 5684 (September 11, 1923) and calculations prior to this date will result in an
     * IllegalArgumentException thrown. For historical calculations (supported by this method), it is important to note
     * that a change in length of the cycle was instituted starting in the eighth Daf Yomi cycle beginning on June 24,
     * 1975. The Daf Yomi Bavli cycle has a single masechta of the Talmud Yerushalmi - Shekalim as part of the cycle.
     * Unlike the Bavli where the number of daf per masechta was standardized since the original <a
     * href="http://en.wikipedia.org/wiki/Daniel_Bomberg">Bomberg Edition</a> published from 1520 - 1523, there is no
     * uniform page length in the Yerushalmi. The early cycles had the Yerushalmi Shekalim length of 13 days following the
     * <a href=
     * "https://he.wikipedia.org/wiki/%D7%93%D7%A4%D7%95%D7%A1_%D7%A1%D7%9C%D7%90%D7%95%D7%95%D7%99%D7%98%D7%90">Slavuta/Zhytomyr</a>
     * Shas used by <a href="http://en.wikipedia.org/wiki/Meir_Shapiro">Rabbi Meir Shapiro</a>. With the start of the eighth Daf Yomi
     * cycle beginning on June 24, 1975 the length of the Yerushalmi Shekalim was changed from 13 to 22 daf to follow
     * the <a href="https://en.wikipedia.org/wiki/Vilna_Edition_Shas">Vilna Shas</a> that is in common use today.
     *
     * @param calendar
     *            the calendar date for calculation
     * @return the {@link Daf}.
     *
     * @throws IllegalArgumentException
     *             if the date is prior to the September 11, 1923 start date of the first Daf Yomi cycle
     */
    public static getDafYomiBavli(calendar: JewishCalendar): Daf {
        /*
         * The number of daf per masechta. Since the number of blatt in Shekalim changed on the 8th Daf Yomi cycle
         * beginning on June 24, 1975 from 13 to 22, the actual calculation for blattPerMasechta[4] will later be
         * adjusted based on the cycle.
         */
        const blattPerMasechta: number[] = [ 64, 157, 105, 121, 22, 88, 56, 40, 35, 31, 32, 29, 27, 122, 112, 91, 66, 49, 90, 82,
                119, 119, 176, 113, 24, 49, 76, 14, 120, 110, 142, 61, 34, 34, 28, 22, 4, 9, 5, 73 ];

        const date: DateTime = calendar.getDate();

        let dafYomi: Daf;
        const julianDay: number = this.getJulianDay(date);
        let cycleNo: number = 0;
        let dafNo: number = 0;
        if (date < YomiCalculator.dafYomiStartDate) {
            // TODO: should we return a null or throw an IllegalArgumentException?
            throw new Error(`IllegalArgumentException: ${calendar} is prior to organized Daf Yomi Bavli cycles that started on ${YomiCalculator.dafYomiStartDate}`);
        }
        if ((date > YomiCalculator.shekalimChangeDate) || date.equals(YomiCalculator.shekalimChangeDate)) {
            cycleNo = 8 + ((julianDay - YomiCalculator.shekalimJulianChangeDay) / 2711);
            dafNo = ((julianDay - YomiCalculator.shekalimJulianChangeDay) % 2711);
        } else {
            cycleNo = 1 + ((julianDay - YomiCalculator.dafYomiJulianStartDay) / 2702);
            dafNo = ((julianDay - YomiCalculator.dafYomiJulianStartDay) % 2702);
        }

        let total: number = 0;
        let masechta: number = -1;
        let blatt: number = 0;

        /* Fix Shekalim for old cycles. */
        if (cycleNo <= 7) {
            blattPerMasechta[4] = 13;
        } else {
            blattPerMasechta[4] = 22; // correct any change that may have been changed from a prior calculation
        }
        /* Finally find the daf. */
        for (const blattInMasechta of blattPerMasechta) {
            masechta++;
            total = total + blattInMasechta - 1;
            if (dafNo < total) {
                blatt = 1 + blattInMasechta - (total - dafNo);
                /* Fiddle with the weird ones near the end. */
                if (masechta === 36) {
                    blatt += 21;
                } else if (masechta === 37) {
                    blatt += 24;
                } else if (masechta === 38) {
                    blatt += 32;
                }
                dafYomi = new Daf(masechta, blatt);
                break;
            }
        }

        return dafYomi!;
    }

    /**
     * Return the <a href="http://en.wikipedia.org/wiki/Julian_day">Julian day</a> from a Java Date.
     *
     * @param date
     *            The Java Date
     * @return the Julian day number corresponding to the date
     */
    private static getJulianDay(date: DateTime): number {
        let year: number = date.year;
        let month: number = date.month;
        const day: number = date.day;
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        const a: number = Math.trunc(year / 100);
        const b: number = 2 - a + Math.trunc(a / 4);
        return Math.trunc(Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5);
    }
}

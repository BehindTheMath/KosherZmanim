import * as MomentTimezone from "moment-timezone";
import Moment = MomentTimezone.Moment;
import timezones, {Timezone} from 'timezones.json';

export namespace Utils {
    // https://stackoverflow.com/a/40577337/8037425
    export function getAllMethodNames(obj: object, excludeContructors: boolean = false): Array<string> {
        // let methods: Array<string> = [];
        const methods: Set<string> = new Set();

        while ((obj = Reflect.getPrototypeOf(obj)) && Reflect.getPrototypeOf(obj)) {
            const keys: Array<string> = Reflect.ownKeys(obj) as Array<string>;
            // methods = methods.concat(keys);
            keys.filter((key: string) => !excludeContructors || key !== "constructor")
                .forEach((key: string) => methods.add(key));
        }

        return Array.from(methods)
        // Convert Symbols to strings, if there are any
            .map(value => value.toString())
            .sort();
    }
}

export namespace TimeZone {
    /**
     * Returns the amount of time in milliseconds to add to UTC to get
     * standard time in this time zone. Because this value is not
     * affected by daylight saving time, it is called <I>raw
     * offset</I>.
     *
     * @return the amount of raw offset time in milliseconds to add to UTC.
     */
    // TODO: This will return the current DST status, as opposed to Java which returns non-DST
    export function getRawOffset(momentOrTimeZoneId: Moment | string): number {
        const moment: Moment = MomentTimezone.isMoment(momentOrTimeZoneId) ?
            momentOrTimeZoneId : MomentTimezone.tz(momentOrTimeZoneId);

        const dstOffsetMinutes = moment.isDST() ? 60 : 0;
        const offsetMinutes: number = moment.utcOffset() - dstOffsetMinutes;
        return offsetMinutes * 60 * 1000;
    }

    export function getDisplayName(timeZoneId: string, short: boolean = false): string {
        const timezone: Timezone = timezones
            .filter((timezone: Timezone) => timezone.hasOwnProperty("utc") &&
                timezone.utc.indexOf(timeZoneId) !== -1)[0];
        return short ? timezone.abbr : timezone.value;
    }

/*
    export function getDSTSavings(): number {}
*/

    export function getOffset(timeZoneId: string, millisSinceEpoch: number): number {
        return MomentTimezone(millisSinceEpoch).tz(timeZoneId).utcOffset() * 60 * 1000;
    }
}

export namespace Calendar {
    export const JANUARY: number = 0;
    export const FEBRUARY: number = 1;
    export const MARCH: number = 2;
    export const APRIL: number = 3;
    export const MAY: number = 4;
    export const JUNE: number = 5;
    export const JULY: number = 6;
    export const AUGUST: number = 7;
    export const SEPTEMBER: number = 8;
    export const OCTOBER: number = 9;
    export const NOVEMBER: number = 10;
    export const DECEMBER: number = 11;

    export const DATE = 5;
    export const MONTH = 2;
    export const YEAR = 1;

    export function getZoneOffset(moment: Moment): number {
        return moment.utcOffset() * 1000;
    }

    export function getDstOffset(moment: Moment): number {
        return moment.isDST() ? 60 * 60 * 1000 : 0;
    }
}

export namespace MathUtils {
    export function degreesToRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    export function radiansToDegrees(radians: number): number {
        return radians * 180 / Math.PI;
    }
}

export namespace StringUtils {
    /**
     * Compares two strings lexicographically.
     * The comparison is based on the Unicode value of each character in
     * the strings. The character sequence represented by this
     * {@code String} object is compared lexicographically to the
     * character sequence represented by the argument string. The result is
     * a negative integer if this {@code String} object
     * lexicographically precedes the argument string. The result is a
     * positive integer if this {@code String} object lexicographically
     * follows the argument string. The result is zero if the strings
     * are equal; {@code compareTo} returns {@code 0} exactly when
     * the {@link #equals(Object)} method would return {@code true}.
     * <p>
     * This is the definition of lexicographic ordering. If two strings are
     * different, then either they have different characters at some index
     * that is a valid index for both strings, or their lengths are different,
     * or both. If they have different characters at one or more index
     * positions, let <i>k</i> be the smallest such index; then the string
     * whose character at position <i>k</i> has the smaller value, as
     * determined by using the &lt; operator, lexicographically precedes the
     * other string. In this case, {@code compareTo} returns the
     * difference of the two character values at position {@code k} in
     * the two string -- that is, the value:
     * <blockquote><pre>
     * this.charAt(k)-anotherString.charAt(k)
     * </pre></blockquote>
     * If there is no index position at which they differ, then the shorter
     * string lexicographically precedes the longer string. In this case,
     * {@code compareTo} returns the difference of the lengths of the
     * strings -- that is, the value:
     * <blockquote><pre>
     * this.length()-anotherString.length()
     * </pre></blockquote>
     *
     * @param   string2   the {@code String} to be compared.
     * @return  the value {@code 0} if the argument string is equal to
     *          this string; a value less than {@code 0} if this string
     *          is lexicographically less than the string argument; and a
     *          value greater than {@code 0} if this string is
     *          lexicographically greater than the string argument.
     */
    export function compareTo(string1: string, string2: string): number {
        let k: number = 0;
        while (k < Math.min(string1.length, string2.length)) {
            if (string1.substr(k, 1) !== string2.substr(k, 1)) {
                return string1.charCodeAt(k) - string2.charCodeAt(k);
            }
            k++;
        }
        return string1.length - string2.length;
    }
}

export namespace DateUtils {
    // @ts-ignore
    export function compareTo(date1: Date, date2: Date): number {
        const date1Millis = date1.getTime();
        const date2Millis = date2.getTime();

        if (date1Millis === date2Millis) return 0;
        else if (date1Millis < date2Millis) return -1;
        else if (date1Millis > date2Millis) return 1;
    }
}

// export const Long_MIN_VALUE = 0;
export const Long_MIN_VALUE = NaN;

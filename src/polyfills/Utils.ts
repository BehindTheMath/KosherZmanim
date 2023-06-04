import { DateTime, Info } from 'luxon';

export const Utils = {
  // https://stackoverflow.com/a/40577337/8037425
  getAllMethodNames: (obj: object, excludeContructors: boolean = false): string[] => {
    let _obj: object | null = obj;
    const methods: Set<string> = new Set();

    // eslint-disable-next-line no-cond-assign
    while ((_obj = Reflect.getPrototypeOf(_obj)) && Reflect.getPrototypeOf(_obj)) {
      const keys: Array<string> = Reflect.ownKeys(_obj) as Array<string>;
      keys.filter((key: string) => !excludeContructors || key !== 'constructor')
        .forEach((key: string) => methods.add(key));
    }

    // Convert Symbols to strings, if there are any
    return Array.from(methods, value => value.toString())
      .sort();
  }
}

export const TimeZone = {
  /**
   * Returns the amount of time in milliseconds to add to UTC to get
   * standard time in this time zone. Because this value is not
   * affected by daylight saving time, it is called <I>raw
   * offset</I>.
   *
   * Since JS doesn't have a native function for this, use the lesser offset of January and July.
   *
   * @return the amount of raw offset time in milliseconds to add to UTC.
   */
  getRawOffset: (timeZoneId: string): number => {
    const janDateTime = DateTime.fromObject({
      month: 1,
      day: 1
    }, { zone: timeZoneId });
    const julyDateTime = janDateTime.set({ month: 7 });

    let rawOffsetMinutes;
    if (janDateTime.offset === julyDateTime.offset) {
      rawOffsetMinutes = janDateTime.offset;
    } else {
      const max = Math.max(janDateTime.offset, julyDateTime.offset);

      rawOffsetMinutes = max < 0
        ? 0 - max
        : 0 - Math.min(janDateTime.offset, julyDateTime.offset);
    }

    return rawOffsetMinutes * 60 * 1000;
  },

  /**
   * Returns a name in the specified style of this TimeZone suitable for presentation to the user in the default locale.
   * @param {string} timeZoneId
   * @param {DateTime} [date]
   * @param {boolean} [short]
   */
  getDisplayName: (timeZoneId: string, date: DateTime = DateTime.local(), short: boolean = false): string =>
    Info.normalizeZone(timeZoneId).offsetName(date.toMillis(), { format: short ? 'short' : 'long' })!
  ,

  /**
   * Returns the amount of time to be added to local standard time to get local wall clock time.
   * The default implementation returns 3600000 milliseconds (i.e., one hour) if a call to useDaylightTime() returns true.
   * Otherwise, 0 (zero) is returned.
   * @param {string} timeZoneId
   * @return {number}
   */
  getDSTSavings: (timeZoneId: string): number =>
    Info.hasDST(timeZoneId) ? 3600000 : 0
  ,

  /**
   * Returns the offset of this time zone from UTC at the specified date. If Daylight Saving Time is in effect at the
   * specified date, the offset value is adjusted with the amount of daylight saving.
   *
   * This method returns a historically correct offset value if an underlying TimeZone implementation subclass
   * supports historical Daylight Saving Time schedule and GMT offset changes.
   * @param {string} timeZoneId
   * @param {number} millisSinceEpoch
   */
  getOffset: (timeZoneId: string, millisSinceEpoch: number): number => {
    return Info.normalizeZone(timeZoneId).offset(millisSinceEpoch) * 60 * 1000;
  }
}

/**
 * java.util.Calendar
 */
export const Calendar = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11,

  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 3,
  WEDNESDAY: 4,
  THURSDAY: 5,
  FRIDAY: 6,
  SATURDAY: 7,

  DATE: 5,
  MONTH: 2,
  YEAR: 1,
}

/**
 * java.lang.Math
 */
export const MathUtils = {
  /**
   * java.lang.Math.toRadians
   * @param degrees
   */
  degreesToRadians: (degrees: number): number =>
    degrees * Math.PI / 180
  ,

  /**
   * java.lang.Math.toDegrees
   * @param radians
   */
  radiansToDegrees: (radians: number): number =>
    radians * 180 / Math.PI
  
}

/**
 * java.lang.String
 */
export const StringUtils = {
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
   * @param string1
   * @param   string2   the {@code String} to be compared.
   * @return  the value {@code 0} if the argument string is equal to
   *          this string; a value less than {@code 0} if this string
   *          is lexicographically less than the string argument; and a
   *          value greater than {@code 0} if this string is
   *          lexicographically greater than the string argument.
   */
  compareTo: (string1: string, string2: string): number => {
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

export const IntegerUtils = {
  /**
   * Compares 2 numbers
   * @param x
   * @param y
   */
  compare: (x: number, y: number): number => {
    if (x === y) return 0;
    return x > y ? 1 : -1;
  }

}

// export const Long_MIN_VALUE = 0;
export const Long_MIN_VALUE = NaN;

/**
 * @param {number} num
 * @param {number} places - The number of places to pad with zeros
 * @returns {string} - The formatted integer
 */
export function padZeros(num: number, places: number): string {
  const int = Math.trunc(num);
  if (int >= Math.pow(10, places)) return int.toString();
  return '0'.repeat(places).concat(int.toString()).slice(-places);
}

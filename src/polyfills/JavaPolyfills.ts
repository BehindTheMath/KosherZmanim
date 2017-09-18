export class Long {
    public static MIN_VALUE: number = -9223372036854775808;
}

Math.toRadians = function(angdeg: number): number {
    return angdeg / 180.0 * Math.PI;
};

Math.toDegrees = function(angrad: number): number {
    return angrad * 180.0 / Math.PI;
};

String.prototype.equals = function(this: string, str: string): boolean {
    return this === str;
};

String.prototype.replaceAll = function(this: string, searchString: string, replaceString: string): string {
    return this.split(searchString).join("");
};

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
 * @param   anotherString   the {@code String} to be compared.
 * @return  the value {@code 0} if the argument string is equal to
 *          this string; a value less than {@code 0} if this string
 *          is lexicographically less than the string argument; and a
 *          value greater than {@code 0} if this string is
 *          lexicographically greater than the string argument.
 */
String.prototype.compareTo = function(this: string, anotherString: string): number {
    const len1: number = this.length;
    const len2: number = anotherString.length;
    const lim: number = Math.min(len1, len2);
    const v1: string[] = this.split("");
    const v2: string[] = anotherString.split("");

    let k: number = 0;
    while (k < lim) {
        const c1: string = v1[k];
        const c2: string = v2[k];
        if (c1 != c2) {
            return c1.charCodeAt(0) - c2.charCodeAt(0);
        }
        k++;
    }
    return len1 - len2;

};


Date.prototype.compareTo = function(this: Date, date: Date): number {
    const date1Millis = this.getTime();
    const date2Millis = date.getTime();

    if (date1Millis === date2Millis) return 0;
    else if (date1Millis < date2Millis) return -1;
    else if (date1Millis > date2Millis) return 1;
};


Date.prototype.after = function(this: Date, date: Date): boolean {
    return this.getTime() > date.getTime();
};

Date.prototype.before = function(this: Date, date: Date): boolean {
    return this.getTime() < date.getTime();
};

Date.prototype.equals = function(this: Date, date: Date): boolean {
    return this.getTime() === date.getTime();
};

/*
export class Comparator<T> {
    public compare: (value1: T, value2: T) => number;

    constructor(compare: (value1: T, value2: T) => number) {
        this.compare = compare;
    }
}
*/
export abstract class Comparator<T> {
    public abstract compare (value1: T, value2: T): number;
}

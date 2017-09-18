import {Calendar} from "./Calendar";

export class GregorianCalendar extends Calendar {
    /**
     * Value of the <code>ERA</code> field indicating
     * the period before the common era (before Christ), also known as BCE.
     * The sequence of years at the transition from <code>BC</code> to <code>AD</code> is
     * ..., 2 BC, 1 BC, 1 AD, 2 AD,...
     *
     * @see #ERA
     */
    public static readonly BC: number = 0;

    /**
     * Value of the {@link #ERA} field indicating
     * the period before the common era, the same value as {@link #BC}.
     *
     * @see #CE
     */
    static readonly BCE: number = 0;

    /**
     * Value of the <code>ERA</code> field indicating
     * the common era (Anno Domini), also known as CE.
     * The sequence of years at the transition from <code>BC</code> to <code>AD</code> is
     * ..., 2 BC, 1 BC, 1 AD, 2 AD,...
     *
     * @see #ERA
     */
    public static readonly AD: number = 1;

    /**
     * Value of the {@link #ERA} field indicating
     * the common era, the same value as {@link #AD}.
     *
     * @see #BCE
     */
    static readonly CE: number = 1;

    public constructor(year: number, month: number, dayOfMonth: number) {
        super();
        this.set(year, month, dayOfMonth);
    }
}
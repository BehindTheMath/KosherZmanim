import {default as Calendar, Field, FieldOptions, Month} from "./Calendar";
import * as moment from "moment-timezone";

export default class GregorianCalendar extends Calendar {
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
    public static readonly BCE: number = 0;

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
    public static readonly CE: number = 1;

    public constructor(year: number, month: Month, dayOfMonth: number)
    public constructor(timeZoneId: string)
    public constructor()
    public constructor(yearOrTimeZoneId?: number | string, month?: Month, dayOfMonth?: number) {
        if (month) {
            super();
            this.set(yearOrTimeZoneId as number, month, dayOfMonth);
        } else {
            super(yearOrTimeZoneId as string);
        }
    }

    public set(year: number, month: Month, day: number, hourOfDay: number, minute: number, second: number): void;
    public set(year: number, month: Month, day: number): void;
    public set(field: Field, value: number): void;
    public set(yearOrField: number, monthOrValue: number, day?: number, hourOfDay?: number, minute?: number, second?: number): void {
        if (day) {
            const year: number = yearOrField as number;
            this.momentDate.year(year).month(monthOrValue as Month).date(day);

            if (hourOfDay) {
                this.momentDate.hour(hourOfDay).minute(minute);
                if (second) this.momentDate.second(second);
            }
        } else {
            const field: Field = yearOrField as Field;
            const value: number = monthOrValue;

            if (field === Calendar.ERA) {
                if ((this.momentDate.year() > 0 && value === GregorianCalendar.BCE) || (this.momentDate.year() < 0 && value === GregorianCalendar.CE)) {
                    this.momentDate.year(-value);
                }
            } else if (field === Calendar.HOUR) {
                throw new Error("IllegalArgumentException: This is currently unsupported.");
            } else if (field >= Calendar.YEAR && field <= Calendar.MILLISECOND) {
                this.momentDate.set(this.shorthandLookup[field] as moment.unitOfTime.All, value);
            }
        }
    }

    public get(field: FieldOptions): number {
        switch (field) {
            case Calendar.ERA:
                return this.momentDate.year() > 0 ? GregorianCalendar.CE : GregorianCalendar.BCE;
            case Calendar.ZONE_OFFSET:
                return this.momentDate.utcOffset() * 1000;
            case Calendar.DST_OFFSET:
                return this.momentDate.isDST() ? 60 * 60 * 1000 : 0;
            case Calendar.HOUR:
                const hour: number = this.momentDate.hour();
                return hour < 13 ? hour : hour - 12;
            default:
                return this.momentDate.get(this.shorthandLookup[field] as moment.unitOfTime.All);
        }
    }

    public clone(): GregorianCalendar {
        const clonedCalendar: GregorianCalendar = new GregorianCalendar(this.getTimeZoneId());
        clonedCalendar.setTimeInMillis(this.getTimeInMillis());
        return clonedCalendar;
    }
}

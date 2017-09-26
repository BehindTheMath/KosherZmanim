import {default as Calendar, Field, FieldOptions, Month} from "./Calendar";
import * as moment from "moment-timezone";

export default class GregorianCalendar extends Calendar {
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

            if (field === Calendar.HOUR) {
                throw new Error("IllegalArgumentException: This is currently unsupported.");
            } else if (field >= Calendar.YEAR && field <= Calendar.MILLISECOND) {
                this.momentDate.set(this.shorthandLookup[field] as moment.unitOfTime.All, value);
            }
        }
    }

    public get(field: FieldOptions): number {
        switch (field) {
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
        const clonedCalendar: GregorianCalendar = new GregorianCalendar(this.getTimeZone());
        clonedCalendar.setTimeInMillis(this.getTimeInMillis());
        return clonedCalendar;
    }
}

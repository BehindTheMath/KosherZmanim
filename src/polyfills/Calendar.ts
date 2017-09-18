import * as moment from "moment-timezone";
import momentTimezone = require("moment-timezone");
import {TimeZone} from "./TimeZone";

export enum Field {
    ERA = 0,
    YEAR = 1,
    MONTH = 2,
    DATE = 5,
    DAY_OF_MONTH = 5,
    DAY_OF_YEAR = 6,
    HOUR = 10,
    HOUR_OF_DAY = 11,
    MINUTE = 12,
    SECOND = 13,
    MILLISECOND = 14
}

export enum CalendarOffset {
    ZONE_OFFSET = 15,
    DST_OFFSET = 16

}

export type FieldOptions = Field | CalendarOffset;

export enum Month {
    JANUARY = 0,
    FEBRUARY = 1,
    MARCH = 2,
    APRIL = 3,
    MAY = 4,
    JUNE = 5,
    JULY = 6,
    AUGUST = 7,
    SEPTEMBER = 8,
    OCTOBER = 9,
    NOVEMBER = 10,
    DECEMBER = 11
}

/**
 * Provides a substitute for java.util.Calendar.
 * This is not a 1:1 port, so check the method signatures before using.
 */
export class Calendar {
    public static Month = Month;

    public static readonly ERA: number = 0;
    public static readonly YEAR: number = 1;
    public static readonly MONTH: number = 2;
    public static readonly DATE: number = 5;
    public static readonly DAY_OF_MONTH: number = 5;
    public static readonly DAY_OF_YEAR: number = 6;
    public static readonly HOUR: number = 10;
    public static readonly HOUR_OF_DAY: number = 11;
    public static readonly MINUTE: number = 12;
    public static readonly SECOND: number = 13;
    public static readonly MILLISECOND: number = 14;

    /**
     * Field number for <code>get</code> and <code>set</code>
     * indicating the raw offset from GMT in milliseconds.
     * <p>
     * This field reflects the correct GMT offset value of the time
     * zone of this <code>Calendar</code> if the
     * <code>TimeZone</code> implementation subclass supports
     * historical GMT offset changes.
     */
    public static readonly ZONE_OFFSET: number = 15;

    /**
     * Field number for <code>get</code> and <code>set</code> indicating the
     * daylight saving offset in milliseconds.
     * <p>
     * This field reflects the correct daylight saving offset value of
     * the time zone of this <code>Calendar</code> if the
     * <code>TimeZone</code> implementation subclass supports
     * historical Daylight Saving Time schedule changes.
     */
    public static readonly DST_OFFSET: number = 16;

    public static readonly JANUARY: number = 0;
    public static readonly FEBRUARY: number = 1;
    public static readonly MARCH: number = 2;
    public static readonly APRIL: number = 3;
    public static readonly MAY: number = 4;
    public static readonly JUNE: number = 5;
    public static readonly JULY: number = 6;
    public static readonly AUGUST: number = 7;
    public static readonly SEPTEMBER: number = 8;
    public static readonly OCTOBER: number = 9;
    public static readonly NOVEMBER: number = 10;
    public static readonly DECEMBER: number = 11;

    private timeZone: TimeZone;
    private momentDate: moment.Moment;
    private shorthandLookup: string[] = ["era", "year", "month", "", "", "date", "dayOfYear", "", "", "", "hour", "hour", "minute", "second", "millisecond"];


    protected constructor(timeZone: TimeZone = TimeZone.getTimeZone(momentTimezone.tz.guess())) {
        this.momentDate = momentTimezone.tz(timeZone.getID());
    }

    public set(year: number, month: Month, day: number, hourOfDay: number, minute: number, second: number): void
    public set(year: number, month: Month, day: number): void
    public set(field: Field, value: number): void
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
                throw "IllegalArgumentException: This is currently unsupported.";
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

    public setTime(date: Date): void {
        this.momentDate.hour(date.getHours())
            .minute(date.getMinutes())
            .second(date.getSeconds())
            .millisecond(date.getMilliseconds());
    }

    public getTime(): Date {
        return this.momentDate.toDate();
    }

    public add(field: Field, value: number) {
        this.momentDate.add(value, this.shorthandLookup[field] as moment.unitOfTime.DurationConstructor);
    }

    public static getInstance(timeZone?: TimeZone) {
        return new Calendar(timeZone);
    }

    public getTimeZone(): TimeZone {
        return this.timeZone;
    }

    public setTimeZone(timeZone: TimeZone) {
        this.timeZone = timeZone;
        this.momentDate.tz(timeZone.getID());
    }

    /**
     * Returns the number of milliseconds since the epoch.
     *
     * @returns {number}
     */
    public getTimeInMillis(): number {
        return this.momentDate.valueOf();
    }

    public setTimeInMillis(millis: number): void {
        this.momentDate.add(millis - this.momentDate.valueOf(), "ms");
    }
    
    public clear(): void {
        this.momentDate = undefined;
    }

    public clone(): Calendar {
        const clonedCalendar: Calendar = new Calendar(this.getTimeZone());
        clonedCalendar.setTimeInMillis(this.getTimeInMillis());
        return clonedCalendar;
    }

    public equals(calendar: Calendar): boolean {
        return this.timeZone === calendar.getTimeZone() && this.momentDate.valueOf() === calendar.getTimeInMillis();
    }

    public format(format: string): string {
        return this.momentDate.format(format);
    }
}

import {GregorianCalendar} from "./GregorianCalendar";

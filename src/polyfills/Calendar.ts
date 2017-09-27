import * as moment from "moment-timezone";
import momentTimezone = require("moment-timezone");

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
export default abstract class Calendar {
    public static readonly Month = Month;

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

    protected momentDate: moment.Moment;
    protected shorthandLookup: string[] = ["era", "year", "month", "", "", "day", "dayOfYear", "", "", "", "hour", "hour", "minute", "second", "millisecond"];

    protected constructor(timeZoneId: string = momentTimezone.tz.guess()) {
        this.momentDate = momentTimezone.tz(timeZoneId);
    }

    public abstract set(yearOrField: number, monthOrValue: number, day?: number, hourOfDay?: number, minute?: number, second?: number): void;

    public abstract get(field: FieldOptions): number;

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

    public getTimeZone(): string {
        return this.momentDate.tz();
    }

    public setTimeZone(timeZoneId: string) {
        this.momentDate.tz(timeZoneId);
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

    public equals(calendar: Calendar): boolean {
        return this.momentDate.isSame(calendar.getMoment());
    }

    public format(format: string): string {
        return this.momentDate.format(format);
    }

    public getMoment(): moment.Moment {
        return this.momentDate;
    }
}

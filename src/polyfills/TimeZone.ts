import * as moment from "moment-timezone";
import momentTimezone = require("moment-timezone");

export class TimeZone {
    private ID: string;

    private constructor(timeZone: string) {
        this.ID = timeZone
    }

    public static getTimeZone(timeZone: string): TimeZone {
        return new TimeZone(timeZone);
    }

    public getID(): string {
        return this.ID;
    }

    public getRawOffset(): number {
        return momentTimezone.tz(this.ID).utcOffset();
    }

    // TODO: This will return the current DST status, as opposed to Java which returns non-DST
    public getDisplayName(): string {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: this.ID,
            timeZoneName: "long"
        };
        return new Date().toLocaleDateString("en-US", options).split(",")[1].trim()
    }

/*
    public getDSTSavings(): number {}
*/

    public equals(timeZone: TimeZone): boolean {
        return this.ID === timeZone.getID();
    }

    public getOffset(millisSinceEpoch: number): number {
        return momentTimezone(millisSinceEpoch).tz(this.ID).utcOffset() * 1000;
    }
}
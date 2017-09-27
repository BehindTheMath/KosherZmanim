import {Moment} from "moment-timezone";
import MomentTimezone = require("moment-timezone");

export default class Utils {
    // https://stackoverflow.com/a/40577337/8037425
    public static getAllMethodNames(obj: object, excludeContructors: boolean = false): Array<string> {
        // let methods: Array<string> = [];
        let methods: Set<string> = new Set();

        while (obj = Reflect.getPrototypeOf(obj)) {
            let keys: Array<string> = Reflect.ownKeys(obj) as Array<string>;
            // methods = methods.concat(keys);
            keys.filter((key: string) => !methods.has(key))
                .filter((key: string) => !excludeContructors || key !== "constructor")
                .forEach((key: string) => methods.add(key));
        }

        return Array.from(methods);
    };
}

export module TimeZone {
    /**
     * Returns the amount of time in milliseconds to add to UTC to get
     * standard time in this time zone. Because this value is not
     * affected by daylight saving time, it is called <I>raw
     * offset</I>.
     *
     * @return the amount of raw offset time in milliseconds to add to UTC.
     */
    export function getRawOffset(moment: Moment): number;
    export function getRawOffset(timeZoneId: string): number;
    export function getRawOffset(momentOrTimeZoneId: Moment | string): number {
        const moment: Moment = MomentTimezone.isMoment(momentOrTimeZoneId) ?
            momentOrTimeZoneId : MomentTimezone.tz(momentOrTimeZoneId);

        return moment.utcOffset() * 60 * 1000;
    }

    // TODO: This will return the current DST status, as opposed to Java which returns non-DST
    export function getDisplayName(timeZoneId: string): string {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: timeZoneId,
            timeZoneName: "long"
        };
        return new Date().toLocaleDateString("en-US", options).split(",")[1].trim();
    }

    /*
    public getDSTSavings(): number {}
    */

    export function getOffset(timeZoneId: string, millisSinceEpoch: number): number {
        return MomentTimezone(millisSinceEpoch).tz(timeZoneId).utcOffset() * 60 * 1000;
    }
}

/**
 * Wrapper class for an astronomical time, mostly used to sort collections of
 * astronomical times.
 *
 * @author &copy; Eliyahu Hershfeld 2007-2011
 * @version 1.0
 */
export module Zman {
    export function compareDateOrder(zman1: Zman, zman2: Zman): number {
        return zman1.zman.compareTo(zman2.zman);
    }

    export function compareNameOrder(zman1: Zman, zman2: Zman): number {
        return zman1.zmanLabel.compareTo(zman2.zmanLabel);
    }

    export function compareDurationOrder(zman1: Zman, zman2: Zman): number {
        return zman1.duration === zman2.duration ? 0 : zman1.duration > zman2.duration ? 1 : -1;
    }
}

export module Calendar {
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

    export function getZoneOffset(moment: Moment): number {
        return moment.utcOffset() * 1000;
    }

    export function getDstOffset(moment: Moment): number {
        return moment.isDST() ? 60 * 60 * 1000 : 0;
    }
}



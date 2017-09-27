import momentTimezone = require("moment-timezone");

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
    export function getRawOffset(timeZoneId: string): number {
        return momentTimezone.tz(timeZoneId).utcOffset();
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
        return momentTimezone(millisSinceEpoch).tz(timeZoneId).utcOffset() * 60 * 1000;
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


import {DateUtils, StringUtils} from "../polyfills/Utils";
import { DateTime } from "luxon";

/**
 * Wrapper class for an astronomical time, mostly used to sort collections of
 * astronomical times.
 *
 * @author &copy; Eliyahu Hershfeld 2007-2011
 * @version 1.0
 */
export class Zman {
    zmanLabel: string;
    zman?: DateTime;
    duration?: number;
    zmanDescription?: Date;

    constructor(date: DateTime, label: string)
    constructor(duration: number, label: string)
    constructor(dateOrDuration: number | DateTime, label: string) {
        this.zmanLabel = label;
        if (DateTime.isDateTime(dateOrDuration)) {
            this.zman = dateOrDuration;
        } else if (typeof dateOrDuration === "number") {
            this.duration = dateOrDuration;
        }
    }

    static compareDateOrder(zman1: Zman, zman2: Zman): number {
        if (!zman1.zman || !zman2.zman) {
            throw new RangeError("zman cannot be falsy when comparing");
        }
        return DateUtils.compareTo(zman1.zman, zman2.zman);
    }

    static compareNameOrder(zman1: Zman, zman2: Zman): number {
        return StringUtils.compareTo(zman1.zmanLabel, zman2.zmanLabel);
    }

    static compareDurationOrder(zman1: Zman, zman2: Zman): number {
        if (!zman1.duration || !zman2.duration) {
            throw new RangeError("Duration cannot be falsy when comparing");
        }
        return zman1.duration === zman2.duration ? 0 : zman1.duration > zman2.duration ? 1 : -1;
    }
}

export type ZmanWithZmanDate = Zman & {zman: DateTime};
export type ZmanWithDuration = Zman & {duration: number};

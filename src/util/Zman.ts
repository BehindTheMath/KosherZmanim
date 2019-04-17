import {DateUtils, StringUtils} from "../polyfills/Utils";

/**
 * Wrapper class for an astronomical time, mostly used to sort collections of
 * astronomical times.
 *
 * @author &copy; Eliyahu Hershfeld 2007-2011
 * @version 1.0
 */
export class Zman {
    zmanLabel: string;
    zman?: Date;
    duration?: number;
    zmanDescription?: Date;

    constructor(date: Date, label: string)
    constructor(duration: number, label: string)
    constructor(dateOrDuration: number | Date, label: string) {
        this.zmanLabel = label;
        if (dateOrDuration instanceof Date) {
            this.zman = dateOrDuration;
        } else if (typeof dateOrDuration === "number") {
            this.duration = dateOrDuration;
        }
    }

    static compareDateOrder(zman1: Zman, zman2: Zman): number {
        return DateUtils.compareTo(zman1.zman, zman2.zman);
    }

    static compareNameOrder(zman1: Zman, zman2: Zman): number {
        return StringUtils.compareTo(zman1.zmanLabel, zman2.zmanLabel);
    }

    static compareDurationOrder(zman1: Zman, zman2: Zman): number {
        return zman1.duration === zman2.duration ? 0 : zman1.duration > zman2.duration ? 1 : -1;
    }
}

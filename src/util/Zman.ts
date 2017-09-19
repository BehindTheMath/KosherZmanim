import {Comparator} from "../polyfills/JavaPolyfills";

/**
 * Wrapper class for an astronomical time, mostly used to sort collections of
 * astronomical times.
 *
 * @author &copy; Eliyahu Hershfeld 2007-2011
 * @version 1.0
 */
export default class Zman {
    private zmanLabel: string;
    private zman: Date;
    private duration: number;
    private zmanDescription: Date;

    constructor(date: Date, label: string)
    constructor(duration: number, label: string)
    constructor(dateOrDuration: Date | number, label: string) {
        this.zmanLabel = label;

        if (dateOrDuration instanceof Date) {
            this.zman = dateOrDuration;
        } else if (typeof dateOrDuration === "number") {
            this.duration = dateOrDuration;
        }
    }

/*
    public Zman(duration: number, String label) {
        this.zmanLabel = label;
        this.duration = duration;
    }
*/

    public getZman(): Date {
        return this.zman;
    }

    public setZman(date: Date): void {
        this.zman = date;
    }

    public getDuration(): number {
        return this.duration;
    }

    public setDuration(duration: number): void {
        this.duration = duration;
    }

    public getZmanLabel(): string {
        return this.zmanLabel;
    }

    public setZmanLabel(label: string): void {
        this.zmanLabel = label;
    }

    public static readonly DATE_ORDER: Comparator<Zman> = new (class extends Comparator<Zman> {
        public compare (z1: Zman, z2: Zman): number {
            return z1.getZman().compareTo(z2.getZman());
        }
    });

    public static readonly NAME_ORDER: Comparator<Zman> = new (class extends Comparator<Zman> {
        public compare(z1: Zman, z2: Zman): number {
            return z1.getZmanLabel().compareTo(z2.getZmanLabel());
        }
    });

    public static readonly DURATION_ORDER: Comparator<Zman> = new (class extends Comparator<Zman> {
        public compare(z1: Zman, z2: Zman): number {
            return z1.getDuration() === z2.getDuration() ? 0
                    : z1.getDuration() > z2.getDuration() ? 1 : -1;
        }
    });

    /**
     * @return the zmanDescription
     */
    public getZmanDescription(): Date {
        return this.zmanDescription;
    }

    /**
     * @param zmanDescription
     *            the zmanDescription to set
     */
    public setZmanDescription(zmanDescription: Date): void {
        this.zmanDescription = zmanDescription;
    }
}

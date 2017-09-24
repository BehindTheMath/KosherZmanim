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

    public static compareDateOrder(zman1: Zman, zman2: Zman): number {
        return zman1.getZman().compareTo(zman2.getZman());
    }

    public static compareNameOrder(zman1: Zman, zman2: Zman): number {
        return zman1.getZmanLabel().compareTo(zman2.getZmanLabel());
    }

    public static compareDurationOrder(zman1: Zman, zman2: Zman): number {
        return zman1.getDuration() === zman2.getDuration() ? 0
            : zman1.getDuration() > zman2.getDuration() ? 1 : -1;
    }

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

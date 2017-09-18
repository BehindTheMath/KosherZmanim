import {TimeZone} from "./TimeZone";
import {GregorianCalendar} from "./GregorianCalendar";

export class SimpleDateFormat {
    private pattern: string;
    private calendar: GregorianCalendar;

    constructor(pattern: string) {
        this.pattern = pattern;
    }

    public format(date: Date): string {
        this.calendar.setTime(date);
        return this.calendar.format(this.pattern);
    }

    public setCalendar(calendar: GregorianCalendar) {
        this.calendar = calendar;
    }

    public toPattern(): string {
        return this.pattern;
    }

    public setTimeZone(timeZone: TimeZone): void {
        this.calendar.setTimeZone(timeZone);
    }

}
import {Calendar} from "./Calendar";
import {TimeZone} from "./TimeZone";

export class SimpleDateFormat {
    private pattern: string;
    private calendar: Calendar;

    constructor(pattern: string) {
        this.pattern = pattern;
    }

    public format(date: Date): string {
        this.calendar.setTime(date);
        return this.calendar.format(this.pattern);
    }

    public setCalendar(calendar: Calendar) {
        this.calendar = calendar;
    }

    public toPattern(): string {
        return this.pattern;
    }

    public setTimeZone(timeZone: TimeZone): void {
        this.calendar.setTimeZone(timeZone);
    }

}
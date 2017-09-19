import TimeZone from "./TimeZone";
import Calendar from "./Calendar";
import GregorianCalendar from "./GregorianCalendar";

export default class SimpleDateFormat {
    private pattern: string;
    private calendar: Calendar;

    constructor(pattern: string, calendar?: GregorianCalendar) {
        this.pattern = pattern;
        this.calendar = calendar || new GregorianCalendar();
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

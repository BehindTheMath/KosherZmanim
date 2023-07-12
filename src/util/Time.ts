import { UnsupportedError } from '../polyfills/errors.ts';

/**
 * A class that represents a numeric time. Times that represent a time of day are stored as {@link java.util.Date}s in
 * this API. The time class is used to represent numeric time such as the time in hours, minutes, seconds and
 * milliseconds of a {@link AstronomicalCalendar#getTemporalHour() temporal hour}.
 *
 * @author &copy; Eliyahu Hershfeld 2004 - 2011
 * @version 0.9.0
 */

export class Time {
  /** milliseconds in a second. */
  private static readonly SECOND_MILLIS: number = 1000;

  /** milliseconds in a minute. */
  private static readonly MINUTE_MILLIS: number = Time.SECOND_MILLIS * 60;

  /** milliseconds in an hour. */
  private static readonly HOUR_MILLIS: number = Time.MINUTE_MILLIS * 60;

  /**
   * @see #getHours()
   */
  private hours: number = 0;

  /**
   * @see #getMinutes()
   */
  private minutes: number = 0;

  /**
   * @see #getSeconds()
   */
  private seconds: number = 0;

  /**
   * @see #getMilliseconds()
   */
  private milliseconds: number = 0;

  /**
   * @see #isNegative()
   * @see #setIsNegative(boolean)
   */
  private negative: boolean = false;

  /**
   * Constructor with parameters for the hours, minutes, seconds and millisecods.
   *
   * @param hours the hours to set
   * @param minutes the minutes to set
   * @param seconds the seconds to set
   * @param milliseconds the milliseconds to set
   */
  constructor(hours: number, minutes: number, seconds: number, milliseconds: number);
  /**
   * A constructor that sets the time by milliseconds. The milliseconds are converted to hours, minutes, seconds
   * and milliseconds. If the milliseconds are negative it will call {@link #setIsNegative(boolean)}.
   * @param millis the milliseconds to set.
   */
  constructor(millis: number);
  /**
   * A constructor with 2 overloads:
   * - A constructor that sets the time by milliseconds.
   *   The milliseconds are converted to hours, minutes, seconds and milliseconds. If the
   *   milliseconds are negative it will call {@link #setIsNegative(boolean)}.
   * - A constructor with parameters for the hours, minutes, seconds and millisecods.
   * @param hoursOrMillis
   * @param minutes
   * @param seconds
   * @param milliseconds
   */
  constructor(hoursOrMillis: number, minutes?: number, seconds: number = 0, milliseconds: number = 0) {
    if (minutes) {
      this.hours = hoursOrMillis;
      this.minutes = minutes;
      this.seconds = seconds;
      this.milliseconds = milliseconds;
    } else {
      let adjustedMillis: number = hoursOrMillis;
      if (adjustedMillis < 0) {
        this.negative = true;
        adjustedMillis = Math.abs(adjustedMillis);
      }
      this.hours = Math.trunc(adjustedMillis / Time.HOUR_MILLIS);
      adjustedMillis = adjustedMillis - this.hours * Time.HOUR_MILLIS;

      this.minutes = Math.trunc(adjustedMillis / Time.MINUTE_MILLIS);
      adjustedMillis = adjustedMillis - this.minutes * Time.MINUTE_MILLIS;

      this.seconds = Math.trunc(adjustedMillis / Time.SECOND_MILLIS);
      adjustedMillis = adjustedMillis - this.seconds * Time.SECOND_MILLIS;

      this.milliseconds = adjustedMillis;
    }
  }

  /*
      public Time(millis: number) {
          this((int) millis);
      }

      public Time(millis: number) {
          adjustedMillis: number = millis;
          if (adjustedMillis < 0) {
              this.isNegative = true;
              adjustedMillis = Math.abs(adjustedMillis);
          }
          this.hours = adjustedMillis / HOUR_MILLIS;
          adjustedMillis = adjustedMillis - this.hours * HOUR_MILLIS;

          this.minutes = adjustedMillis / MINUTE_MILLIS;
          adjustedMillis = adjustedMillis - this.minutes * MINUTE_MILLIS;

          this.seconds = adjustedMillis / SECOND_MILLIS;
          adjustedMillis = adjustedMillis - this.seconds * SECOND_MILLIS;

          this.milliseconds = adjustedMillis;
      }
  */

  /**
   * Does the time represent a negative time 9such as using this to subtract time from another Time.
   * @return if the time is negative.
   */
  public isNegative(): boolean {
    return this.negative;
  }

  /**
   * Set this to represent a negative time.
   * @param isNegative that the Time represents negative time
   */
  public setIsNegative(isNegative: boolean): void {
    this.negative = isNegative;
  }

  /**
   * @return Returns the hour.
   */
  public getHours(): number {
    return this.hours;
  }

  /**
   * @param hours
   *            The hours to set.
   */
  public setHours(hours: number): void {
    this.hours = hours;
  }

  /**
   * @return Returns the minutes.
   */
  public getMinutes(): number {
    return this.minutes;
  }

  /**
   * @param minutes
   *            The minutes to set.
   */
  public setMinutes(minutes: number): void {
    this.minutes = minutes;
  }

  /**
   * @return Returns the seconds.
   */
  public getSeconds(): number {
    return this.seconds;
  }

  /**
   * @param seconds
   *            The seconds to set.
   */
  public setSeconds(seconds: number): void {
    this.seconds = seconds;
  }

  /**
   * @return Returns the milliseconds.
   */
  public getMilliseconds(): number {
    return this.milliseconds;
  }

  /**
   * @param milliseconds
   *            The milliseconds to set.
   */
  public setMilliseconds(milliseconds: number): void {
    this.milliseconds = milliseconds;
  }

  /**
   * Returns the time in milliseconds by converting hours, minutes and seconds into milliseconds.
   * @return the time in milliseconds
   */
  public getTime(): number {
    return this.hours * Time.HOUR_MILLIS + this.minutes * Time.MINUTE_MILLIS + this.seconds * Time.SECOND_MILLIS
      + this.milliseconds;
  }

  /**
   * @deprecated This depends on a circular dependency. Use <pre>new ZmanimFormatter(TimeZone.getTimeZone("UTC")).format(time)</pre> instead.
   */
  // eslint-disable-next-line class-methods-use-this
  public toString(): string {
    throw new UnsupportedError('This method is deprecated, due to the fact that it depends on a circular dependency. '
      + 'Use `new ZmanimFormatter(TimeZone.getTimeZone(\'UTC\')).format(time)` instead');
  }
}

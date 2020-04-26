import { DateTime } from 'luxon';

import { IntegerUtils, StringUtils } from '../polyfills/Utils';

/**
 * Wrapper class for an astronomical time, mostly used to sort collections of
 * astronomical times.
 *
 * @author &copy; Eliyahu Hershfeld 2007-2011
 * @version 1.0
 */
export class Zman {
  zmanLabel: string | null;
  zman?: DateTime;
  duration?: number;
  zmanDescription?: Date;

  constructor(date: DateTime, label: string | null)
  constructor(duration: number, label: string | null)
  constructor(dateOrDuration: number | DateTime, label: string | null) {
    this.zmanLabel = label;
    if (DateTime.isDateTime(dateOrDuration)) {
      this.zman = dateOrDuration;
    } else if (typeof dateOrDuration === 'number') {
      this.duration = dateOrDuration;
    }
  }

  static compareDateOrder(zman1: Zman, zman2: Zman): number {
    const firstMillis = zman1.zman?.valueOf() || 0;
    const secondMillis = zman2.zman?.valueOf() || 0;

    return IntegerUtils.compare(firstMillis, secondMillis);
  }

  static compareNameOrder(zman1: Zman, zman2: Zman): number {
    return StringUtils.compareTo(zman1.zmanLabel || '', zman2.zmanLabel || '');
  }

  static compareDurationOrder(zman1: Zman, zman2: Zman): number {
    return IntegerUtils.compare(zman1.duration || 0, zman2.duration || 0);
  }
}

export type ZmanWithZmanDate = Zman & { zman: DateTime };
export type ZmanWithDuration = Zman & { duration: number };

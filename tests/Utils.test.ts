import * as MomentTimezone from 'moment-timezone';

import {Calendar, DateUtils, MathUtils, StringUtils, TimeZone, Utils} from "../src/polyfills/Utils";

const januaryMoment = MomentTimezone.utc(1483228800000);
const julyMoment = MomentTimezone.utc(1498867200000);

describe('test Utils', () => {
  test("Tests Utils.getAllMethodNames()", () => {
    class baseClass {
      constructor() {
      }

      private privateMethod() {
      }

      protected protectedMethod() {
      }

      public publicMethod() {
      }
    }

    class subClass extends baseClass {
      constructor() {
        super();
      }

      private subClassPrivateMethod() {
      }

      protected subClassProtectedMethod() {
      }

      public subClassPublicMethod() {
      }
    }

    const expectedMethods: Array<string> = ["constructor", "privateMethod", "protectedMethod", "publicMethod",
      "subClassPrivateMethod", "subClassProtectedMethod", "subClassPublicMethod"];
    expect(Utils.getAllMethodNames(new subClass())).toEqual(expectedMethods);

    const expectedMethodsWithoutConstructor: Array<string> = ["privateMethod", "protectedMethod", "publicMethod", "subClassPrivateMethod",
      "subClassProtectedMethod", "subClassPublicMethod"];
    expect(Utils.getAllMethodNames(new subClass(), true)).toEqual(expectedMethodsWithoutConstructor);
  });
});

describe('Test TimeZone', () => {
  test("Gets the raw offset for Australia/Eucla", () => {
    const result = TimeZone.getRawOffset("Australia/Eucla");
    const expected = 8.75 * 60 * 60 * 1000;
    expect(result).toEqual(expected);
  });

  test("Gets the raw offset for Australia/Eucla on 2019/01/01 00:00:00Z", () => {
    const result = TimeZone.getOffset("Australia/Eucla", januaryMoment.valueOf());
    const expected = 8.75 * 60 * 60 * 1000;
    expect(result).toEqual(expected);
  });

  test("Gets the raw offset for Australia/Eucla on 2019/07/01 00:00:00Z", () => {
    const result = TimeZone.getOffset("Australia/Eucla", julyMoment.valueOf());
    const expected = 8.75 * 60 * 60 * 1000;
    expect(result).toEqual(expected);
  });
});

// TODO: TimeZone.getDisplayName()
// TODO: Zman

describe('Test Calendar', () => {
  test('Calendar.getZoneOffset()', () => {
    const januaryResult = Calendar.getZoneOffset(januaryMoment.tz('America/New_York'));
    expect(januaryResult).toEqual(-5 * 60 * 1000);
    const julyResult = Calendar.getZoneOffset(julyMoment.tz('America/New_York'));
    expect(julyResult).toEqual(-4 * 60 * 1000);
  });

  test('Calendar.getDstOffset()', () => {
    const januaryResult = Calendar.getDstOffset(januaryMoment.tz('America/New_York'));
    expect(januaryResult).toEqual(0);
    const julyResult = Calendar.getDstOffset(julyMoment.tz('America/New_York'));
    expect(julyResult).toEqual(60 * 60 * 1000);
  });
});

describe('Test MathUtils', () => {
  test('MathUtils.degreesToRadians()', () => {
    const result = MathUtils.degreesToRadians(90);
    expect(result).toEqual(Math.PI / 2);
  });

  test('MathUtils.radiansToDegrees()', () => {
    const result = MathUtils.radiansToDegrees(Math.PI / 2);
    expect(result).toEqual(90);
  });
});

describe('Test StringUtils', () => {
  test("test StringUtils.compareTo()", () => {
    expect(StringUtils.compareTo("test3.ts", "test3.ts")).toEqual(0);

    expect(StringUtils.compareTo("test1234", "test1.ts")).toEqual(4);

    expect(StringUtils.compareTo("test1.ts", "test1234")).toEqual(-4);

    expect(StringUtils.compareTo("test12", "test234")).toEqual(-1);
  });
});

describe('Test DateUtils', () => {
  test("test DateUtils.compareTo()", () => {
    const januaryDate = januaryMoment.toDate();
    const julyDate = julyMoment.toDate();

    expect(DateUtils.compareTo(januaryDate, januaryDate)).toEqual(0);

    expect(DateUtils.compareTo(januaryDate, julyDate)).toEqual(-1);

    expect(DateUtils.compareTo(julyDate, januaryDate)).toEqual(1);
  });
});

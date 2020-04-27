import { DateTime } from 'luxon';
import { MathUtils, StringUtils, TimeZone, Utils } from '../src/polyfills/Utils';

const janDateTime = DateTime.fromMillis(1483228800000, { zone: 'UTC' });
const julyDateTime = DateTime.fromMillis(1498867200000, { zone: 'UTC' });

describe('test Utils', function () {
  test('Tests Utils.getAllMethodNames()', function () {
    class BaseClass {
      constructor() {
      }

      private privateMethod() {
      }

      protected protectedMethod() {
      }

      public publicMethod() {
      }
    }

    class SubClass extends BaseClass {
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

    const expectedMethods: Array<string> = ['constructor', 'privateMethod', 'protectedMethod', 'publicMethod',
      'subClassPrivateMethod', 'subClassProtectedMethod', 'subClassPublicMethod'];
    expect(Utils.getAllMethodNames(new SubClass())).toEqual(expectedMethods);

    const expectedMethodsWithoutConstructor: Array<string> = ['privateMethod', 'protectedMethod', 'publicMethod', 'subClassPrivateMethod',
      'subClassProtectedMethod', 'subClassPublicMethod'];
    expect(Utils.getAllMethodNames(new SubClass(), true)).toEqual(expectedMethodsWithoutConstructor);
  });
});

describe('Test TimeZone', function () {
  test('Gets the raw offset for Australia/Eucla', function () {
    const result = TimeZone.getRawOffset('Australia/Eucla');
    const expected = 8.75 * 60 * 60 * 1000;
    expect(result).toEqual(expected);
  });

  test('Gets the raw offset for Australia/Eucla on 2019/01/01 00:00:00Z', function () {
    const result = TimeZone.getOffset('Australia/Eucla', janDateTime.valueOf());
    const expected = 8.75 * 60 * 60 * 1000;
    expect(result).toEqual(expected);
  });

  test('Gets the raw offset for Australia/Eucla on 2019/07/01 00:00:00Z', function () {
    const result = TimeZone.getOffset('Australia/Eucla', julyDateTime.valueOf());
    const expected = 8.75 * 60 * 60 * 1000;
    expect(result).toEqual(expected);
  });
});

// TODO: TimeZone.getDisplayName()
// TODO: Zman

describe('Test MathUtils', function () {
  test('MathUtils.degreesToRadians()', function () {
    const result = MathUtils.degreesToRadians(90);
    expect(result).toEqual(Math.PI / 2);
  });

  test('MathUtils.radiansToDegrees()', function () {
    const result = MathUtils.radiansToDegrees(Math.PI / 2);
    expect(result).toEqual(90);
  });
});

describe('Test StringUtils', function () {
  test('test StringUtils.compareTo()', function () {
    expect(StringUtils.compareTo('test3.ts', 'test3.ts')).toEqual(0);

    expect(StringUtils.compareTo('test1234', 'test1.ts')).toEqual(4);

    expect(StringUtils.compareTo('test1.ts', 'test1234')).toEqual(-4);

    expect(StringUtils.compareTo('test12', 'test234')).toEqual(-1);
  });
});

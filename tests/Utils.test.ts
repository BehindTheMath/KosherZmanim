// eslint-disable-next-line max-classes-per-file
import { describe, it } from 'mocha';
import { assert } from 'chai';

import { Temporal } from 'temporal-polyfill';

import { MathUtils, StringUtils, TimeZone, Utils, padZeros } from '../src/polyfills/Utils';

const janDateTime = Temporal.Instant.fromEpochMilliseconds(1483228800000)
  .toZonedDateTimeISO('UTC').toPlainDate();
const julyDateTime = Temporal.Instant.fromEpochMilliseconds(1498867200000)
  .toZonedDateTimeISO('UTC').toPlainDate();

describe('Test Utils', function () {
  it('Tests Utils.getAllMethodNames()', function () {
    class BaseClass {
      // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
      constructor() {
      }

      // eslint-disable-next-line class-methods-use-this
      private privateMethod() {
      }

      // eslint-disable-next-line class-methods-use-this
      protected protectedMethod() {
      }

      // eslint-disable-next-line class-methods-use-this
      public publicMethod() {
      }
    }

    class SubClass extends BaseClass {
      // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
      constructor() {
        super();
      }

      // eslint-disable-next-line class-methods-use-this
      private subClassPrivateMethod() {
      }

      // eslint-disable-next-line class-methods-use-this
      protected subClassProtectedMethod() {
      }

      // eslint-disable-next-line class-methods-use-this
      public subClassPublicMethod() {
      }
    }

    const expectedMethods: Array<string> = [
      'constructor',
      'privateMethod',
      'protectedMethod',
      'publicMethod',
      'subClassPrivateMethod',
      'subClassProtectedMethod',
      'subClassPublicMethod',
    ];
    assert.deepStrictEqual(Utils.getAllMethodNames(new SubClass()), expectedMethods);

    const expectedMethodsWithoutConstructor: Array<string> = [
      'privateMethod',
      'protectedMethod',
      'publicMethod',
      'subClassPrivateMethod',
      'subClassProtectedMethod',
      'subClassPublicMethod',
    ];
    assert.deepStrictEqual(Utils.getAllMethodNames(new SubClass(), true), expectedMethodsWithoutConstructor);
  });
});

describe('Test TimeZone', function () {
  it('Gets the raw offset for Australia/Eucla', function () {
    const result = TimeZone.getRawOffset('Australia/Eucla');
    const expected = 8.75 * 60 * 60 * 1000;
    assert.strictEqual(result, expected);
  });

  it('Gets the raw offset for Australia/Eucla on 2019/01/01 00:00:00Z', function () {
    const zdt = janDateTime.toZonedDateTime({ timeZone: 'Australia/Eucla' });
    const result = TimeZone.getOffset('Australia/Eucla', zdt.epochMilliseconds);
    const expected = 8.75 * 60 * 60 * 1000;
    assert.strictEqual(result, expected);
  });

  it('Gets the raw offset for Australia/Eucla on 2019/07/01 00:00:00Z', function () {
    const zdt = julyDateTime.toZonedDateTime({ timeZone: 'Australia/Eucla' });
    const result = TimeZone.getOffset('Australia/Eucla', zdt.epochMilliseconds);
    const expected = 8.75 * 60 * 60 * 1000;
    assert.strictEqual(result, expected);
  });
});

// TODO: Zman

describe('Test MathUtils', function () {
  it('MathUtils.degreesToRadians()', function () {
    const result = MathUtils.degreesToRadians(90);
    assert.strictEqual(result, Math.PI / 2);
  });

  it('MathUtils.radiansToDegrees()', function () {
    const result = MathUtils.radiansToDegrees(Math.PI / 2);
    assert.strictEqual(result, 90);
  });
});

describe('Test StringUtils', function () {
  it('test StringUtils.compareTo()', function () {
    assert.strictEqual(StringUtils.compareTo('test3.ts', 'test3.ts'), 0);

    assert.strictEqual(StringUtils.compareTo('test1234', 'test1.ts'), 4);

    assert.strictEqual(StringUtils.compareTo('test1.ts', 'test1234'), -4);

    assert.strictEqual(StringUtils.compareTo('test12', 'test234'), -1);
  });
});

describe('Test `padZeros()`', function () {
  it('test padding `1.234` to 3 places', function () {
    assert.strictEqual(padZeros(1.234, 3), '001');
  });

  it('test padding `1234.56` to 3 places', function () {
    assert.strictEqual(padZeros(1234.56, 3), '1234');
  });
});

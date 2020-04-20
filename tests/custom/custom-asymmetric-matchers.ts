import { AsymmetricMatcher } from './asymmetric-matcher';

/**
 * This sometimes returns false negatives if another assertion failed.
 */
class ToBeOneOf extends AsymmetricMatcher<any[]> {
  constructor(sample: any[], inverse: boolean = false) {
    super(sample);
    this.inverse = inverse;
  }

  asymmetricMatch(actual: any) {
    const result = this.sample.includes(actual);

    return this.inverse ? !result : result;
  }

  toString() {
    return `${this.inverse ? 'Not' : ''}OneOf`;
  }

  getExpectedType() {
    return 'Any[]';
  }

  toAsymmetricMatcher() {
    return `${this.toString()}: ${JSON.stringify(this.sample)}`;
  }
}

export const toBeOneOf = (expected: any[]): ToBeOneOf => new ToBeOneOf(expected);
export const toNotBeOneOf = (expected: any[]): ToBeOneOf => new ToBeOneOf(expected, true);

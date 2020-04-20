// https://github.com/facebook/jest/blob/3681cca5f53f901715ab0064c5bf78f463914498/packages/expect/src/asymmetricMatchers.ts#L13
export class AsymmetricMatcher<T> {
  /**
   * expected
   */
  protected sample: T;
  $$typeof: symbol;
  inverse?: boolean;

  constructor(sample: T) {
    this.$$typeof = Symbol.for('jest.asymmetricMatcher');
    this.sample = sample;
  }
}

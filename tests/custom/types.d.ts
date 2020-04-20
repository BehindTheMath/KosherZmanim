declare global {
  namespace jest {
    interface Matchers<R> {
      toBeOneOf(items: Array<any>): CustomMatcherResult;
    }
  }
}

export const undefined;

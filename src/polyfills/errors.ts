/* eslint-disable max-classes-per-file */
class BaseCustomError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NullPointerException extends BaseCustomError {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }
}

export class IllegalArgumentException extends BaseCustomError {}

export class UnsupportedError extends BaseCustomError {}

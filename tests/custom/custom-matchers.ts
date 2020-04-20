// Based on https://stackoverflow.com/a/58583430/8037425
expect.extend({
  toBeOneOf(received: any, items: Array<any>) {
    return {
      message: () => `expected ${received} to be contained in array [${items}]`,
      pass: items.includes(received),
    };
  },
});

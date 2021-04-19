import index from '../src';

describe('Test cli', () => {
  it('should be 1', () => {
    expect(index()).toBe(1);
  });
});

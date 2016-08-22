import { expect } from 'chai';
import addMarkups from '../../src/utils/addMarkups';

describe('addMarkup()', () => {
  it('maps tag names to individual markers', () => {
    const markups = [
      ['b'],
      ['a']
    ];
    const markers = [
      [[], 0, 'Normal'],
      [[1], 0, 'Linked'],
      [[0], 2, 'Bold']
    ];

    expect(addMarkups(markups, markers)).to.eql([
      [[], 0, 'Normal'],
      [['a'], 0, 'Linked'],
      [['b'], 2, 'Bold']
    ]);
  });
});

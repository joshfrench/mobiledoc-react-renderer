import { expect } from 'chai';
import addMarkups from '../../src/utils/addMarkups';

describe('addMarkup()', () => {
  it('maps marker indices to tag names', () => {
    const markups = [
      ['b'],
      ['a']
    ];
    const tree = [1, [[0, ['bold link']]]];

    expect(addMarkups(markups, tree)).to.eql(['a', [['b', ['bold link']]]]);
  });
});

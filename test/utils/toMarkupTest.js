import { expect } from 'chai';
import toMarkup from '../../src/utils/toMarkup';

describe('addMarkup()', () => {
  it('maps marker indices to tag names', () => {
    const markups = [
      ['b'],
      ['a']
    ];
    const markers = ['Plain text', [1, [[0, ['bold link']]]]];

    const mapper = toMarkup(markups);
    expect(markers.map(mapper)).to.eql(['Plain text', ['a', [['b', ['bold link']]]]]);
  });
});

import { expect } from 'chai';
import { MARKUP_SECTION_TYPE, MARKUP_MARKER_TYPE } from '../src/utils/nodeTypes';
import { addMarkups } from '../src/Tree';

describe('addMarkups()', () => {
  it('maps markup markers to nodes', () => {
    const markups = [
      ['a', ['rel', 'nofollow']]
    ];
    const tree = [MARKUP_SECTION_TYPE, 'p', [
      [MARKUP_MARKER_TYPE, 0, ['ohai']]
    ]];
    console.log(JSON.stringify(addMarkups(markups, tree)));
    expect(addMarkups(markups, tree)).to.eql([
      MARKUP_SECTION_TYPE, 'p', {}, [
        [MARKUP_MARKER_TYPE, 'a', {rel: 'nofollow'}, ['ohai']]
      ]
    ]);
  });
});

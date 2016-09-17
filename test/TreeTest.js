import { shallow } from 'enzyme';
import { expect } from 'chai';
import { nodesToTags } from '../src/Tree';
import {
  MARKUP_SECTION_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../src/utils/nodeTypes';

describe('nodesToTags()', () => {
  it('maps markup markers to nodes', () => {
    const markups = [
      ['a', ['rel', 'nofollow']]
    ];
    const tree = [MARKUP_SECTION_TYPE, 'p', [
      [MARKUP_MARKER_TYPE, 0, ['ohai']]
    ]];
    expect(nodesToTags({ markups })(tree)).to.eql([
      MARKUP_SECTION_TYPE, 'p', {}, [
        [MARKUP_MARKER_TYPE, 'a', { 'rel': 'nofollow' }, ['ohai']]
      ]
    ]);
  });

  it('maps atom markers to named nodes', () => {
    const Atom = () => 'ohai';
    Atom.displayName = 'anAtom';

    const atoms = [
      ["anAtom", "@ohai", { id: 42 }]
    ];
    const tree = [MARKUP_SECTION_TYPE, 'p', [
      [ATOM_MARKER_TYPE, 0]
    ]];

    expect(nodesToTags({ atoms }, { atomTypes: [Atom]})(tree)).to.eql([
      MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "anAtom", { payload: { id: 42 }, value: "@ohai" }, []]
      ]
    ]);
  });
});

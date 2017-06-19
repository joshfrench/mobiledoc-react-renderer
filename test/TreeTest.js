import { shallow } from 'enzyme';
import { expect } from 'chai';
import { nodesToTags } from '../src/Tree';
import {
  MARKUP_SECTION_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../src/utils/nodeTypes';
import {
  E_NO_ATOM_AT_INDEX,
  E_UNKNOWN_MARKER_TYPE
} from '../src/utils/Errors';

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

    expect(nodesToTags({ atoms })(tree)).to.eql([
      MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "anAtom", { payload: { id: 42 }, value: "@ohai" }, []]
      ]
    ]);
  });

  it('raises when atom is undefined', () => {
    const tree = [MARKUP_SECTION_TYPE, 'p', [
      [ATOM_MARKER_TYPE, 0]
    ]];

    const noAtoms = () => nodesToTags()(tree);
    expect(noAtoms).to.throw(E_NO_ATOM_AT_INDEX(0));
  });

  it('throws when encountering an unknown marker', () => {
    const markups = [
      ['not-a-tag']
    ];
    const tree = [MARKUP_SECTION_TYPE, 'p', [
      [MARKUP_MARKER_TYPE, 0, ['ohai']]
    ]];
    const unknownMarker = () => nodesToTags({ markups })(tree);
    expect(unknownMarker).to.throw(E_UNKNOWN_MARKER_TYPE('not-a-tag'));
  });

  it('folds `pull-quote` section to div.pull-quote', () => {
    const tree = [MARKUP_SECTION_TYPE, 'pull-quote', ['ohai']];
    expect(nodesToTags()(tree)).to.eql([
      MARKUP_SECTION_TYPE, 'div', { class: 'pull-quote' }, ["ohai"]
    ]);
  });
});

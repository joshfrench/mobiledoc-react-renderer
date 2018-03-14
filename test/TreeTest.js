import { expect } from 'chai';
import { expandNodes } from '../src/Tree';
import {
  CARD_SECTION_TYPE,
  MARKUP_SECTION_TYPE,
  LIST_SECTION_TYPE,
  LIST_ITEM_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../src/utils/nodeTypes';
import {
  E_NO_ATOM_AT_INDEX,
  E_UNKNOWN_MARKER_TYPE,
  E_NO_RENDERING_FUNCTION
} from '../src/utils/Errors';

describe('expandNodes()', () => {
  it('requires a renderer', () => {
    expect(() => expandNodes({}, null)).to.throw(E_NO_RENDERING_FUNCTION);
  });

  it('maps markup markers to nodes', () => {
    const markups = [
      ['a', ['rel', 'nofollow']]
    ];
    const tree = [MARKUP_SECTION_TYPE, 'p', [
      [MARKUP_MARKER_TYPE, 0, ['ohai']]
    ]];

    expect(expandNodes({ markups })(tree)).to.eql([
      MARKUP_SECTION_TYPE, 'p', {}, [
        [MARKUP_MARKER_TYPE, 'a', { 'rel': 'nofollow' }, ['ohai']]
      ]
    ]);
  });

  it('maps card sections to named nodes', () => {
    const Card = ({ name }) => `Hello ${name}`;
    Card.displayName = 'aCard';

    const cards = [['aCard', { name: 'Hodor' }]];
    const tree = [CARD_SECTION_TYPE, 0];

    expect(expandNodes({ cards })(tree)).to.eql([
      CARD_SECTION_TYPE, 'aCard', { payload: { name: 'Hodor' }}, []
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

    expect(expandNodes({ atoms })(tree)).to.eql([
      MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "anAtom", { payload: { id: 42 }, value: "@ohai" }, []]
      ]
    ]);
  });

  it('raises when atom is undefined', () => {
    const tree = [MARKUP_SECTION_TYPE, 'p', [
      [ATOM_MARKER_TYPE, 0]
    ]];

    const noAtoms = () => expandNodes()(tree);
    expect(noAtoms).to.throw(E_NO_ATOM_AT_INDEX(0));
  });

  it('throws when encountering an unknown marker', () => {
    const markups = [
      ['not-a-tag']
    ];
    const tree = [MARKUP_SECTION_TYPE, 'p', [
      [MARKUP_MARKER_TYPE, 0, ['ohai']]
    ]];
    const unknownMarker = () => expandNodes({ markups })(tree);
    expect(unknownMarker).to.throw(E_UNKNOWN_MARKER_TYPE('not-a-tag'));
  });

  it('folds `pull-quote` section to div.pull-quote', () => {
    const tree = [MARKUP_SECTION_TYPE, 'pull-quote', ['ohai']];
    expect(expandNodes()(tree)).to.eql([
      MARKUP_SECTION_TYPE, 'div', { class: 'pull-quote' }, ["ohai"]
    ]);
  });

  it('maps list section children to list items', () => {
    const markups = [
      ['strong']
    ];
    const tree = [LIST_SECTION_TYPE, 'ul', [
      [MARKUP_MARKER_TYPE, 0, ['foo']],
      'bar'
    ]];
    expect(expandNodes({ markups })(tree)).to.eql([
      LIST_SECTION_TYPE, 'ul', {}, [
        [LIST_ITEM_TYPE, 'li', {}, [[MARKUP_MARKER_TYPE, 'strong', {}, ['foo']]]],
        [LIST_ITEM_TYPE, 'li', {}, ['bar']]
      ]
    ]);
  });
});

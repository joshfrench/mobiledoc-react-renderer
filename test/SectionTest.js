import { expect } from 'chai';
import {
  MARKUP_SECTION_TYPE,
  MD_MARKUP_MARKER_TYPE,
  MARKUP_MARKER_TYPE,
  MD_ATOM_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../src/utils/nodeTypes';
import { sectionToTree } from '../src/Section';
import { E_UNALLOWED_SECTION_TAG } from '../src/utils/Errors';

describe('sectionToTree()', () => {
  it('renders a section with a text marker', () => {
    const section = [
      MARKUP_SECTION_TYPE, 'p', [
        [MD_MARKUP_MARKER_TYPE, [], 0, 'ohai']
      ]
    ];

    expect(sectionToTree(section)).to.eql([MARKUP_SECTION_TYPE, 'p', ['ohai']]);
  });

  it('renders a section with multiple text markers', () => {
    const section = [MARKUP_SECTION_TYPE, 'P', [
      [MD_MARKUP_MARKER_TYPE, [], 0, 'A'],
      [MD_MARKUP_MARKER_TYPE, [], 0, 'B']
    ]];

    expect(sectionToTree(section)).to.eql([MARKUP_SECTION_TYPE, 'P', ['A', 'B']]);
  });

  it('renders a section with a markup marker', () => {
    const section = [
      MARKUP_SECTION_TYPE, 'h1', [
        [MD_MARKUP_MARKER_TYPE, [0], 1, 'linked']
      ]
    ];

    expect(sectionToTree(section)).to.eql([MARKUP_SECTION_TYPE, 'h1', [[MARKUP_MARKER_TYPE, 0, ['linked']]]]);
  });

  it('renders a section with simple markup spanning multiple markers', () => {
    const section = [MARKUP_SECTION_TYPE, 'P', [
      [MD_MARKUP_MARKER_TYPE, [0], 0, 'Opens markup 0'],
      [MD_MARKUP_MARKER_TYPE, [], 1, 'Closes markup 0']
    ]];

    expect(sectionToTree(section)).to.eql(
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, 0, ['Opens markup 0', 'Closes markup 0']]]]);
  });

  it('renders a section with nested markup spanning multiple markers', () => {
    const section = [MARKUP_SECTION_TYPE, 'P', [
      [MD_MARKUP_MARKER_TYPE, [0], 0, 'Opens 0'],
      [MD_MARKUP_MARKER_TYPE, [1], 2, 'Opens 1, Closes 1 and 0']
    ]];

    expect(sectionToTree(section)).to.eql(
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, 0, [
          'Opens 0',
          [MARKUP_MARKER_TYPE, 1, ['Opens 1, Closes 1 and 0']]]]]]);
  });

  it('renders a section with intermediary markup', () => {
    const section = [MARKUP_SECTION_TYPE, 'P', [
      [MD_MARKUP_MARKER_TYPE, [0], 0, 'Opens 0'],
      [MD_MARKUP_MARKER_TYPE, [1], 1, 'Opens/closes 1'],
      [MD_MARKUP_MARKER_TYPE, [], 1, 'Closes 0']
    ]];

    expect(sectionToTree(section)).to.eql(
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, 0, [
          'Opens 0',
          [MARKUP_MARKER_TYPE, 1, ['Opens/closes 1']],
          'Closes 0']]]]);
  });

  it('renders a section with a simple atom', () => {
    const section = [
      MARKUP_SECTION_TYPE, 'p', [
        [MD_ATOM_MARKER_TYPE, [], 0, 1]
      ]
    ];

    expect(sectionToTree(section)).to.eql([MARKUP_SECTION_TYPE, 'p', [[ATOM_MARKER_TYPE, 1]]]);
  });

  it('renders a section with nested atoms', () => {
    const section = [
      MARKUP_SECTION_TYPE, 'p', [
        [MD_ATOM_MARKER_TYPE, [2], 1, 3]
      ]
    ]

    expect(sectionToTree(section)).to.eql(
      [MARKUP_SECTION_TYPE, 'p', [
        [MARKUP_MARKER_TYPE, 2, [
          [ATOM_MARKER_TYPE, 3]
        ]]
      ]]
     );
  });

  it('throws when it encounters an unknown or mismatched section type', () => {
    const section = [
      MARKUP_SECTION_TYPE, 'ul', [
        [MD_MARKUP_MARKER_TYPE, [], 0, 'ohai']
      ]
    ];

    const mismatchedSection = () => sectionToTree(section);
    expect(mismatchedSection).to.throw(E_UNALLOWED_SECTION_TAG('ul'));
  });
});

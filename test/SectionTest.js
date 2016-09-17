import { expect } from 'chai';
import {
  MARKUP_SECTION_TYPE,
  MD_MARKUP_MARKER_TYPE,
  MARKUP_MARKER_TYPE,
  MD_ATOM_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../src/utils/nodeTypes';
import { sectionToTree } from '../src/Section';

describe('sectionToTree()', () => {
  it('renders a section with its root tag', () => {
    const section = [
      MARKUP_SECTION_TYPE, 'p', [
        [MD_MARKUP_MARKER_TYPE, [], 0, 'ohai']
      ]
    ];

    expect(sectionToTree(section)).to.eql([MARKUP_SECTION_TYPE, 'p', ['ohai']]);
  });

  it('renders a section with markers', () => {
    const section = [
      MARKUP_SECTION_TYPE, 'div', [
        [MD_MARKUP_MARKER_TYPE, [0], 1, 'linked']
      ]
    ];

    expect(sectionToTree(section)).to.eql([MARKUP_SECTION_TYPE, 'div', [[MARKUP_MARKER_TYPE, 0, ['linked']]]]);
  });

  it('renders a section with atoms', () => {
    const section = [
      MARKUP_SECTION_TYPE, 'p', [
        [MD_ATOM_MARKER_TYPE, [], 0, 1]
      ]
    ];

    expect(sectionToTree(section)).to.eql([MARKUP_SECTION_TYPE, 'p', [[ATOM_MARKER_TYPE, 1]]]);
  });
});

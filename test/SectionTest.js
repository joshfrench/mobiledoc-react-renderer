import { expect } from 'chai';
import { MARKUP_SECTION_TYPE, MARKUP_MARKER_TYPE } from '../src/utils/nodeTypes';
import { sectionToTree } from '../src/Section';

describe('sectionToTree()', () => {
  it('renders a section with its root tag', () => {
    const section = [
      1, 'p', [
        [[], 0, 'ohai']
      ]
    ];

    expect(sectionToTree(section)).to.eql([MARKUP_SECTION_TYPE, 'p', ['ohai']]);
  });

  it('renders a section with markers', () => {
    const section = [
      1, 'div', [
        [[0], 1, 'linked']
      ]
    ];

    expect(sectionToTree(section)).to.eql([MARKUP_SECTION_TYPE, 'div', [[MARKUP_MARKER_TYPE, 0, ['linked']]]]);
  });
});

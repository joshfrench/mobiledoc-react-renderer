import { expect } from 'chai';
import { sectionToTree } from '../src/Section';

describe('sectionToTree()', () => {
  it('renders a section with its root tag', () => {
    const section = [
      1, 'p', [
        [[], 0, 'ohai']
      ]
    ];

    expect(sectionToTree(section)).to.eql(['p', ['ohai']]);
  });

  it('renders a section with markers', () => {
    const section = [
      1, 'div', [
        [[0], 1, 'linked']
      ]
    ];

    expect(sectionToTree(section)).to.eql(['div', [[0, ['linked']]]]);
  });
});

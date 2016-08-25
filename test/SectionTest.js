import { expect } from 'chai';
import { toTree } from '../src/Section';

describe('Section.toTree()', () => {
  it('renders a section with its root tag', () => {
    const section = [
      1, 'p', [
        [[], 0, 'ohai']
      ]
    ];

    expect(toTree(section)).to.eql(['p', ['ohai']]);
  });

  it('renders a section with markers', () => {
    const section = [
      1, 'div', [
        [[0], 1, 'linked']
      ]
    ];

    expect(toTree(section)).to.eql(['div', [[0, ['linked']]]]);
  });
});

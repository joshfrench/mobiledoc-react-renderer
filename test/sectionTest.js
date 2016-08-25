import { expect } from 'chai';
import renderSection from '../src/section';

describe('renderSection', () => {
  it('renders a section with its root tag', () => {
    const section = [
      1, 'p', [
        [[], 0, 'ohai']
      ]
    ];

    expect(renderSection(section)).to.eql(['p', ['ohai']]);
  });

  it('renders a section with markers', () => {
    const section = [
      1, 'div', [
        [[0], 1, 'linked']
      ]
    ];

    expect(renderSection(section)).to.eql(['div', [[0, ['linked']]]]);
  });
});

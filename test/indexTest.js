import { expect } from 'chai';
import markersToTree from '../src/index';

const tree = ['P', []];

describe('markersToTree()', () => {
  it('renders a simple marker', () => {
    const markers = [
      [[], 0, 'No children']
    ];
    expect(markers.reduce(markersToTree, [tree])).to.eql(['P', ['No children']]);
  });

  it('does not mutate original', () => {
    const markers = [
      [[], 0, '.']
    ];
    markers.reduce(markersToTree, [tree]);
    expect(tree).to.eql(['P', []]);
  });
});

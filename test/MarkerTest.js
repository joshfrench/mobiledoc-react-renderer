import { expect } from 'chai';
import { markersToMarkup, markersToTree } from '../src/Marker';

const tree = ['P', []];
let result;

describe('markersToTree()', () => {
  it('renders a simple marker', () => {
    const markers = [
      [[], 0, 'No children']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(['P', ['No children']]);
  });

  it('does not mutate original', () => {
    const markers = [
      [[], 0, '.']
    ];
    markers.reduce(markersToTree, [tree]);
    expect(tree).to.eql(['P', []]);
  });

  it('renders multiple markers', () => {
    const markers = [
      [[], 0, 'A'],
      [[], 0, 'B']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(['P', ['A', 'B']]);
  });

  it('renders simple nested marker', () => {
    const markers = [
      [[0], 0, 'Opens markup 0'],
      [[], 1, 'Closes markup 0']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      ['P', [
        [0, ['Opens markup 0', 'Closes markup 0']]]]);
  });

  it('renders multiple nested markers', () => {
    const markers = [
      [[0], 0, 'Opens 0'],
      [[1], 2, 'Opens 1, Closes 1 and 0']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      ['P', [
        [0, [
          'Opens 0',
          [1, ['Opens 1, Closes 1 and 0']]]]]]);
  });

  it('closes intermediary tags', () => {
    const markers = [
      [[0], 0, 'Opens 0'],
      [[1], 1, 'Opens/closes 1'],
      [[], 1, 'Closes 0']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      ['P', [
        [0, [
          'Opens 0',
          [1, ['Opens/closes 1']],
          'Closes 0']]]]);
  });
});

describe('markersToMarkup()', () => {
  it('maps marker indices to tag names', () => {
    const markups = [
      ['b'],
      ['a', ['rel', 'nofollow']]
    ];
    const markers = ['Plain text', [1, [[0, ['bold link']]]]];

    const mapper = markersToMarkup(markups);
    expect(markers.map(mapper)).to.eql(['Plain text', ['a', { rel: 'nofollow' }, [['b', {}, ['bold link']]]]]);
  });
});

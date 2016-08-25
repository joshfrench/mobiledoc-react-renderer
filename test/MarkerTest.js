import { expect } from 'chai';
import { MARKUP_SECTION_TYPE, MARKUP_MARKER_TYPE } from '../src/utils/nodeTypes';
import { markersToMarkup, markersToTree } from '../src/Marker';

const tree = [MARKUP_SECTION_TYPE, 'P', []];
let result;

describe('markersToTree()', () => {
  it('renders a simple marker', () => {
    const markers = [
      [[], 0, 'No children']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql([MARKUP_SECTION_TYPE, 'P', ['No children']]);
  });

  it('does not mutate original', () => {
    const markers = [
      [[], 0, '.']
    ];
    markers.reduce(markersToTree, [tree]);
    expect(tree).to.eql([MARKUP_SECTION_TYPE, 'P', []]);
  });

  it('renders multiple markers', () => {
    const markers = [
      [[], 0, 'A'],
      [[], 0, 'B']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql([MARKUP_SECTION_TYPE, 'P', ['A', 'B']]);
  });

  it('renders simple nested marker', () => {
    const markers = [
      [[0], 0, 'Opens markup 0'],
      [[], 1, 'Closes markup 0']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, 0, ['Opens markup 0', 'Closes markup 0']]]]);
  });

  it('renders multiple nested markers', () => {
    const markers = [
      [[0], 0, 'Opens 0'],
      [[1], 2, 'Opens 1, Closes 1 and 0']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, 0, [
          'Opens 0',
          [MARKUP_MARKER_TYPE, 1, ['Opens 1, Closes 1 and 0']]]]]]);
  });

  it('closes intermediary tags', () => {
    const markers = [
      [[0], 0, 'Opens 0'],
      [[1], 1, 'Opens/closes 1'],
      [[], 1, 'Closes 0']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, 0, [
          'Opens 0',
          [MARKUP_MARKER_TYPE, 1, ['Opens/closes 1']],
          'Closes 0']]]]);
  });
});

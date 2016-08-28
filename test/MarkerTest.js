import { expect } from 'chai';
import { markersToTree } from '../src/Marker';
import {
  MARKUP_SECTION_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../src/utils/nodeTypes';

const tree = [MARKUP_SECTION_TYPE, 'P', []];
let result;

describe('markersToTree()', () => {
  it('renders a simple marker', () => {
    const markers = [
      [0, [], 0, 'No children']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql([MARKUP_SECTION_TYPE, 'P', ['No children']]);
  });

  it('does not mutate original', () => {
    const markers = [
      [0, [], 0, '.']
    ];
    markers.reduce(markersToTree, [tree]);
    expect(tree).to.eql([MARKUP_SECTION_TYPE, 'P', []]);
  });

  it('renders multiple markers', () => {
    const markers = [
      [0, [], 0, 'A'],
      [0, [], 0, 'B']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql([MARKUP_SECTION_TYPE, 'P', ['A', 'B']]);
  });

  it('renders simple nested marker', () => {
    const markers = [
      [0, [0], 0, 'Opens markup 0'],
      [0, [], 1, 'Closes markup 0']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, 0, ['Opens markup 0', 'Closes markup 0']]]]);
  });

  it('renders multiple nested markers', () => {
    const markers = [
      [0, [0], 0, 'Opens 0'],
      [0, [1], 2, 'Opens 1, Closes 1 and 0']
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
      [0, [0], 0, 'Opens 0'],
      [0, [1], 1, 'Opens/closes 1'],
      [0, [], 1, 'Closes 0']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, 0, [
          'Opens 0',
          [MARKUP_MARKER_TYPE, 1, ['Opens/closes 1']],
          'Closes 0']]]]);
  });

  it('renders a simple atom', () => {
    const markers = [
      [1, [], 0, 0]
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      [MARKUP_SECTION_TYPE, 'P', [
        [ATOM_MARKER_TYPE, 0]
      ]]
    );
  });

  it('renders a nested atom', () => {
    const markers = [
      [1, [2], 1, 3]
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, 2, [
          [ATOM_MARKER_TYPE, 3]
        ]]
      ]]
     );
  });
});

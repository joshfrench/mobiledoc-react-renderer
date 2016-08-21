import { expect } from 'chai';
import markersToTree from '../../src/utils/markersToTree';

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
      [['A'], 0, 'Opens A'],
      [[], 1, 'Closes A']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      ['P', [
        ['A', ['Opens A', 'Closes A']]]]);
  });

  it('renders multiple nested markers', () => {
    const markers = [
      [['A'], 0, 'Opens A'],
      [['B'], 2, 'Opens B, Closes A and B']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      ['P', [
        ['A', [
          'Opens A',
          ['B', ['Opens B, Closes A and B']]]]]]);
  });

  it('closes intermediary tags', () => {
    const markers = [
      [['A'], 0, 'Opens A'],
      [['B'], 1, 'Opens/closes B'],
      [[], 1, 'Closes A']
    ];
    [result] = markers.reduce(markersToTree, [tree]);
    expect(result).to.eql(
      ['P', [
        ['A', [
          'Opens A',
          ['B', ['Opens/closes B']],
          'Closes A']]]]);
  });
});

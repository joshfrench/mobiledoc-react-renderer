import { markersToTree } from '../src/index';
import React from 'react';
import ReactDOM from 'react-dom';

window.React = React;

window.markersToTree = markersToTree;
window.tree = ['P', []];
window.markers = [
  [[], 0, 'A'],
  [[], 0, 'B']
];

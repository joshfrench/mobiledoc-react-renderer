import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { sectionToTree, mapMarkers } from './Section';
import { markersToMarkup } from './Marker';
import treeToReact from './utils/treeToReact';

const MobiledocRenderer = ({ mobiledoc, rootElement = 'div', ...props }) => {
  const { markups, sections } = mobiledoc;
  const toMarkup = markersToMarkup(markups);
  const children = sections.map(sectionToTree)
                           .map(mapMarkers(toMarkup))
                           .map(treeToReact);

  return React.createElement(rootElement, props, children);
};

export default MobiledocRenderer;

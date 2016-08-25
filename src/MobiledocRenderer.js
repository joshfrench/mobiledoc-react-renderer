import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { sectionToTree, mapMarkers } from './Section';
import { markersToMarkup } from './Marker';
import treeToReact from './utils/treeToReact';

const MobiledocRenderer = ({ mobiledoc }) => {
  const { markups, sections } = mobiledoc;
  const toMarkup = markersToMarkup(markups);
  const sectionsWithMarkup = sections.map(sectionToTree)
                                     .map(mapMarkers(toMarkup));

  return (
    <div>
      {sectionsWithMarkup.map(treeToReact)}
    </div>
  );
};

export default MobiledocRenderer;

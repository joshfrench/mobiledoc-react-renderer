import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { sectionToTree } from './Section';
import { nodesToTags, treeToReact } from './Tree';

const MobiledocRenderer = ({ mobiledoc, rootElement = 'div', sectionElementRenderer, atoms: atomTypes, ...props }) => {
  const { markups, atoms, sections } = mobiledoc;
  const children = sections.map(sectionToTree)
                           .map(nodesToTags({ markups, atoms }, { atomTypes }))
                           .map(treeToReact({ sectionElementRenderer }));

  return React.createElement(rootElement, props, children);
};

export default MobiledocRenderer;

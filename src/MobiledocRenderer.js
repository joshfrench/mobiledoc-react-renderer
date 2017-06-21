import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { sectionToTree } from './Section';
import { nodesToTags } from './Tree';
import { treeToReact } from './ReactRenderer';

// TODO: add cards, markup renderer
const MobiledocRenderer = ({ mobiledoc, rootElement = 'div', sectionElementRenderer, atoms, ...props }) => {
  const children = mobiledoc.sections.map(sectionToTree)
                                     .map(nodesToTags(mobiledoc))
                                     .map(treeToReact({ sectionElementRenderer, atoms }));

  return React.createElement(rootElement, props, children);
};

export default MobiledocRenderer;

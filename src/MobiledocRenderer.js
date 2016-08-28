import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { sectionToTree } from './Section';
import { nodesToTags, treeToReact } from './Tree';

const MobiledocRenderer = ({ mobiledoc, rootElement = 'div', sectionElementRenderer, ...props }) => {
  const { markups, sections } = mobiledoc;
  const children = sections.map(sectionToTree)
                           .map(nodesToTags({ markups }))
                           .map(treeToReact({ sectionElementRenderer }));

  return React.createElement(rootElement, props, children);
};

export default MobiledocRenderer;

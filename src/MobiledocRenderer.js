import React from 'react';
import { sectionToTree } from './Section';
import { expandNodes } from './Tree';
import ReactRenderer from './ReactRenderer';

const MobiledocRenderer = ({ mobiledoc = {}, rootElement = 'div',
                             sectionElementRenderer, markupElementRenderer,
                             atoms = [], cards = [],
                             unknownCardHandler, unknownAtomHandler,
                             ...props }) => {
  mobiledoc.sections = mobiledoc.sections || [];
  const renderer = new ReactRenderer({ cards, atoms, sectionElementRenderer, markupElementRenderer, unknownCardHandler, unknownAtomHandler });
  const children = mobiledoc.sections.map(sectionToTree)
                                     .map(expandNodes(mobiledoc, renderer));

  return React.createElement(rootElement, props, children);
};

export default MobiledocRenderer;

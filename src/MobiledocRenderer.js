import React from 'react';
import { sectionToTree } from './Section';
import { nodesToTags } from './Tree';
import { nodeToComponent } from './ReactRenderer';

const MobiledocRenderer = ({ mobiledoc = {}, rootElement = 'div',
                             sectionElementRenderer, markupElementRenderer,
                             atoms = [], cards = [],
                             unknownCardHandler, unknownAtomHandler,
                             ...props }) => {
  mobiledoc.sections = mobiledoc.sections || [];
  const children = mobiledoc.sections.map(sectionToTree)
                                     .map(nodesToTags(mobiledoc))
                                     .map(nodeToComponent({ cards, atoms,
                                                            sectionElementRenderer, markupElementRenderer,
                                                            unknownCardHandler, unknownAtomHandler }));

  return React.createElement(rootElement, props, children);
};

export default MobiledocRenderer;

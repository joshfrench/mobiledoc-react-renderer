import React from 'react';
import { sectionToTree } from './Section';
import { nodesToTags } from './Tree';
import { treeToReact } from './ReactRenderer';

const MobiledocRenderer = ({ mobiledoc = {}, rootElement = 'div', sectionElementRenderer, markupElementRenderer, atoms, cards, ...props }) => {
  mobiledoc.sections = mobiledoc.sections || [];
  const children = mobiledoc.sections.map(sectionToTree)
                                     .map(nodesToTags(mobiledoc))
                                     .map(treeToReact({ sectionElementRenderer, markupElementRenderer, cards, atoms }));

  return React.createElement(rootElement, props, children);
};

export default MobiledocRenderer;

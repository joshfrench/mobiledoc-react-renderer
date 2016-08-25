import React from 'react';

const makeChild = (c) => Array.isArray(c) ? treeToReact(c) : c;
const treeToReact = ([tagName, attrs, children = []]) => React.createElement(tagName, attrs, children.map(makeChild));
export default treeToReact;

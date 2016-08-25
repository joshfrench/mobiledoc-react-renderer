import React from 'react';

const makeChild = (c) => Array.isArray(c) ? treeToReact(c) : c;
const treeToReact = ([nodeType, tagName, children = []]) => React.createElement(tagName, {}, children.map(makeChild));
export default treeToReact;

import React from 'react';
import { MARKUP_SECTION_TYPE, MARKUP_MARKER_TYPE } from './utils/nodeTypes';

const kvReduce = (obj, key, i, arr) => {
  if (i % 2 === 0) {
    obj[key] = arr[i + 1];
  }
  return obj;
};

export const nodesToTags = (markups) => {
  const getTagFor = ([type, tag]) => {
    switch (type) {
    case MARKUP_MARKER_TYPE: {
      const [tagname, attrs = []] = markups[tag];
      return [tagname, attrs.reduce(kvReduce, {})];
    }
    default:
      return [tag, {}];
    }
  };

  return (node) => {
    if (Array.isArray(node)) {
      const [type, tag, children = []] = node;
      const [tagName, attrs] = getTagFor(node);
      return [type, tagName, attrs, children.map(nodesToTags(markups))];
    } else {
      return node;
    }
  };
};

const makeChild = (c) => Array.isArray(c) ? treeToReact(c) : c;

export const treeToReact = ([nodeType, tag, attrs, children = []], opts = {}) => {
  const sectionElementRenderer = opts.sectionElementRenderer || {};
  const tagName = tag.toLowerCase();
  // TODO: validate accepted tags
  if (nodeType === MARKUP_SECTION_TYPE && sectionElementRenderer[tagName]) {
    tag = sectionElementRenderer[tagName];
  }
  return React.createElement(tag, attrs, children.map(makeChild));
};

import React from 'react';
import { MARKUP_SECTION_TYPE, MARKUP_MARKER_TYPE } from './utils/nodeTypes';

const kvReduce = (obj, key, i, arr) => {
  if (i % 2 === 0) {
    obj[key] = arr[i + 1];
  }
  return obj;
};

const getTagFor = (markups, [type, tag]) => {
  switch (type) {
  case MARKUP_MARKER_TYPE: {
    const [tagname, attrs = []] = markups[tag];
    return [tagname, attrs.reduce(kvReduce, {})];
  }
  default:
    return [tag, {}];
  }
};

export const nodesToTags = (markups) => {
  return (node) => {
    if (Array.isArray(node)) {
      const [type, tag, children = []] = node;
      const [tagName, attrs] = getTagFor(markups, node);
      return [type, tagName, attrs, children.map(nodesToTags(markups))];
    } else {
      return node;
    }
  };
};

const makeChild = (opts = {}) => (c) => Array.isArray(c) ? treeToReact(opts)(c) : c;

export const treeToReact = (opts = {}) => {
  const _sectionElementRenderer = {};
  if (opts.sectionElementRenderer) {
    for (const key in opts.sectionElementRenderer) {
      if (opts.sectionElementRenderer.hasOwnProperty(key)) {
        _sectionElementRenderer[key.toLowerCase()] = opts.sectionElementRenderer[key];
      }
    }
  }

  return ([nodeType, tag, attrs, children = []]) => {
    let tagName = tag.toLowerCase();
    // TODO: validate accepted tags
    if (nodeType === MARKUP_SECTION_TYPE && _sectionElementRenderer[tagName]) {
      tagName = _sectionElementRenderer[tagName];
    }
    return React.createElement(tagName, attrs, children.map(makeChild(opts)));
  };
};

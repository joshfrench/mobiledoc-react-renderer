import React from 'react';
import { MARKUP_SECTION_TYPE, MARKUP_MARKER_TYPE } from './utils/nodeTypes';
import { isValidSectionTagName, isMarkupSectionElementName } from './utils/tagNames';

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

    switch (nodeType) {
    case MARKUP_SECTION_TYPE: {
      if (!isValidSectionTagName(tagName, MARKUP_SECTION_TYPE)) {
        return null;
      }
      if (_sectionElementRenderer[tagName]) {
        tagName = _sectionElementRenderer[tagName];
      } else if (!isMarkupSectionElementName(tagName)) {
        attrs = { ...attrs, 'className': tagName };
        tagName = 'div';
      }
      break;
    }

    case MARKUP_MARKER_TYPE: {
      // TODO: validate tags
      break;
    }

    default: return null;
    }

    return React.createElement(tagName, attrs, children.map((c) => {
      return Array.isArray(c) ? treeToReact(opts)(c) : c;
    }));
  };
};

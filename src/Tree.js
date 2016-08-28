import React from 'react';
import { isValidSectionTagName, isMarkupSectionElementName } from './utils/tagNames';
import {
  MARKUP_SECTION_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from './utils/nodeTypes';

const kvReduce = (obj, key, i, arr) => {
  if (i % 2 === 0) {
    obj[key] = arr[i + 1];
  }
  return obj;
};

const getTagFor = ([type, tag], { markups = {}, atoms = {}}) => {
  switch (type) {
  case MARKUP_MARKER_TYPE: {
    const [tagname, attrs = []] = markups[tag];
    return [tagname, attrs.reduce(kvReduce, {})];
  }
  case ATOM_MARKER_TYPE: {
    const [name, value, attrs = {}] = atoms[tag];
    return ['span', attrs];
  }
  default:
    return [tag, {}];
  }
};

export const nodesToTags = ({ markups, atoms }) => {
  return (node) => {
    if (Array.isArray(node)) {
      const [type, tag, children = []] = node;
      const [tagName, attrs] = getTagFor(node, { markups, atoms });
      return [type, tagName, attrs, children.map(nodesToTags({ markups, atoms }))];
    } else {
      return node;
    }
  };
};

const renderMarkupSection = (sectionElementRenderer) => {
  return ([tag, attrs]) => {
    const _sectionElementRenderer = {};
    if (sectionElementRenderer) {
      for (const key in sectionElementRenderer) {
        if (sectionElementRenderer.hasOwnProperty(key)) {
          _sectionElementRenderer[key.toLowerCase()] = sectionElementRenderer[key];
        }
      }
    }

    tag = tag.toLowerCase();

    if (!isValidSectionTagName(tag, MARKUP_SECTION_TYPE)) {
      return null;
    }

    if (_sectionElementRenderer[tag]) {
      tag = _sectionElementRenderer[tag];
    } else if (!isMarkupSectionElementName(tag)) {
      attrs = { ...attrs, 'className': tag };
      tag = 'div';
    }

    return [tag, attrs];
  };
};

const renderMarkupMarker = (node) => node;

export const treeToReact = (opts = {}) => {
  const renderers = {
    [MARKUP_SECTION_TYPE] : renderMarkupSection(opts.sectionElementRenderer),
    [MARKUP_MARKER_TYPE] : renderMarkupMarker
  };

  return ([nodeType, tag, attrs, children = []]) => {
    if (renderers[nodeType]) {
      const node = renderers[nodeType]([tag, attrs]);
      if (node) {
        return React.createElement(...node, children.map((c) => {
          return Array.isArray(c) ? treeToReact(opts)(c) : c;
        }));
      }
    }

    return null;
  };
};

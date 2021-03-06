import React from 'react';
import {
  CARD_SECTION_TYPE,
  MARKUP_SECTION_TYPE,
  LIST_SECTION_TYPE,
  LIST_ITEM_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from './utils/nodeTypes';
import {
  E_UNKNOWN_ATOM,
  E_UNKNOWN_CARD
} from './utils/Errors';

const tagRenderer = (renderer = {}) => {
  const _renderer = {};
  for (const key in renderer) {
    if (renderer.hasOwnProperty(key)) {
      _renderer[key.toLowerCase()] = renderer[key];
    }
  }

  const renderTag = (tag) => {
    tag = tag.toLowerCase();
    return _renderer[tag] || tag;
  };

  return ([tag, attrs]) => [renderTag(tag), attrs];
};

const componentRenderer = (components = [], unknownComponentHandler, error) => ([name, attrs = {}]) => {
  const component = components.find((c) => c.displayName === name);
  if (component) {
    return [component, attrs];
  } else if (unknownComponentHandler) {
    return [unknownComponentHandler, { name, ...attrs }];
  } else {
    throw new Error(error(name));
  }
};

const REACT_ATTR_MAP = {
  "class": "className"
};

const reactAttrs = (attrs = {}) => {
  attrs = { ...attrs };
  for (const key in REACT_ATTR_MAP) {
    if (attrs[key]) {
      attrs[REACT_ATTR_MAP[key]] = attrs[key];
      delete attrs[key];
    }
  }
  return attrs;
};

export default function ReactRenderer(opts = {}) {
  const sectionRenderer = tagRenderer(opts.sectionElementRenderer);
  const elementRenderer = tagRenderer(opts.markupElementRenderer);

  const RENDERERS = {
    [MARKUP_SECTION_TYPE] : sectionRenderer,
    [LIST_SECTION_TYPE] : sectionRenderer,
    [LIST_ITEM_TYPE]: sectionRenderer,
    [CARD_SECTION_TYPE] : componentRenderer(opts.cards, opts.unknownCardHandler, E_UNKNOWN_CARD),
    [ATOM_MARKER_TYPE]: componentRenderer(opts.atoms, opts.unknownAtomHandler, E_UNKNOWN_ATOM),
    [MARKUP_MARKER_TYPE] : elementRenderer
  };

  const reactify = (node) => {
    if (Array.isArray(node)) {
      const [type, tag, attrs = {}, children = []] = node;

      const renderer = RENDERERS[type];
      if (renderer) {
        const [nodeTag, nodeAttrs] = renderer([tag, attrs]);
        if (nodeTag) {
          return React.createElement(nodeTag, reactAttrs(nodeAttrs), children.map(reactify));
        }
      }
    }

    return node;
  };

  return reactify;
}

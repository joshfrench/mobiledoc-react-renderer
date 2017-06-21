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

const reactMap = {
  "class": "className"
};

const reactAttrs = (attrs = {}) => {
  attrs = { ...attrs };
  for (const key in reactMap) {
    if (attrs[key]) {
      attrs[reactMap[key]] = attrs[key];
      delete attrs[key];
    }
  }
  return attrs;
};

export const treeToReact = (opts = {}) => {
  const sectionRenderer = tagRenderer(opts.sectionElementRenderer);
  const elementRenderer = tagRenderer(opts.markupElementRenderer);

  const renderers = {
    [MARKUP_SECTION_TYPE] : sectionRenderer,
    [LIST_SECTION_TYPE] : sectionRenderer,
    [LIST_ITEM_TYPE]: sectionRenderer,
    [CARD_SECTION_TYPE] : componentRenderer(opts.cards, opts.unknownCardHandler, E_UNKNOWN_CARD),
    [ATOM_MARKER_TYPE]: componentRenderer(opts.atoms, opts.unknownAtomHandler, E_UNKNOWN_ATOM),
    [MARKUP_MARKER_TYPE] : elementRenderer
  };

  const reactify = ([nodeType, tag, attrs, children = []]) => {
    if (renderers[nodeType]) {
      const [nodeTag, nodeAttrs] = renderers[nodeType]([tag, attrs]);
      if (nodeTag) {
        return React.createElement(nodeTag, reactAttrs(nodeAttrs), children.map((c) => {
          return Array.isArray(c) ? reactify(c) : c;
        }));
      }
    }

    return null;
  };

  return reactify;
};

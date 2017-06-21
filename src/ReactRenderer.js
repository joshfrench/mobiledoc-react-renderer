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

const renderAtomMarker = (atoms = [], unknownAtomHandler) => ([name, attrs = {}]) => {
  const atom = atoms.find((a) => a.displayName === name);
  if (atom) {
    return [atom, attrs];
  } else if (unknownAtomHandler) {
    return [unknownAtomHandler, { name, ...attrs }];
  } else {
    throw new Error(E_UNKNOWN_ATOM(name));
  }
};

const renderCardSection = (cards = [], unknownCardHandler) => ([name, attrs = {}]) => {
  const card = cards.find((c) => c.displayName === name);
  if (card) {
    return [card, attrs];
  } else if (unknownCardHandler) {
    return [unknownCardHandler, { name, ...attrs }];
  } else {
    throw new Error(E_UNKNOWN_CARD(name));
  }
};

export const treeToReact = (opts = {}) => {
  const sectionRenderer = tagRenderer(opts.sectionElementRenderer);
  const elementRenderer = tagRenderer(opts.markupElementRenderer);

  const renderers = {
    [MARKUP_SECTION_TYPE] : sectionRenderer,
    [LIST_SECTION_TYPE] : sectionRenderer,
    [CARD_SECTION_TYPE] : renderCardSection(opts.cards, opts.unknownCardHandler),
    [MARKUP_MARKER_TYPE] : elementRenderer,
    [LIST_ITEM_TYPE]: sectionRenderer,
    [ATOM_MARKER_TYPE]: renderAtomMarker(opts.atoms, opts.unknownAtomHandler)
  };

  const reactify = ([nodeType, tag, attrs, children = []]) => {
    if (renderers[nodeType]) {
      const node = renderers[nodeType]([tag, attrs]);
      if (node) {
        return React.createElement(...node, children.map((c) => {
          return Array.isArray(c) ? reactify(c) : c;
        }));
      }
    }

    return null;
  };

  return reactify;
};

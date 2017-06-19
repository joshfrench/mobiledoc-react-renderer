import React from 'react';
import {
  isValidSectionTagName,
  isMarkupSectionElementName
} from './utils/tagNames';
import {
  MARKUP_SECTION_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from './utils/nodeTypes';
import { E_UNKNOWN_ATOM } from './utils/Errors';

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

const renderMarkupMarker = (markupElementRenderer) => {
  return ([tag, attrs]) => {
    const _markupElementRenderer = {};
    if (markupElementRenderer) {
      for (const key in markupElementRenderer) {
        if (markupElementRenderer.hasOwnProperty(key)) {
          _markupElementRenderer[key.toLowerCase()] = markupElementRenderer[key];
        }
      }
    }

    tag = tag.toLowerCase();

    if (_markupElementRenderer[tag]) {
      tag = _markupElementRenderer[tag];
    }

    return [tag, attrs];
  };
};

const renderAtomMarker = (atoms = [], unknownAtomHandler) => ([name, attrs = {}]) => {
  const atom = atoms.find((a) => a.displayName === name);
  if (atom) {
    return [atom, attrs];
  } else if (unknownAtomHandler) {
    return [unknownAtomHandler, attrs]; // TODO: pass name
  } else {
    throw new Error(E_UNKNOWN_ATOM(name));
  }
};

export const treeToReact = (opts = {}) => {
  const renderers = {
    [MARKUP_SECTION_TYPE] : renderMarkupSection(opts.sectionElementRenderer),
    [MARKUP_MARKER_TYPE] : renderMarkupMarker(opts.markupElementRenderer),
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

import React from 'react';
import {
  MARKUP_SECTION_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from './utils/nodeTypes';
import { E_UNKNOWN_ATOM } from './utils/Errors';

function makeRenderer(renderer = {}) {
  const _renderer = {};
  for (const key in renderer) {
    if (renderer.hasOwnProperty(key)) {
      _renderer[key.toLowerCase()] = renderer[key];
    }
  }

  return (tag) => {
    tag = tag.toLowerCase();
    return _renderer[tag] || tag;
  };
}

const renderMarkupSection = (sectionElementRenderer) => {
  const renderer = makeRenderer(sectionElementRenderer);
  return ([tag, attrs]) => [renderer(tag), attrs];
};

const renderMarkupMarker = (markupElementRenderer) => {
  const renderer = makeRenderer(markupElementRenderer);
  return ([tag, attrs]) => [renderer(tag), attrs];
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

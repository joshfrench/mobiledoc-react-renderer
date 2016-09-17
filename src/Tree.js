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

const defaultUnknownAtomHandler = ({ env: { name } }) => {
  throw new Error(`Atom "${name}" not found but no unknownAtomHandler was registered`);
};

const atomByName = (name, atomTypes) => {
  const atom = atomTypes.find((a) => a.displayName === name);
  return atom || defaultUnknownAtomHandler;
};

const getAtom = (idx, atomList = [], atomTypes = []) => {
  const atomType = atomList[idx];
  if (!atomType) {
    throw new Error(`No atom definition found at index ${idx}`);
  }

  const [name, value, payload] = atomType;
  const atom = atomByName(name, atomTypes);

  return [atom, { payload, value }];
};

const expandMarkers = ([type, tag, children], { markups = {}, atoms = {}}, { atomTypes = []}) => {
  switch (type) {
  case MARKUP_MARKER_TYPE: {
    const [tagname, attrs = []] = markups[tag];
    return [type, tagname, attrs.reduce(kvReduce, {}), children];
  }
  case ATOM_MARKER_TYPE: {
    const [atom, attrs = {}] = getAtom(tag, atoms, atomTypes);
    return [type, atom, attrs];
  }
  default:
    return [type, tag, {}, children];
  }
};

export const nodesToTags = ({ markups, atoms }, { atomTypes = []} = {}) => {
  return (node) => {
    if (Array.isArray(node)) {
      const [type, tagName, attrs, children = []] = expandMarkers(node, { markups, atoms }, { atomTypes });
      return [type, tagName, attrs, children.map(nodesToTags({ markups, atoms }, { atomTypes }))];
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

const renderAtomMarker = (node) => node;

export const treeToReact = (opts = {}) => {
  const renderers = {
    [MARKUP_SECTION_TYPE] : renderMarkupSection(opts.sectionElementRenderer),
    [MARKUP_MARKER_TYPE] : renderMarkupMarker,
    [ATOM_MARKER_TYPE]: renderAtomMarker
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

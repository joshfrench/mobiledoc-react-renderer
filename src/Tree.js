import {
  MARKUP_SECTION_TYPE,
  LIST_SECTION_TYPE,
  LIST_ITEM_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from './utils/nodeTypes';
import {
  E_NO_ATOM_AT_INDEX,
  E_UNKNOWN_MARKER_TYPE
} from './utils/Errors';
import {
  isValidMarkerType,
  isMarkupSectionElementName
} from './utils/tagNames';

const kvReduce = (obj, key, i, arr) => {
  if (i % 2 === 0) {
    obj[key] = arr[i + 1];
  }
  return obj;
};

const getAtom = (idx, atomList = []) => {
  const atomType = atomList[idx];
  if (!atomType) {
    throw new Error(E_NO_ATOM_AT_INDEX(idx));
  }

  const [name, value, payload] = atomType; // FIXME: deref payload

  return [name, { payload, value }];
};

const dispatcher = ({ markups = {}, atoms = {}}) => {
  return ([type, tag, children]) => {
    switch (type) {
    case MARKUP_SECTION_TYPE: {
      const attrs = {};
      if (!isMarkupSectionElementName(tag)) {
        attrs['class'] = tag;
        tag = 'div';
      }
      return [type, tag, attrs, children];
    }
    case LIST_SECTION_TYPE: {
      const items = children.map((child) => [LIST_ITEM_TYPE, 'li', [child]]);
      return [type, tag, {}, items];
    }
    case MARKUP_MARKER_TYPE: {
      const [tagname, attrs = []] = markups[tag];
      if (!isValidMarkerType(tagname)) {
        throw new Error(E_UNKNOWN_MARKER_TYPE(tagname));
      }
      return [type, tagname, attrs.reduce(kvReduce, {}), children];
    }
    case ATOM_MARKER_TYPE: {
      const [atom, attrs = {}] = getAtom(tag, atoms);
      return [type, atom, attrs];
    }
    default:
      return [type, tag, {}, children];
    }
  };
};

export const nodesToTags = ({ markups, atoms } = {}) => {
  const expandMarkers = dispatcher({ markups, atoms });
  const nodeToTag = (node) => {
    if (Array.isArray(node)) {
      const [type, tagName, attrs, children = []] = expandMarkers(node);
      return [type, tagName, attrs, children.map(nodeToTag)];
    } else {
      return node;
    }
  };
  return nodeToTag;
};


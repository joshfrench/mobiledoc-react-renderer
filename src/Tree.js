import {
  CARD_SECTION_TYPE,
  MARKUP_SECTION_TYPE,
  LIST_SECTION_TYPE,
  LIST_ITEM_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from './utils/nodeTypes';
import {
  E_NO_ATOM_AT_INDEX,
  E_NO_CARD_AT_INDEX,
  E_UNKNOWN_MARKER_TYPE,
  E_NO_RENDERING_FUNCTION
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
  const [name, value, payload] = atomType;
  return [name, { value, payload: { ...payload }}]; // deref payload
};

const getCard = (idx, cardList = []) => {
  const cardType = cardList[idx];
  if (!cardType) {
    throw new Error(E_NO_CARD_AT_INDEX(idx));
  }
  const [name, payload] = cardType;
  return [name, { payload: { ...payload }}]; // deref payload (no value)
};

const dispatcher = ({ markups = {}, cards = {}, atoms = {}}) => {
  return ([type, tag, children = []]) => {
    let attrs = {};
    switch (type) {
    case MARKUP_SECTION_TYPE: {
      if (!isMarkupSectionElementName(tag)) {
        attrs['class'] = tag;
        tag = 'div';
      }
      break;
    }
    case CARD_SECTION_TYPE: {
      [tag, attrs] = getCard(tag, cards);
      break;
    }
    case LIST_SECTION_TYPE: {
      children = children.map((child) => [LIST_ITEM_TYPE, 'li', [child]]);
      break;
    }
    case MARKUP_MARKER_TYPE: {
      [tag, attrs = []] = markups[tag];
      if (!isValidMarkerType(tag)) {
        throw new Error(E_UNKNOWN_MARKER_TYPE(tag));
      }
      attrs = attrs.reduce(kvReduce, {});
      break;
    }
    case ATOM_MARKER_TYPE: {
      [tag, attrs = {}] = getAtom(tag, atoms);
      break;
    }
    }
    return [type, tag, attrs, children];
  };
};

const abstractRenderer = (x) => x;

export const expandNodes = ({ markups, cards, atoms } = {}, renderer = abstractRenderer) => {
  if (typeof renderer !== 'function') {
    throw new Error(E_NO_RENDERING_FUNCTION);
  }

  const expandMarkers = dispatcher({ markups, cards, atoms });
  const nodeToTag = (node) => {
    if (Array.isArray(node)) {
      const [type, tagName, attrs = {}, children = []] = expandMarkers(node);
      return renderer([type, tagName, attrs, children.map(nodeToTag)]);
    } else {
      return node;
    }
  };
  return nodeToTag;
};

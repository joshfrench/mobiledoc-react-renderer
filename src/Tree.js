import {
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from './utils/nodeTypes';

const kvReduce = (obj, key, i, arr) => {
  if (i % 2 === 0) {
    obj[key] = arr[i + 1];
  }
  return obj;
};

const getAtom = (idx, atomList = []) => {
  const atomType = atomList[idx];
  if (!atomType) {
    throw new Error(`No atom definition found at index ${idx}`);
  }

  const [name, value, payload] = atomType; // FIXME: deref payload

  return [name, { payload, value }];
};

const expandMarkers = ([type, tag, children], { markups = {}, atoms = {}}) => {
  switch (type) {
  case MARKUP_MARKER_TYPE: {
    const [tagname, attrs = []] = markups[tag];
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

export const nodesToTags = ({ markups, atoms } = {}) => {
  return (node) => {
    if (Array.isArray(node)) {
      const [type, tagName, attrs, children = []] = expandMarkers(node, { markups, atoms });
      return [type, tagName, attrs, children.map(nodesToTags({ markups, atoms }))];
    } else {
      return node;
    }
  };
};


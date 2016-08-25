import { MARKUP_MARKER_TYPE } from './utils/nodeTypes';

const kvReduce = (obj, key, i, arr) => {
  if (i % 2 === 0) {
    obj[key] = arr[i + 1];
  }
  return obj;
};

export const markupMapper = (markups) => {
  const getTagFor = ([type, tag]) => {
    const TAGNAME = 0;
    const ATTRS   = 1;
    switch (type) {
    case MARKUP_MARKER_TYPE:
      return [markups[tag][TAGNAME], markups[tag][ATTRS].reduce(kvReduce, {})];
    default:
      return [tag, {}];
    }
  };

  return (node) => {
    if (Array.isArray(node)) {
      const [type, tag, children = []] = node;
      const [tagName, attrs] = getTagFor(node);
      return [type, tagName, attrs, children.map(markupMapper(markups))];
    } else {
      return node;
    }
  };
};

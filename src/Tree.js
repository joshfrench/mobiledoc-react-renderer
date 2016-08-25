import { MARKUP_MARKER_TYPE } from './utils/nodeTypes';

const TAGNAME = 0;
const ATTRS   = 1;


const kvReduce = (obj, key, i, arr) => {
  if (i % 2 === 0) {
    obj[key] = arr[i + 1];
  }
  return obj;
};

const getMarkup = (markups, [type, tag]) => {
  if (type === MARKUP_MARKER_TYPE) {
    const markup = markups[tag];
    return [markup[TAGNAME], markup[ATTRS].reduce(kvReduce, {})];
  } else {
    return [tag, {}];
  }
};

export const addMarkups = (markups, node) => {
  if (Array.isArray(node)) {
    const [type, tag, children = []] = node;
    const [tagName, attrs] = getMarkup(markups, node);
    return [type, tagName, attrs, children.map((c) => addMarkups(markups, c))];
  } else {
    return node;
  }
};

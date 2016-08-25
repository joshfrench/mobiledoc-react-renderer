import { MARKUP_MARKER_TYPE } from './utils/nodeTypes';

const CHILDREN = 2;

const descend = (tree, path) => path.reduce((tree, idx) => tree[CHILDREN][idx], tree);

const addMarker = (tree, path, tagsToOpen, tagsToClose, value) => {
  tree = tree.slice(0);
  const node = descend(tree, path);
  if (tagsToOpen.length === 0) {
    node[CHILDREN] = [...node[CHILDREN], value];
    path = path.slice(0, path.length - tagsToClose);
    return [tree, path];
  } else {
    const [newTag, ...rest] = tagsToOpen;
    node[CHILDREN] = [...node[CHILDREN], [MARKUP_MARKER_TYPE, newTag, []]];
    path = [...path, node[CHILDREN].length - 1];
    return addMarker(tree, path, rest, tagsToClose, value);
  }
};

export const markersToTree = ([tree, path = []], marker) => addMarker(tree, path, ...marker);

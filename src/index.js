const CHILDREN = 1;

const descend = (tree, path) => path.reduce((tree, idx) => tree[CHILDREN][idx], tree);

const addMarker = (tree, path, tagsToOpen, tagsToClose, value) => {
  tree = tree.slice(0);
  const node = descend(tree, path);
  if (tagsToOpen.length === 0) {
    node[CHILDREN] = [...node[CHILDREN], value];
    path = path.slice(0, path.length - tagsToClose);
    return tree;
  } else {
    const [newTag, ...rest] = tagsToOpen;
    node[CHILDREN] = [...node[CHILDREN], [newTag, []]];
    path = [...path, node[CHILDREN].length - 1];
    return addMarker(tree, path, rest, tagsToClose, value);
  }
};

const markersToTree = ([tree, path = []], marker) => addMarker(tree, path, ...marker);
export default markersToTree;

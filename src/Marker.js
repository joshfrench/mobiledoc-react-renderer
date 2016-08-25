const TAGNAME = 0;
const CHILDREN = 1;

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
    node[CHILDREN] = [...node[CHILDREN], [newTag, []]];
    path = [...path, node[CHILDREN].length - 1];
    return addMarker(tree, path, rest, tagsToClose, value);
  }
};

export const markersToTree = ([tree, path = []], marker) => addMarker(tree, path, ...marker);


const kvReduce = (obj, key, i, arr) => {
  if (i % 2 === 0) {
    obj[key] = arr[i + 1];
  }
  return obj;
};

const attrsFromMarkup = ([tag, attrs = []]) => attrs.reduce(kvReduce, {});

export const markersToMarkup = (markups) => {
  const mapMarkup = ([idx, children = []]) => [markups[idx][TAGNAME], attrsFromMarkup(markups[idx]), children.map(markersToMarkup(markups))];
  return (child) => Array.isArray(child) ? mapMarkup(child) : child;
};

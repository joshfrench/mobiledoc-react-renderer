import markersToTree from './utils/markersToTree';

export const toTree = ([type, tagName, markers]) => {
  const root = [tagName, []];
  const [tree] = markers.reduce(markersToTree, [root]);
  return tree;
};

export const mapMarkers = (mapper) => ([tag, markers]) => [tag, mapper(markers)];

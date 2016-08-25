import { markersToTree } from './Marker';

export const sectionToTree = ([type, tagName, markers]) => {
  const root = [tagName, []];
  const [tree] = markers.reduce(markersToTree, [root]);
  return tree;
};

export const mapMarkers = (mapper) => ([tag, markers]) => [tag, markers.map(mapper)];

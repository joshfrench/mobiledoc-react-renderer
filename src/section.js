import markersToTree from './utils/markersToTree';

const renderSection = ([type, tagName, markers]) => {
  const root = [tagName, []];
  const [tree] = markers.reduce(markersToTree, [root]);
  return tree;
};

export default renderSection;

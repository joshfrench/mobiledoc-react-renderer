import markersToTree from './utils/markersToTree';
import treeToReact from './utils/treeToReact';

// [1, 'p', [ markers... ]
const renderSection = ([type, tagName, markers]) => {
  const root = [tagName, []];
  const [tree] = markers.reduce(markersToTree, [root]);
  return treeToReact(tree);
};

export default renderSection;

import { markersToTree } from './Marker';
import { isValidSectionTagName } from './utils/tagNames';
import { E_UNALLOWED_SECTION_TAG } from './utils/Errors';

export const sectionToTree = ([type, tagName, markers]) => {
  if (!isValidSectionTagName(tagName, type)) {
    throw new Error(E_UNALLOWED_SECTION_TAG(tagName));
  }
  const root = [type, tagName, []];
  const [tree] = markers.reduce(markersToTree, [root]);
  return tree;
};

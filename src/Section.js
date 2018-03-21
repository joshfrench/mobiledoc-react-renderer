import { isValidSectionTagName } from './utils/tagNames';
import { E_UNALLOWED_SECTION_TAG } from './utils/Errors';
import {
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE,
  MD_MARKUP_MARKER_TYPE
} from './utils/nodeTypes';

const CHILDREN = 2;

export const sectionToTree = ([type, tagName, markers = []]) => {
  if (!isValidSectionTagName(tagName, type)) {
    throw new Error(E_UNALLOWED_SECTION_TAG(tagName));
  }

  const section = [type, tagName, []];
  const stack = [section];
  markers.forEach(([markerType, tagsToOpen, tagsToClose, value]) => {
    // open zero or more tags
    tagsToOpen.forEach((tag) => {
      // TODO: validate tag as in mobiledoc-dom-renderer
      const node = [MARKUP_MARKER_TYPE, tag, []];

      stack[stack.length - 1][CHILDREN].push(node);
      stack.push(node);
    });

    // insert value
    value = (markerType === MD_MARKUP_MARKER_TYPE) ? value : [ATOM_MARKER_TYPE, value];
    stack[stack.length - 1][CHILDREN].push(value);

    // close zero or more tags
    for (let i = 0; i < tagsToClose; i++) {
      stack.pop();
    }
  });

  return section;
};

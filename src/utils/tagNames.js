import { MARKUP_SECTION_TYPE } from './nodeTypes';
import { E_UNKNOWN_SECTION_TAG } from './Errors';

const normalizeTagName = (tag) => tag.toLowerCase();

const MARKUP_SECTION_TAG_NAMES = [
  'p', 'h1', 'h2', 'h3', 'blockquote', 'pull-quote'
].map(normalizeTagName);

const MARKUP_SECTION_ELEMENT_NAMES = [
  'p', 'h1', 'h2', 'h3', 'blockquote'
].map(normalizeTagName);

// const LIST_SECTION_TAG_NAMES = [
//   'ul', 'ol'
// ].map(normalizeTagName);
//
// const MARKUP_TYPES = [
//   'b', 'i', 'strong', 'em', 'a', 'u', 'sub', 'sup', 's'
// ].map(normalizeTagName);

function contains(array, item) {
  return array.indexOf(item) !== -1;
}

export function isValidSectionTagName(tagName, sectionType) {
  tagName = normalizeTagName(tagName);

  switch (sectionType) {
  case MARKUP_SECTION_TYPE:
    return contains(MARKUP_SECTION_TAG_NAMES, tagName);
  // case LIST_SECTION_TYPE:
  //   return contains(LIST_SECTION_TAG_NAMES, tagName);
  default:
    throw new Error(E_UNKNOWN_SECTION_TAG(sectionType));
  }
}

export function isMarkupSectionElementName(tagName) {
  tagName = normalizeTagName(tagName);
  return contains(MARKUP_SECTION_ELEMENT_NAMES, tagName);
}

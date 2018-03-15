import { expect } from 'chai';
import {
  CARD_SECTION_TYPE,
  MARKUP_SECTION_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../src/utils/nodeTypes';
import DOMRenderer from '../src/DOMRenderer';

function innerHTML(parentNode) {
  let content = [];
  let node = parentNode.firstChild;
  while (node) {
    content.push(node.outerHTML);
    node = node.nextSibling;
  }
  return content.join('');
}

describe.only('DOM Renderer', () => {
  const simpleRenderer = new DOMRenderer();

  describe('Markup section', () => {
    it('renders a simple element', () => {
      const rendered = simpleRenderer.render([MARKUP_SECTION_TYPE, 'p', {}, ['ohai']])
      expect(innerHTML(rendered.result)).to.eq('<p>ohai</p>');
    });

    it('renders nested elements', () => {
      const rendered = simpleRenderer.render([MARKUP_SECTION_TYPE, 'p', {}, [[MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']]]]);
      expect(innerHTML(rendered.result)).to.eq('<p><strong>ohai</strong></p>');
    });
  });
});

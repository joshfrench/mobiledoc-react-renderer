import { expect } from 'chai';
import {
  CARD_SECTION_TYPE,
  MARKUP_SECTION_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../src/utils/nodeTypes';
import DOMRenderer from '../src/DOMRenderer';

function innerHTML(parentNode) {
  const content = [];
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
      const rendered = simpleRenderer.render([MARKUP_SECTION_TYPE, 'p', {}, ['ohai']]);
      expect(innerHTML(rendered.result)).to.eq('<p>ohai</p>');
    });

    it('renders nested elements', () => {
      const rendered = simpleRenderer.render([MARKUP_SECTION_TYPE, 'p', {}, [[MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']]]]);
      expect(innerHTML(rendered.result)).to.eq('<p><strong>ohai</strong></p>');
    });

    it('accepts a sectionElementRenderer', () => {
      const sectionElementRenderer = {
        'P': (_, dom) => dom.createElement('aside')
      };
      const sectionRenderer = new DOMRenderer({ sectionElementRenderer });
      const rendered = sectionRenderer.render([MARKUP_SECTION_TYPE, 'p', {}, ['ohai']]);
      expect(innerHTML(rendered.result)).to.eq('<aside>ohai</aside>');
    });
  });

  describe('Markup marker', () => {
    it('renders an allowed tag', () => {
      const rendered = simpleRenderer.render([MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']]);
      expect(innerHTML(rendered.result)).to.eq('<strong>ohai</strong>');
    });

    it('accepts a markupElementRenderer', () => {
      const markupElementRenderer = {
        'strong': (_, dom) => dom.createElement('em')
      };
      const markupRenderer = new DOMRenderer({ markupElementRenderer });
      const rendered = markupRenderer.render([MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']]);
      expect(innerHTML(rendered.result)).to.eq('<em>ohai</em>');
    });
  });

  describe('Atom marker', () => {
    const tree =
      [MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "anAtom", { payload: { id: 42 }, value: "Hodor" }]]];

    it('renders a simple atom', () => {
      const anAtom = {
        name: 'anAtom',
        type: 'dom',
        render({ env, value }) {
          return env.dom.createTextNode(`Hello ${value}`);
        }
      };
      const atomRenderer = new DOMRenderer({ atoms: [anAtom]});
      const rendered = atomRenderer.render(tree);
      expect(innerHTML(rendered.result)).to.eq('<p>Hello Hodor</p>');
    });

    it('passes unknown atoms to unknownAtomHandler', () => {
      const unknownAtomHandler = ({ env, name }) => {
        return env.dom.createTextNode(`Unknown atom: ${name}`);
      };
      const atomRenderer = new DOMRenderer({ unknownAtomHandler });
      const rendered = atomRenderer.render(tree);
      expect(innerHTML(rendered.result)).to.eq('<p>Unknown atom: anAtom</p>');
    });

    it('throws if no atom can be found and no handler is supplied', () => {
      const render = () => { simpleRenderer.render(tree); };
      expect(render).to.throw('Atom "anAtom" not found but no unknownAtomHandler was registered.');
    });
  });

  describe('Card section', () => {
    const tree = [CARD_SECTION_TYPE, 'aCard', { payload: { name: 'Hodor'  }}];

    it('renders a card', () => {
      const aCard = {
        name: 'aCard',
        type: 'dom',
        render({ env, payload }) {
          const div = env.dom.createElement('div');
          const text = env.dom.createTextNode(`Hello ${payload.name}`);
          div.appendChild(text);
          return div;
        }
      };
      const cardRenderer = new DOMRenderer({ cards: [aCard]});
      const rendered = cardRenderer.render(tree);
      expect(innerHTML(rendered.result)).to.eq("<div>Hello Hodor</div>");
    });

    it('passes unknown cards to unknownCardHandler', () => {
      const unknownCardHandler = ({ env, name }) => {
        const div = env.dom.createElement('div');
        div.appendChild(env.dom.createTextNode(`Unknown card: ${name}`));
        return div;
      };

      const cardRenderer = new DOMRenderer({ unknownCardHandler });
      const rendered = cardRenderer.render(tree);
      expect(innerHTML(rendered.result)).to.eq('<div>Unknown card: aCard</div>');
    });

    it('throws when no card can be found and no handler is supplied', () => {
      const render = () => { simpleRenderer.render(tree); };
      expect(render).to.throw('Card "aCard" not found but no unknownCardHandler was registered.');
    });
  });
});

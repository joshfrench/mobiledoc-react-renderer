import {
  CARD_SECTION_TYPE,
  MARKUP_SECTION_TYPE,
  LIST_SECTION_TYPE,
  LIST_ITEM_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from './utils/nodeTypes';

class TagRenderer {
  constructor(renderers = {}) {
    this._renderers = {};
    Object.keys(renderers).forEach(key => {
      this._renderers[key.toLowerCase()] = renderers[key];
    });
  }

  render({ name, env }) {
    name = name.toLowerCase();
    const renderer = this._renderers[name] || this.defaultTagRenderer;
    return renderer(name, env.dom);
  }

  defaultTagRenderer(tagName, dom) {
    return dom.createElement(tagName);
  }
}

class AtomRenderer {
  constructor(atoms = [], unknownAtomHandler) {
    this.atoms = atoms;
    this.unknownAtomHandler = unknownAtomHandler || this.defaultUnknownAtomHandler;
  }

  render({ name, env, options }) {
    const { payload, value } = options;
    const atomType = this.atoms.find((a) => a.name === name);
    if (!atomType) {
      return this.unknownAtomHandler({ name, env, options });
    }
    return atomType.render({ env, options, payload, value });
  }

  defaultUnknownAtomHandler({ name }) {
    throw new Error(`Atom "${name}" not found but no unknownAtomHandler was registered.`);
  }
}

class CardRenderer{
  constructor(cards = [], unknownCardHandler) {
    this.cards = cards;
    this.unknownCardHandler = unknownCardHandler || this.defaultUnknownCardHandler;
  }

  render({ name, env, options }) {
    const { payload } = options;
    const cardType = this.cards.find((c) => c.name === name);
    if (!cardType) {
      return this.unknownCardHandler({ name, env, options });
    }
    return cardType.render({ env, options, payload });
  }

  defaultUnknownCardHandler({ name }) {
    throw new Error(`Card "${name}" not found but no unknownCardHandler was registered.`);
  }
}

export default class DOMRenderer {
  constructor(opts = {}) {
    this.dom = window.document;
    const {
      sectionElementRenderer,
      markupElementRenderer,
      atoms,
      unknownAtomHandler,
      cards,
      unknownCardHandler
    } = opts;
    this.renderers = {
      [MARKUP_SECTION_TYPE]: new TagRenderer(sectionElementRenderer),
      [MARKUP_MARKER_TYPE]: new TagRenderer(markupElementRenderer),
      [ATOM_MARKER_TYPE]: new AtomRenderer(atoms, unknownAtomHandler),
      [CARD_SECTION_TYPE]: new CardRenderer(cards, unknownCardHandler)
    };
  }

  render(node, root = this.dom.createDocumentFragment()) {
    let element;

    if (Array.isArray(node)) {
      const [type, name, options, children=[]] = node;
      const renderer = this.renderers[type];
      if (renderer) {
        element = renderer.render({ name, env: { dom: this.dom }, options });
        children.map((child) => this.render(child, element));
      }
    } else {
      element = this.dom.createTextNode(node);
    }

    root.appendChild(element);
    return { result: root };
  }
}

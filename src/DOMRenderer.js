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
  constructor(atoms = []) {
    this.atoms = atoms;
  }

  render({ name, env, options }) {
    const { payload, value } = options;
    const atomType = this.atoms.find((a) => a.name === name);
    return atomType.render({ env, options, payload, value });
  }
}

export default class DOMRenderer {
  constructor(opts = {}) {
    this.dom = window.document;
    const {
      sectionElementRenderer,
      markupElementRenderer,
      atoms
    } = opts;
    this.renderers = {
      [MARKUP_SECTION_TYPE]: new TagRenderer(sectionElementRenderer),
      [MARKUP_MARKER_TYPE]: new TagRenderer(markupElementRenderer),
      [ATOM_MARKER_TYPE]: new AtomRenderer(atoms)
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

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

  renderTag(tagName, dom) {
    tagName = tagName.toLowerCase();
    const renderer = this._renderers[tagName] || this.defaultTagRenderer;
    return renderer(tagName, dom);
  }

  defaultTagRenderer(tagName, dom) {
    return dom.createElement(tagName);
  }
}

export default class DOMRenderer {
  constructor(opts = {}) {
    this.dom = window.document;
    const {
      sectionElementRenderer,
      markupElementRenderer
    } = opts;
    this.renderers = {
      [MARKUP_SECTION_TYPE]: new TagRenderer(sectionElementRenderer),
      [MARKUP_MARKER_TYPE]: new TagRenderer(markupElementRenderer)
    };
  }

  render(node, root = this.dom.createDocumentFragment()) {
    let element;

    if (Array.isArray(node)) {
      const [type, tag, attrs, children=[]] = node;
      const renderer = this.renderers[type];
      if (renderer) {
        element = renderer.renderTag(tag, this.dom);
        children.map((child) => this.render(child, element));
      }
    } else {
      element = this.dom.createTextNode(node);
    }

    root.appendChild(element);
    return { result: root };
  }
}

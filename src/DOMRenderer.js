export default class DOMRenderer {
  constructor() {
    this.dom = window.document;
  }

  render(node, root = this.dom.createDocumentFragment()) {
    let element;

    if (Array.isArray(node)) {
      const [type, tag, attrs, children=[]] = node;
      element = this.dom.createElement(tag);
      children.map((child) => this.render(child, element));
    } else {
      element = this.dom.createTextNode(node);
    }

    root.appendChild(element);
    return { result: root };
  }
}

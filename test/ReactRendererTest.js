import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { treeToReact } from '../src/ReactRenderer';
import {
  MARKUP_SECTION_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../src/utils/nodeTypes';

describe('treeToReact()', () => {
  const simpleTree = treeToReact();

  it('renders a simple element', () => {
    const wrapper = shallow(simpleTree([MARKUP_SECTION_TYPE, 'p', {}]));
    expect(wrapper).to.have.html('<p></p>');
  });

  it('renders nested elements', () => {
    const wrapper = shallow(simpleTree([MARKUP_SECTION_TYPE, 'p', {}, [[MARKUP_MARKER_TYPE, 'span', {}, ['ohai']]]]));
    expect(wrapper).to.have.html('<p><span>ohai</span></p>');
  });

  it('does not render unknown tags', () => {
    const element = simpleTree([MARKUP_SECTION_TYPE, 'aside', {}]);
    expect(element).to.be.null;
  });

  it('folds `pull-quote` to div with className', () => {
    const wrapper = shallow(simpleTree([MARKUP_SECTION_TYPE, 'pull-quote', {}]));
    expect(wrapper).to.have.html('<div class="pull-quote"></div>');
  });

  describe('renderAtomMarker()', () => {
    it('maps atoms to components', () => {
      const AnAtom = ({ value }) => <span>@{value}</span>;
      AnAtom.displayName = "AnAtom";

      const tree = [MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "AnAtom", { payload: { id: 42 }, value: "ohai" }, []]
      ]];

      const wrapper = shallow(treeToReact({ atoms: [AnAtom]})(tree));
      expect(wrapper).to.have.html('<p><span>@ohai</span></p>');
    });

    it('passes unknown atoms to unknownAtomHandler', () => {
      const tree = [MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "AnAtom", { payload: { id: 42 }, value: "ohai" }, []]
      ]];
      const handler = ({ value }) => <span>!{value}</span>;
      const wrapper = shallow(treeToReact({ unknownAtomHandler: handler})(tree));

      expect(wrapper).to.have.html('<p><span>!ohai</span></p>');
    });

    it('raises if atom cannot be found and no handler is supplied', () => {
      const renderTree = () => simpleTree([MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "MissingAtom", {}, []]
      ]]);
      expect(renderTree).to.throw(`Atom "MissingAtom" not found but no unknownAtomHandler was registered`);
    });
  });

  describe('renderMarkupSection()', () => {
    it('accepts a sectionElementRenderer with a simple tag', () => {
      const tree = [MARKUP_SECTION_TYPE, 'p', {}];
      const sectionElementRenderer = { 'p': 'aside' };
      const wrapper = shallow(treeToReact({ sectionElementRenderer })(tree));
      expect(wrapper).to.have.html('<aside></aside>');
    });

    it('accepts a sectionElementRenderer with a custom Component', () => {
      const MyComponent = () => <aside></aside>;
      const sectionElementRenderer = { 'p': MyComponent };
      const tree = [MARKUP_SECTION_TYPE, 'p', {}];
      const wrapper = shallow(treeToReact({ sectionElementRenderer })(tree));
      expect(wrapper).to.have.html('<aside></aside>');
    });

    it('passes children to sectionElementRenderer', () => {
      const tree = [MARKUP_SECTION_TYPE, 'p', {}, ['ohai']];
      const sectionElementRenderer = { 'p': 'aside' };
      const wrapper = shallow(treeToReact({ sectionElementRenderer })(tree));
      expect(wrapper).to.have.html('<aside>ohai</aside>');
    });
  });
});

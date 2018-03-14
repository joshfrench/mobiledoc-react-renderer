import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ReactRenderer from '../src/DirectReactRenderer';
import {
  CARD_SECTION_TYPE,
  MARKUP_SECTION_TYPE,
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from '../src/utils/nodeTypes';
import {
  E_UNKNOWN_CARD,
  E_UNKNOWN_ATOM
} from '../src/utils/Errors';

describe.only('ReactRenderer()', () => {
  const simpleRenderer = new ReactRenderer();

  describe('Markup section', () => {
    it('renders a simple element', () => {
      const wrapper = shallow(simpleRenderer([MARKUP_SECTION_TYPE, 'p', {}]));
      expect(wrapper).to.have.html('<p></p>');
    });

    it('renders nested elements', () => {
      const wrapper = shallow(simpleRenderer([MARKUP_SECTION_TYPE, 'p', {}, [[MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']]]]));
      expect(wrapper).to.have.html('<p><strong>ohai</strong></p>');
    });

    it('remaps attrs to React versions if needed', () => {
      const wrapper = shallow(simpleRenderer([MARKUP_SECTION_TYPE, 'div', { class: 'pull-quote' }, ['ohai']]));
      expect(wrapper).to.have.html('<div class="pull-quote">ohai</div>');
    });

    it('converts unknown sections to divs', () => { // e.g. the pull-quote handler
      const wrapper = shallow(simpleRenderer([MARKUP_SECTION_TYPE, 'pull-quote', {}, ['ohai']]));
      expect(wrapper).to.have.html('<div class="pull-quote">ohai</div>');
    });

    it('accepts a sectionElementRenderer with a simple tag', () => {
      const sectionElementRenderer = { 'p': 'aside' };
      const sectionRenderer = new ReactRenderer({ sectionElementRenderer });
      const wrapper = shallow(sectionRenderer([MARKUP_SECTION_TYPE, 'p', {}]));
      expect(wrapper).to.have.html('<aside></aside>');
    });

    it('accepts a sectionElementRenderer with a custom Component', () => {
      const MyComponent = () => <aside></aside>;
      const sectionElementRenderer = { 'p': MyComponent };
      const sectionRenderer = new ReactRenderer({ sectionElementRenderer });
      const wrapper = shallow(sectionRenderer([MARKUP_SECTION_TYPE, 'p', {}]));
      expect(wrapper).to.have.html('<aside></aside>');
    });

    it('passes children to sectionElementRenderer', () => {
      const sectionElementRenderer = { 'p': 'aside' };
      const sectionRenderer = new ReactRenderer({ sectionElementRenderer });
      const wrapper = shallow(sectionRenderer([MARKUP_SECTION_TYPE, 'p', {}, ['ohai']]));
      expect(wrapper).to.have.html('<aside>ohai</aside>');
    });
  });

  describe('Markup marker', () => {
    it('renders an allowed tag', () => {
      const wrapper = shallow(simpleRenderer([MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']]));
      expect(wrapper).to.have.html('<strong>ohai</strong>');
    });

    it('accepts a markupElementRenderer with a simple tag', () => {
      const markupElementRenderer = { 'strong': 'em' };
      const markupRenderer = new ReactRenderer({ markupElementRenderer });
      const wrapper = shallow(markupRenderer([MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']]));
      expect(wrapper).to.have.html('<em>ohai</em>');
    });

    it('accepts a markupElementRenderer with a custom Component', () => {
      const MyComponent = () => <em></em>;
      const markupElementRenderer = { 'strong': MyComponent };
      const markupRenderer = new ReactRenderer({ markupElementRenderer });
      const wrapper = shallow(markupRenderer([MARKUP_MARKER_TYPE, 'strong', {}]));
      expect(wrapper).to.have.html('<em></em>');
    });
  });

  describe('atom marker', () => {
    it('maps atoms to components', () => {
      const AnAtom = ({ value }) => <span>@{value}</span>;
      AnAtom.displayName = 'AnAtom';

      const tree = [MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "AnAtom", { payload: { id: 42 }, value: "ohai" }, []]
      ]];

      const atomRenderer = new ReactRenderer({ atoms: [AnAtom]});
      const wrapper = shallow(atomRenderer(tree));
      expect(wrapper).to.have.html('<p><span>@ohai</span></p>');
    });

    it('passes unknown atoms to unknownAtomHandler', () => {
      const tree = [MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "AnAtom", { payload: { id: 42 }, value: "ohai" }, []]
      ]];
      const unknownAtomHandler = ({ name, value }) => <span>{`${name}: ${value}`}</span>;
      const atomRenderer = new ReactRenderer({ unknownAtomHandler });
      const wrapper = shallow(atomRenderer(tree));

      expect(wrapper).to.have.html('<p><span>AnAtom: ohai</span></p>');
    });

    it('throws if an atom cannot be found and no handler is supplied', () => {
      const renderTree = () => simpleRenderer([MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "MissingAtom", {}, []]
      ]]);
      expect(renderTree).to.throw(E_UNKNOWN_ATOM("MissingAtom"));
    });
  });
});

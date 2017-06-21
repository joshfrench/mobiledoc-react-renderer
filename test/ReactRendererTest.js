import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { treeToReact } from '../src/ReactRenderer';
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

describe('treeToReact()', () => {
  const simpleTree = treeToReact();

  it('renders a simple element', () => {
    const wrapper = shallow(simpleTree([MARKUP_SECTION_TYPE, 'p', {}]));
    expect(wrapper).to.have.html('<p></p>');
  });

  it('renders nested elements', () => {
    const wrapper = shallow(simpleTree([MARKUP_SECTION_TYPE, 'p', {}, [[MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']]]]));
    expect(wrapper).to.have.html('<p><strong>ohai</strong></p>');
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
      const unknownAtomHandler = ({ name, value }) => <span>{`${name}: ${value}`}</span>;
      const wrapper = shallow(treeToReact({ unknownAtomHandler })(tree));

      expect(wrapper).to.have.html('<p><span>AnAtom: ohai</span></p>');
    });

    it('raises if atom cannot be found and no handler is supplied', () => {
      const renderTree = () => simpleTree([MARKUP_SECTION_TYPE, 'p', {}, [
        [ATOM_MARKER_TYPE, "MissingAtom", {}, []]
      ]]);
      expect(renderTree).to.throw(E_UNKNOWN_ATOM("MissingAtom"));
    });
  });

  describe('renderCardSection', () => {
    it('maps cards to components', () => {
      const Card = ({ payload: { name } }) => <div>Hello {name}</div>;
      Card.displayName = 'aCard';

      const tree = [CARD_SECTION_TYPE, 'aCard', { payload: { name: 'Hodor' }}, []];
      const wrapper = shallow(treeToReact({ cards: [Card]})(tree));
      expect(wrapper).to.have.html('<div>Hello Hodor</div>');
    });

    it('passes unknown cards to unknownCardHandler', () => {
      const tree = [CARD_SECTION_TYPE, 'aCard', { payload: { name: 'Hodor' }}];
      const unknownCardHandler = ({ name, payload }) => <div>{`${name}: ${payload.name}`}</div>;

      const wrapper = shallow(treeToReact({ unknownCardHandler })(tree));
      expect(wrapper).to.have.html('<div>aCard: Hodor</div>');
    });

    it('raises if card cannot be found and no handler is supplied', () => {
      const renderTree = () => simpleTree([CARD_SECTION_TYPE, 'MissingCard', []]);
      expect(renderTree).to.throw(E_UNKNOWN_CARD('MissingCard'));
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

  describe('renderMarkupMarker()', () => {
    it('renders an allowed tag', () => {
      const tree = [MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']];
      const wrapper = shallow(simpleTree(tree));
      expect(wrapper).to.have.html('<strong>ohai</strong>');
    });

    it('accepts a markupElementRenderer with a simple tag', () => {
      const tree = [MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']];
      const markupElementRenderer = { 'strong': 'em' };
      const wrapper = shallow(treeToReact({ markupElementRenderer })(tree));
      expect(wrapper).to.have.html('<em>ohai</em>');
    });

    it('accepts a markupElementRenderer with a custom Component', () => {
      const MyComponent = () => <em></em>;
      const markupElementRenderer = { 'strong': MyComponent };
      const tree = [MARKUP_MARKER_TYPE, 'strong', {}];
      const wrapper = shallow(treeToReact({ markupElementRenderer })(tree));
      expect(wrapper).to.have.html('<em></em>');
    });
  });
});

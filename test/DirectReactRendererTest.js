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
  const renderer = new ReactRenderer();

  describe('Markup section', () => {
    it('renders a simple element', () => {
      const wrapper = shallow(renderer([MARKUP_SECTION_TYPE, 'p', {}]));
      expect(wrapper).to.have.html('<p></p>');
    });

    it('renders nested elements', () => {
      const wrapper = shallow(renderer([MARKUP_SECTION_TYPE, 'p', {}, [[MARKUP_MARKER_TYPE, 'strong', {}, ['ohai']]]]));
      expect(wrapper).to.have.html('<p><strong>ohai</strong></p>');
    });

    it('remaps attrs to React versions if needed', () => {
      const wrapper = shallow(renderer([MARKUP_SECTION_TYPE, 'div', { class: 'pull-quote' }, ['ohai']]));
      expect(wrapper).to.have.html('<div class="pull-quote">ohai</div>');
    });

    it('converts unknown sections to divs', () => { // e.g. the pull-quote handler
      const wrapper = shallow(renderer([MARKUP_SECTION_TYPE, 'pull-quote', {}, ['ohai']]));
      expect(wrapper).to.have.html('<div class="pull-quote">ohai</div>');
    });

    it('accepts a sectionElementRenderer with a simple tag', () => {
      const sectionElementRenderer = { 'p': 'aside' };
      const sectionRenderer = new ReactRenderer({ sectionElementRenderer });
      const wrapper = shallow(sectionRenderer([MARKUP_SECTION_TYPE, 'p', {}]));
      expect(wrapper).to.have.html('<aside></aside>');
    });
  });
});

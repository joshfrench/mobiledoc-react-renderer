import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { MARKUP_SECTION_TYPE, MARKUP_MARKER_TYPE } from '../../src/utils/nodeTypes';
import treeToReact from '../../src/utils/treeToReact';

describe('treeToReact()', () => {
  it('renders a simple element', () => {
    const wrapper = shallow(treeToReact([MARKUP_SECTION_TYPE, 'p']));
    expect(wrapper).to.have.html('<p></p>');
  });

  it('renders nested elements', () => {
    const wrapper = shallow(treeToReact([MARKUP_SECTION_TYPE, 'ul', [[MARKUP_MARKER_TYPE, 'li', ['ohai']]]]));
    expect(wrapper).to.have.html('<ul><li>ohai</li></ul>');
  });
});

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import treeToReact from '../../src/utils/treeToReact';

describe('treeToReact()', () => {
  it('renders a simple element', () => {
    const wrapper = shallow(treeToReact(['p']));
    expect(wrapper).to.have.html('<p></p>');
  });

  it('renders nested elements', () => {
    const wrapper = shallow(treeToReact(['ul', [['li', ['ohai']]]]));
    expect(wrapper).to.have.html('<ul><li>ohai</li></ul>');
  });
});

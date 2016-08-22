import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import renderSection from '../src/section';

describe('renderSection', () => {
  it('renders a section with its root tag', () => {
    const section = [
      1, 'p', [
        [[], 0, 'ohai']
      ]
    ];

    const wrapper = shallow(renderSection(section));
    expect(wrapper).to.have.html('<p>ohai</p>');
  });

  it('renders a section with markers', () => {
    const section = [
      1, 'div', [
        [['a'], 1, 'linked']
      ]
    ];

    const wrapper = shallow(renderSection(section));
    expect(wrapper).to.have.html('<div><a>linked</a></div>');
  });
});

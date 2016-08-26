import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import MobiledocRenderer from '../src/MobiledocRenderer';

describe('<MobiledocRenderer />', () => {
  it('renders a mobiledoc', () => {
    const mobiledoc = {
      markups: [
        ['b'],
        ['a', ['href', '#']]
      ],
      sections: [
        [1, 'p', [
          [[], 0, 'Normal '],
          [[1], 0, 'Linked '],
          [[0], 2, 'and bold']
        ]]
      ]
    };
    const wrapper = shallow(<MobiledocRenderer mobiledoc={mobiledoc} />);
    expect(wrapper).to.have.html(
      '<div><p>Normal <a href="#">Linked <b>and bold</b></a></p></div>'
    );
  });
});

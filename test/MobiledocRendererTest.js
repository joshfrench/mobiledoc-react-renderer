import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import {
  MARKUP_SECTION_TYPE,
  MD_ATOM_MARKER_TYPE,
  MD_MARKUP_MARKER_TYPE
} from '../src/utils/nodeTypes';
import MobiledocRenderer from '../src/MobiledocRenderer';

describe('<MobiledocRenderer />', () => {
  it('renders a mobiledoc', () => {
    const mobiledoc = {
      atoms: [
        ["AnAtom", {}, "@ohai"]
      ],
      markups: [
        ['b'],
        ['a', ['href', '#']]
      ],
      sections: [
        [MARKUP_SECTION_TYPE, 'p', [
          [MD_MARKUP_MARKER_TYPE, [], 0, 'Normal '],
          [MD_MARKUP_MARKER_TYPE, [1], 0, 'Linked '],
          [MD_MARKUP_MARKER_TYPE, [0], 2, 'and bold']
        ]]
      ]
    };
    const wrapper = shallow(<MobiledocRenderer mobiledoc={mobiledoc} />);
    expect(wrapper).to.have.html(
      '<div><p>Normal <a href="#">Linked <b>and bold</b></a></p></div>'
    );
  });

  it('accepts a sectionElementRenderer option', () => {
    const mobiledoc = {
      sections: [
        [MARKUP_SECTION_TYPE, 'p', [
          [MD_MARKUP_MARKER_TYPE, [], 0, 'ohai']
        ]]
      ]
    };
    const sectionElementRenderer = { 'p': 'aside' };
    const wrapper = shallow(<MobiledocRenderer mobiledoc={mobiledoc} sectionElementRenderer={sectionElementRenderer} />);
    expect(wrapper).to.have.html('<div><aside>ohai</aside></div>');
  });

  it('renders an atom', () => {
    const AnAtom = ({ value }) => <span>@{value}</span>;
    AnAtom.displayName = 'AnAtom';

    const mobiledoc = {
      atoms: [
        ["AnAtom", "ohai", {id: 42}]
      ],
      sections: [
        [MARKUP_SECTION_TYPE, 'p', [
          [MD_ATOM_MARKER_TYPE, [], 0, 0]
        ]]
      ]
    };
    const wrapper = shallow(<MobiledocRenderer mobiledoc={mobiledoc} atoms={[AnAtom]} />);
    expect(wrapper).to.have.html(
      '<div><p><span>@ohai</span></p></div>'
    );
  });
});

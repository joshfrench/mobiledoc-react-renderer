import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import {
  MARKUP_SECTION_TYPE,
  CARD_SECTION_TYPE,
  LIST_SECTION_TYPE,
  MD_ATOM_MARKER_TYPE,
  MD_MARKUP_MARKER_TYPE
} from '../src/utils/nodeTypes';
import MobiledocRenderer from '../src/MobiledocRenderer';

describe('<MobiledocRenderer />', () => {
  it('renders a mobiledoc', () => {
    const mobiledoc = {
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

  it('passes arbitrary props to root element', () => {
    const wrapper = shallow(<MobiledocRenderer className="mobiledoc" />);
    expect(wrapper).to.have.html(
      '<div class="mobiledoc"></div>'
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

  it('accepts a markupElementRenderer', () => {
    const mobiledoc = {
      markups: [
        ['strong']
      ],
      sections: [
        [MARKUP_SECTION_TYPE, 'p', [
          [MD_MARKUP_MARKER_TYPE, [0], 1, 'ohai']
        ]]
      ]
    };
    const markupElementRenderer = { 'strong': 'em' };
    const wrapper = shallow(<MobiledocRenderer mobiledoc={mobiledoc} markupElementRenderer={markupElementRenderer} />);
    expect(wrapper).to.have.html('<div><p><em>ohai</em></p></div>');
  });

  it('renders an atom', () => {
    const AnAtom = ({ value }) => <span>@{value}</span>;
    AnAtom.displayName = 'AnAtom';

    const mobiledoc = {
      atoms: [
        ["AnAtom", "ohai", { id: 42 }]
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

  it('renders a card', () => {
    const Card = ({ payload: { name }}) => <figure>Hello {name}</figure>;
    Card.displayName = 'Card';

    const mobiledoc = {
      cards: [
        ['Card', { name: 'Hodor' }]
      ],
      sections: [
        [CARD_SECTION_TYPE, 0]
      ]
    };
    const wrapper = shallow(<MobiledocRenderer mobiledoc={mobiledoc} cards={[Card]} />);
    expect(wrapper).to.have.html(
      '<div><figure>Hello Hodor</figure></div>'
    );
  });

  it('renders a list', () => {
    const mobiledoc = {
      sections: [
        [LIST_SECTION_TYPE, 'ul', [
          [MD_MARKUP_MARKER_TYPE, [], 0, 'foo'],
          [MD_MARKUP_MARKER_TYPE, [], 0, 'bar']
        ]]
      ]
    };
    const wrapper = shallow(<MobiledocRenderer mobiledoc={mobiledoc} />);
    expect(wrapper).to.have.html(
      '<div><ul><li>foo</li><li>bar</li></ul></div>'
    );
  });

  it('provides keys to sibling elements', () => {
    const mobiledoc = {
      sections: [
        [LIST_SECTION_TYPE, 'ul', [
          [MD_MARKUP_MARKER_TYPE, [], 0, 'foo'],
          [MD_MARKUP_MARKER_TYPE, [], 0, 'bar'],
          [MD_MARKUP_MARKER_TYPE, [], 0, 'baz']
        ]]
      ]
    };
    const wrapper = shallow(<MobiledocRenderer mobiledoc={mobiledoc} />);
    const list = wrapper.find('li');
    expect(list.at(0).key()).to.eql('0');
    expect(list.at(2).key()).to.eql('2');
  });
});

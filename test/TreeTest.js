import { shallow } from 'enzyme';
import { expect } from 'chai';
import { MARKUP_SECTION_TYPE, MARKUP_MARKER_TYPE } from '../src/utils/nodeTypes';
import { nodesToTags, treeToReact } from '../src/Tree';

describe('nodesToTags()', () => {
  it('maps markup markers to nodes', () => {
    const markups = [
      ['a', ['rel', 'nofollow']]
    ];
    const tree = [MARKUP_SECTION_TYPE, 'p', [
      [MARKUP_MARKER_TYPE, 0, ['ohai']]
    ]];
    expect(nodesToTags(markups)(tree)).to.eql([
      MARKUP_SECTION_TYPE, 'p', {}, [
        [MARKUP_MARKER_TYPE, 'a', { 'rel': 'nofollow' }, ['ohai']]
      ]
    ]);
  });
});


describe('treeToReact()', () => {
  it('renders a simple element', () => {
    const wrapper = shallow(treeToReact([MARKUP_SECTION_TYPE, 'p', {}]));
    expect(wrapper).to.have.html('<p></p>');
  });

  it('renders nested elements', () => {
    const wrapper = shallow(treeToReact([MARKUP_SECTION_TYPE, 'ul', {}, [[MARKUP_MARKER_TYPE, 'li', {}, ['ohai']]]]));
    expect(wrapper).to.have.html('<ul><li>ohai</li></ul>');
  });
});

import MobiledocRenderer from '../src/MobiledocRenderer';
import React from 'react';
import ReactDOM from 'react-dom';

const mobiledoc = {
  markups: [
    ['b'],
    ['a', ['href', '#']]
  ],
  sections: [
    [1, 'p', [
      [0, [], 0, 'Normal '],
      [0, [1], 0, 'Linked '],
      [0, [0], 2, 'and bold']
    ]],
    [3, 'ul', [
      [0, [], 0, 'One'],
      [0, [0], 1, 'Two']
    ]]
  ]
};

const renderer = React.createElement(MobiledocRenderer, { mobiledoc, className: 'foo' });
ReactDOM.render(renderer, document.getElementById('root'));

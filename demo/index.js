import MobiledocRenderer from '../src/MobiledocRenderer';
import React from 'react';
import ReactDOM from 'react-dom';

const mobiledoc = {
  markups: [
    ['b'],
    ['a']
  ],
  sections: [
    [1, 'p', [
      [[], 0, 'Normal '],
      [[1], 0, 'Linked '],
      [[0], 2, 'and bold']
    ]]
  ]
};

const renderer = React.createElement(MobiledocRenderer, { mobiledoc, className: 'foo' });
ReactDOM.render(renderer, document.getElementById('root'));

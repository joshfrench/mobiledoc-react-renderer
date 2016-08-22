import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import addMarkups from './utils/addMarkups';
import renderSection from './section';

const MobiledocRenderer = ({ mobiledoc }) => {
  const { markups } = mobiledoc;
  const withMarkups = (markers) => addMarkups(markups, markers);
  const sections = mobiledoc.sections.map(([type, tagName, markers]) => [type, tagName, withMarkups(markers)]);
  return (
    <div>
      {sections.map(renderSection)}
    </div>
  );
};

export default MobiledocRenderer;

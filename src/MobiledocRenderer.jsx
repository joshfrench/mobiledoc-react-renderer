import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import treeToReact from './utils/treeToReact';

class MobiledocRenderer extends Component {
  render() {
    return <div>{this.props.children.map()}</div>;
  }
}

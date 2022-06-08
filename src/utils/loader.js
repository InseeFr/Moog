import React, { Component } from 'react';
import styled from 'tachyons-components';
import ReactLoading from 'react-loading';

export const Article = styled('div')`
w-25 ma2 h4 items-center justify-center flex flex-column flex-wrap`;

export default class Loader extends Component {
  render() {
    return (
      <Article>
        <h3>{this.props.text}</h3>
        <ReactLoading type={'spin'} color={'#555'} />
      </Article>
    );
  }
}

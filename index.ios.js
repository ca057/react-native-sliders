/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  PanResponder,
  View,
  ScrollView,
  processColor,
  Dimensions,
  Animated
} from 'react-native';

import TestComponent from './testcomponent.js';

var TestProject = React.createClass({
  render () {
    return (
      <TestComponent />
    );
  }
});

AppRegistry.registerComponent('TestProject', () => TestProject);

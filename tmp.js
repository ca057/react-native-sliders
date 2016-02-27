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

var TestProject = React.createClass({
  getInitialState () {
    return {
      pan: new Animated.Value(0)
    };
  },

  _panResponder: {},
  _previousLeft: 0,
  _circleStyles: {},
  circle: (null),

  componentWillMount: function() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 0;
    this._circleStyles = {
      style: {
        left: this._previousLeft
      }
    };
  },

  componentDidMount: function() {
    this._updatePosition();
  },

  _updatePosition: function() {
    this.circle.setNativeProps(this._circleStyles);
  },

  _handleStartShouldSetPanResponder: function(e, gestureState) {
    // Should we become active when the user presses down on the circle?
    return true;
  },

  _handleMoveShouldSetPanResponder: function(e, gestureState) {
    // Should we become active when the user moves a touch over the circle?
    return true;
  },

  _handlePanResponderGrant: function(e, gestureState) {
  },
  _handlePanResponderMove: function(e, gestureState) {
    console.log(e);
    console.log(gestureState);
    let newValue = this._previousLeft + gestureState.dx;
    if (newValue > width * 0.75) {
      this._circleStyles.style.left = width * 0.75;
    } else if (newValue < 0) {
      this._circleStyles.style.left = 0;
    } else {
      this._circleStyles.style.left = newValue;
    }
    this._updatePosition();
  },
  _handlePanResponderEnd: function(e, gestureState) {
    if (gestureState.vx > 0) {
      this.setState({pan: new Animated.Value(this._circleStyles.style.left)});
      if (this._circleStyles.style.left > width/4) {
        this._animateToEnd(gestureState);
      } else if (this._circleStyles.style.left < width/4) {
        this._animateToBeginning(gestureState);
      }
    } else if (gestureState.vx < 0) {
      this.setState({pan: new Animated.Value(this._circleStyles.style.left)});
      this._animateToBeginning(gestureState);
    }
  },

  _animateToEnd (gestureState) {
    Animated.timing(
      this.state.pan,
      {
        toValue: (width * 0.75),
        // friction: 5,
        // velocity: 0.5,
        duration: 500
      }
    ).start();
    this._previousLeft += gestureState.dx;
  },

  _animateToBeginning (gestureState) {
    Animated.timing(
      this.state.pan,
      {
        toValue: 0,
        friction: 5,
        velocity: 0.5,
        duration: 500
      }
    ).start();
    this._previousLeft += gestureState.dx;
  },

  _resetPosition () {
    console.log(this._circleStyles.style.left);
    console.log(this.circle.props.style[1].transform[0].translateX._value);
    this._circleStyles.style.left += this.circle.props.style[1].transform[0].translateX._value;
    this._updatePosition();
    this.setState({pan: new Animated.Value(0)});
  },

  render() {
    var self = this;
    return (
      <View style={styles.container}>
        <Animated.View
          ref={circle => {this.circle = circle;}}
          // style={[styles.rect, {transform: [{translateX: this.state.pan}]}]}
          style={[styles.rect, {left: this.state.pan, backgroundColor: 'green'}]}
          {...this._panResponder.panHandlers}
        />
        <ScrollView
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={16 /* get all events */ }
          contentContainerStyle={{flex: 2, width: width * 2}}
          horizontal pagingEnabled
          showsHorizontalScrollIndicator
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: new Animated.Value(50)}}}]  // nested event mapping
          )}
        >
          <View style={[styles.rect, {backgroundColor: 'red'}]} />
        </ScrollView>
      </View>
    );
  },
});

var width = Dimensions.get('window').width; //full width

var styles = StyleSheet.create({
  container: {
    top: 20,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  rect: {
    width: width/2,
    height: 80,
    flex: 0,
  },
  scroll: {
    width: width * 1.25,
  }
});

// AppRegistry.registerComponent('TestProject', () => TestProject);

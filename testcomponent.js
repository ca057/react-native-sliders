'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  PanResponder,
  View,
  ScrollView,
  Dimensions,
  Animated
} from 'react-native';


var TestComponent = React.createClass({
  getInitialState () {
    return {
      pan: new Animated.Value(0)
    };
  },

  _panResponder: {},
  _previousLeft: 0,
  _tileStyles: {},
  tile: (null),
  scroll: null,

  _scrollPanResponder: {},

  componentWillMount: function() {
    this._setupScrollPanResponder();

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 0;
    this._tileStyles = {
      style: {
        left: this._previousLeft
      }
    };
  },

  componentDidMount: function() {
    this._updatePosition();
  },

  _updatePosition: function() {
    this.tile.setNativeProps(this._tileStyles);
  },

  _handlePanResponderMove: function(e, gestureState) {
    let newValue = this._previousLeft + gestureState.dx;
    if (newValue > width * 0.75) {
      this._tileStyles.style.left = width * 0.75;
    } else if (newValue < 0) {
      this._tileStyles.style.left = 0;
    } else {
      this._tileStyles.style.left = newValue;
    }
    this._updatePosition();
  },
  _handlePanResponderEnd: function(e, gestureState) {
    if (gestureState.vx > 0) {
      this.setState({pan: new Animated.Value(this._tileStyles.style.left)});
      if (this._tileStyles.style.left > width/6) {
        this._animateToEnd(gestureState);
      } else if (this._tileStyles.style.left < width/4) {
        this._animateToBeginning(gestureState);
      }
    } else if (gestureState.vx < 0) {
      this.setState({pan: new Animated.Value(this._tileStyles.style.left)});
      this._animateToBeginning(gestureState);
    }
  },

  _animateToEnd (gestureState) {
    console.log((this.state.pan._value / (width * 0.75)) * gestureState.vx);
    Animated.sequence([
      Animated.decay(this.state.pan,
        {
          velocity: gestureState.vx,
          decelaration: 0.9,
        }),
      Animated.timing(
        this.state.pan,
        {
          toValue: (width * 0.75),
          // friction: 5,
          // velocity: 0.5,
          duration: 500
        }
      )
    ]).start();
    this._previousLeft += gestureState.dx;
  },

  _animateToBeginning (gestureState) {
    Animated.timing(
      this.state.pan,
      {
        toValue: 0,
        friction: 5,
        velocity: 0.9,
        duration: 500
      }
    ).start();
    this._previousLeft += gestureState.dx;
  },

  _resetPosition () {
    this._tileStyles.style.left += this.tile.props.style[1].transform[0].translateX._value;
    this._updatePosition();
    this.setState({pan: new Animated.Value(0)});
  },

  _setupScrollPanResponder () {
    this._scrollPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, g) => {

      },
      onPanResponderRelease: (e, g) => {
        this.scroll.scrollTo(0, -width * 0.75, true);
      },
      onPanResponderTerminate: (e, g) => {
        this.scroll.scrollTo();
      },
    });
  },

  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          ref={tile => {this.tile = tile;}}
          style={[styles.rect, {left: this.state.pan, backgroundColor: 'green'}]}
          {...this._panResponder.panHandlers}
        />
        <ScrollView
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={16 /* get all events */ }
          contentContainerStyle={{flex: 1, width: width * 1.25}}
          horizontal pagingEnabled
          showsHorizontalScrollIndicator
        >
          <View style={[styles.rect, {backgroundColor: 'red'}]} />
        </ScrollView>
        <View>
          <ScrollView
            ref={s => {this.scroll = s;}}
            scrollEventThrottle={16 /* get all events */ }
            contentContainerStyle={{flex: 1, width: width * 1.25}}
            horizontal showsHorizontalScrollIndicator
            {...this._scrollPanResponder.panHandlers}
          >
            <Animated.View style={[styles.rect, {backgroundColor: 'blue'}]} />
          </ScrollView>
        </View>
      </View>
    );
  },
});

var width = Dimensions.get('window').width; //full width

var styles = StyleSheet.create({
  container: {
    paddingTop: 20,
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

export default TestComponent;

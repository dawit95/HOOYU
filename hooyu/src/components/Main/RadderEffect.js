import React from 'react'
import { Dimensions, Animated } from 'react-native'


const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
const radarWidth = Dimensions.get('window').width * 0.7

class RadderEffect extends React.Component {
  state = {
    animation: new Animated.Value(0),
  }

  componentDidMount() {
    const rotateAnimation = Animated.timing(
      this.state.animation,
      {
        toValue: 1,
        duration: 10000,
        useNativeDriver: false
      },
    )
    Animated.loop(
      rotateAnimation,
      {
        iterations: -1,
      },
    ).start()
  }

  render() {
    const animationStyles = {
      width: this.state.animation.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [-radarWidth + 5, radarWidth - 5, radarWidth - 5]
      }),
      height: this.state.animation.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [-radarWidth + 5, radarWidth - 5, radarWidth - 5]
      }),
      opacity: this.state.animation.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [1, 0, 0]
      }),
    }
    
    return (
      <Animated.View style={[objectStyles.object, animationStyles]}>
      </Animated.View>
    )
  }
}

const objectStyles = {
  object: {
    borderWidth: 10,
    borderColor: '#FDA604',
    borderRadius: Math.round(deviceWidth + deviceHeight) / 2,
    width: radarWidth,
    height: radarWidth,
    position: "absolute",
  },
}

export { RadderEffect }
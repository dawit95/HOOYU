import React, { useEffect, useState } from 'react'
import { View, LogBox } from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons'
import CompassHeading from 'react-native-compass-heading'
import { connect } from 'react-redux'


const Direction = ({radarWidth}) => {
  
  LogBox.ignoreAllLogs()

  const [compassHeading, setCompassHeading] = useState(0)

  useEffect(() => {
    const degree_update_rate = 5
    CompassHeading.start(degree_update_rate, degree => {
      setCompassHeading(degree)
    })
    return () => {
      CompassHeading.stop()
    }
  }, [])

  return (
    <View
      style={{
        width: radarWidth + 40,
        height: radarWidth + 40,
        alignItems: 'center',
        transform: [{rotate: `${360 - compassHeading.heading}deg`}]
      }}
    >
      <SimpleLineIcons name="arrow-up" size={30} color="white" style={{position:'absolute',top:0, opacity:0.7}}/>
    </View>
  )
}

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    deviceHeight: state.user.deviceHeight,
  }
}

export default connect(mapStateToProps)(Direction)
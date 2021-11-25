import React, {useEffect, useState} from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import { TextInput } from 'react-native-gesture-handler'


const SettingPrivateZone = ({ userLocation, deviceWidth, SERVER_URL, onCreate }) => {
  
  const styles = styleSheet(deviceWidth)

  const [privateZoneName, setPrivateZoneName] = useState('')

  const confirmPrivateZone = () => {
    if (privateZoneName) {
      setPrivateZone()
    }
  }

  const setPrivateZone = () => {
    axios({
      method: 'post',
      url: SERVER_URL + 'user/setPrivate',
      data: {
        'lat': userLocation.latitude,
        'lon': userLocation.longitude,
        'title': privateZoneName,
      }
    })
    .then(() => {
      onCreate()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const mainButton = () => {
    return {
      width: deviceWidth * 0.7,
      height: 50,
      backgroundColor: privateZoneName ? '#F38181' : '#ccc',
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    }
  }

  useEffect(() => {

  }, [privateZoneName])

  return (
    <View style={{flex:1}}>
      <View style={{flex: 2, padding: 20}}>
        <View style={{flex: 1, borderWidth: 1, borderColor: '#aaa'}}>
          <MapView 
            style={{ flex : 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: userLocation.latitude, 
                longitude: userLocation.longitude
              }}
              tappable={false}
            />
            <Circle
              center={{
                latitude: userLocation.latitude, 
                longitude: userLocation.longitude
              }}
              radius={100}
              strokeWidth={2}
              strokeColor={'#FF6A77'}
              fillColor={ '#FF6A7755' }
            />
          </MapView>
        </View>
        <TextInput 
          style={styles.privateZoneNameInput}
          placeholder={'프라이빗 존 이름을 입력해주세요.'}
          onChangeText={(text) => setPrivateZoneName(text)}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <TouchableWithoutFeedback
          onPress={() => confirmPrivateZone()}
        >
          <View style={mainButton()}>
            <Text style={{fontSize: 16, fontWeight: '700', color: 'white'}}>확인</Text>
          </View>
        </TouchableWithoutFeedback>
      </View> 
    </View>
  )
}

const styleSheet = () => StyleSheet.create({
  privateZoneNameInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    marginTop: 10,
    height: 40,
    borderRadius: 10,
    textAlign: 'center'
  }
})

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    SERVER_URL: state.user.SERVER_URL
  }
}

export default connect(mapStateToProps)(SettingPrivateZone)
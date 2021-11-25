import React, { useEffect, useState } from 'react'
import { View, Text, LogBox } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import ListPrivateZone from '../../components/PrivateZone/ListPrivateZone'
import NoPrivateZone from '../../components/PrivateZone/NoPrivateZone'
import SettingPrivateZone from '../../components/PrivateZone/SettingPrivateZone'
import { connect } from 'react-redux'
import axios from 'axios'


const PrivateZoneSetting = ({ SERVER_URL, deviceWidth }) => {

  LogBox.ignoreAllLogs()

  const [isSettingPrivateZone, setIsSettingPrivateZone] = useState(false)
  const [privateZoneList, setPrivateZoneList] = useState([])
  const [gotList, setGotList] = useState(false)
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 })

  useEffect(() => {
    if (!gotList) {
      getPrivateZone()
      setGotList(true)
    }
    Geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      setUserLocation({ latitude: latitude, longitude: longitude})
    })
  }, [isSettingPrivateZone, privateZoneList])
  
  const goToSettingPrivateZone = () => {
    setIsSettingPrivateZone(true)
  }

  const getPrivateZone = () => {
    axios({
      method: 'get',
      url: SERVER_URL + 'user/private',
    })
    .then((res) => {
      setPrivateZoneList(res.data.success)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const privateZoneComponent = () => {
    if (isSettingPrivateZone) {
      return <SettingPrivateZone 
        userLocation={userLocation} 
        privateZoneList={privateZoneList} 
        onCreate={() => {
          setIsSettingPrivateZone(false)
          getPrivateZone()
        }} 
      />
    } else {
      return privateZoneList.length ? 
      <ListPrivateZone privateZoneList={privateZoneList} onDelete={getPrivateZone} userLocation={userLocation} /> 
      : 
      <NoPrivateZone goToSettingPrivateZone={goToSettingPrivateZone}/>
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          width: deviceWidth,
          height: 60,
          backgroundColor: 'white',
          paddingLeft: 20,
          paddingRight: 20,
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E5',
        }}
      >
        <View><Text style={{fontSize: 16, fontWeight: '700'}}>나의 프라이빗 존</Text></View>
      </View>
      {
        privateZoneComponent()
      }
    </View>
  )
}

function mapStateToProps(state) {
  return {
    SERVER_URL: state.user.SERVER_URL,
    deviceWidth: state.user.deviceWidth
  }
}

export default connect(mapStateToProps)(PrivateZoneSetting)
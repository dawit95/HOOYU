import React, { useEffect, useState } from 'react'
import { View, Text, Switch, LogBox } from 'react-native'
import PushButtonGroup from './PushButtonGroup'
import Api from '../../utils/api'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/reducers'


const PushSetting = ({deviceWidth, setPushSetting, acceptPush, acceptRadius, acceptSync}) => {

  LogBox.ignoreAllLogs()

  const [isPushEnabled, setIsPushEnabled] = useState(acceptPush)
  const [isPushSyncEnabled, setIsPushSyncEnabled] = useState(acceptSync)
  const [pushRadius, setPushRadius] = useState(acceptRadius)
  const [first, setFirst] = useState(0)
  
  const updateAcceptPush = () => {
    Api.setPushSetting(isPushEnabled, pushRadius, isPushSyncEnabled)
      .then(() => {
        setPushSetting(isPushEnabled, pushRadius, isPushSyncEnabled)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (first !== 0) {
      if (!isPushEnabled) {
        setIsPushSyncEnabled(false)
      }
      updateAcceptPush()
    }
    setFirst(1)
  }, [ isPushEnabled, isPushSyncEnabled, pushRadius ])

  const pushToggleSwitch = () => {
    setIsPushEnabled(!isPushEnabled)
    setIsPushSyncEnabled(false)
  }

  const pushSyncToggleSwitch = () => {
    setIsPushSyncEnabled(!isPushSyncEnabled)
  }

  return (
    <>
      <View
        style={{
          width: deviceWidth,
          height: 60,
          backgroundColor: 'white',
          paddingLeft: 20,
          paddingRight: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E5',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700' }}>푸시 알림 받기</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#F38181" }}
          thumbColor={isPushEnabled ? "white" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={pushToggleSwitch}
          value={isPushEnabled}
        />
      </View>
      
      <View
        style={{
          width: deviceWidth,
          height: 60,
          backgroundColor: 'white',
          paddingLeft: 20,
          paddingRight: 20,
          justifyContent: 'center',
          backgroundColor: `${isPushEnabled && !isPushSyncEnabled ? 'white' : "#E5E5E5"}`,
        }}
      >
        <Text style={{ color: `${isPushEnabled && !isPushSyncEnabled ? 'black' : "#767577"}`, fontSize: 16, fontWeight: '700' }}>푸시 알림 반경</Text>
      </View>
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
          backgroundColor: `${isPushEnabled && !isPushSyncEnabled ? 'white' : "#E5E5E5"}`,
        }}
      >
        <PushButtonGroup 
          setPushRadius={setPushRadius} 
          currentRadius={acceptRadius} 
          isPushEnabled={isPushEnabled && !isPushSyncEnabled }
        />
      </View>
      <View
        pointerEvents={isPushEnabled ? "auto" : "none"} 
        style={{
          width: deviceWidth,
          height: 60,
          backgroundColor: `${isPushEnabled ? 'white' : "#E5E5E5"}`,
          paddingLeft: 20,
          paddingRight: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E5',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: `${isPushEnabled ? 'black' : "#767577"}`, fontSize: 16, fontWeight: '700' }}>메인 반경과 동기화</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#F38181" }}
          thumbColor={isPushSyncEnabled ? "white" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={pushSyncToggleSwitch}
          value={isPushSyncEnabled}
        />
      </View>
    </>
  )
}

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    deviceHeight: state.user.deviceHeight,
    myRadius: state.user.myRadius,
    acceptPush: state.user.acceptPush,
    acceptRadius: state.user.acceptRadius,
    acceptSync: state.user.acceptSync,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setPushSetting: (acceptPush, acceptRadius, acceptSync) => {
      dispatch(actionCreators.setPushSetting({acceptPush, acceptRadius, acceptSync}))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PushSetting)
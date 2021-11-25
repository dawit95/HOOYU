import React, { useState, useEffect } from 'react'
import { LogBox } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Main from '../screen/Main'
import Login from '../screen/Login'
import ProfileScreen from '../screen/ProfileScreen'
import SettingScreen from '../screen/SettingScreen'
import NicknameTutorial from '../screen/NicknameTutorial'
import StatusTutorial from '../screen/StatusTutorial'
import EmojiTutorial from '../screen/EmojiTutorial'
import InfoAgree from '../screen/InfoAgree'
import CreateContent from '../screen/CreateContent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { connect } from 'react-redux'
import { actionCreators } from '../store/reducers'
import jwt_decode from "jwt-decode"
import api from '../utils/api'
import SplashScreen from 'react-native-splash-screen'
import UserSetting from '../screen/Setting/UserSetting'
import PrivateZoneSetting from '../screen/Setting/PrivateZoneSetting'
import PushSetting from '../screen/Setting/PushSetting'
import * as Location from 'expo-location'


const Nav = createNativeStackNavigator()

const Root = ({ setUserPK, setUserEmoji, setUserName }) => {
  
  LogBox.ignoreAllLogs()

  const [accessToken, setAccessToken] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [emoji, setEmoji] = useState(null)

  const [front, setFront] = useState(false)
  const [back, setBack] = useState(false)

  useEffect(async () => {
    const front1 = await Location.getForegroundPermissionsAsync()
    const back1 = await Location.getBackgroundPermissionsAsync()
    setFront(front1.granted)
    setBack(back1.granted)
    AsyncStorage.getItem('access_token', async (err, result) => {
      if (result) {
        setUserPK(jwt_decode(result).pk)
        setAccessToken(result)
        await api.getUser(jwt_decode(result).pk)
          .then((res) => {
            setUserEmoji(res.data.success.emoji)
            setUserName(res.data.success.name)
            setEmoji(res.data.success.emoji)
          }).catch((err) => {
            console.log(err)
          })
      }
      setIsReady(true)
      SplashScreen.hide()
    })
    
  }, [])
  
  if (!isReady) {
    return (
      <>
      </>
    )
  }

  return (
    <Nav.Navigator
      initialRouteName={(accessToken && emoji && front && back) ? "Main" : (accessToken && emoji ? "InfoAgree" : ((accessToken) ? "NicknameTutorial" : "Login"))}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Nav.Screen name="Login" component={Login} />
      <Nav.Screen name="NicknameTutorial" component={NicknameTutorial} />
      <Nav.Screen name="StatusTutorial" component={StatusTutorial} />
      <Nav.Screen name="EmojiTutorial" component={EmojiTutorial} />
      <Nav.Screen name="InfoAgree" component={InfoAgree} />
      <Nav.Screen name="Main" component={Main} />
      <Nav.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }} />
      <Nav.Screen name="Setting" component={SettingScreen} options={{ headerShown: true, headerTitle: "설정" }} />

      {/* 세부 설정 */}
      <Nav.Screen name="UserSetting" component={UserSetting} options={{
        headerShown: true,
        headerTitle: "계정 설정",
      }} />
      <Nav.Screen name="PrivateZoneSetting" component={PrivateZoneSetting} options={{
        headerShown: true,
        headerTitle: "프라이빗 존",
      }} />
      <Nav.Screen name="PushSetting" component={PushSetting} options={{
        headerShown: true,
        headerTitle: "푸시 알림",
      }} />

      {/* 컨텐츠 생성 */}
      <Nav.Screen name="CreateContent" component={CreateContent} options={{ headerShown: true }} />
    </Nav.Navigator>
  )
}

function mapStateToProps(state) {
  return {
    userEmoji: state.user.userEmoji
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setUserPK: (pk) => {
      dispatch(actionCreators.setUserPK(pk))
    },
    setUserEmoji: (emoji) => {
      dispatch(actionCreators.setUserEmoji(emoji))
    },
    setUserName: (emoji) => {
      dispatch(actionCreators.setUserName(emoji))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)

import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native';
import Main from '../screen/Main';
import Login from '../screen/Login';
import ProfileScreen from '../screen/ProfileScreen';
import SettingScreen from '../screen/SettingScreen';
import NicknameTutorial from '../screen/NicknameTutorial';
import StatusTutorial from '../screen/StatusTutorial'
import EmojiTutorial from '../screen/EmojiTutorial'
import CreateContent from '../screen/CreateContent';
import UserScreen from '../screen/UserScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { connect } from 'react-redux'
import { actionCreators } from '../store/reducers'
import jwt_decode from "jwt-decode";
import SplashScreen from 'react-native-splash-screen'


const Nav = createNativeStackNavigator()

const Root = ({ setUserPK }) => {
  const navigation = useNavigation();

  const [accessToken, setAccessToken] = useState(null)
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('access_token', (err, result) => {
      if (result) {
        setUserPK(jwt_decode(result).pk)
        setAccessToken(result)
      }
      setIsReady(true)
      SplashScreen.hide()
    })

  },[])
  
  if (!isReady) {
    return (
      <>
      </>
    )
  }

  return (
    <Nav.Navigator
      initialRouteName={accessToken ? "Main" : "Login"}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >

      {/* 로그인 화면 */}
      <Nav.Screen name="Login" component={Login} />
      {/* <Nav.Screen name="Loading" component={Loading} /> */}
      <Nav.Screen name="NicknameTutorial" component={NicknameTutorial} />
      <Nav.Screen name="StatusTutorial" component={StatusTutorial} />
      <Nav.Screen name="EmojiTutorial" component={EmojiTutorial} />
      <Nav.Screen name="Main" component={Main} />
      <Nav.Screen name="Profile" component={ProfileScreen}
        options={{
          headerShown: true,
        }}/>
      <Nav.Screen name="Setting" component={SettingScreen} options={{
        headerShown: true,
        headerTitle: "설정",
      }} />

      {/* 유저 페이지 */}
      <Nav.Screen name="User" component={UserScreen}
        options={{
          headerShown: true,
        }}/>
      {/* 세부 설정 */}
      {/* <Nav.Screen name="UserSetting" component={SettingScreen} options={{
        headerShown: true,
        headerTitle: "계정 설정",
      }} />
      <Nav.Screen name="PrivateZoneSetting" component={SettingScreen} options={{
        headerShown: true,
        headerTitle: "프라이빗 존",
      }} />
      <Nav.Screen name="PushSetting" component={SettingScreen} options={{
        headerShown: true,
        headerTitle: "푸시 알림",
      }} /> */}
      
      {/* 컨텐츠 생성 */}
      <Nav.Screen name="CreateContent" component={CreateContent} options={{ headerShown: true }} />
      {/* <Nav.Screen name="CreateStatus" component={Status} options={{ headerShown: true }} /> */}
      {/* <Nav.Screen name="CreateImage" component={CreateImageScreen} options={{ headerShown: true }} /> */}
      {/* <Nav.Screen name="CreateEmoji" component={CreateEmojiScreen} options={{ headerShown: true }} /> */}
      {/* <Nav.Screen name="CreateSurvey" component={CreateSurveyScreen} options={{ headerShown: true }} /> */}
    </Nav.Navigator>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    setUserPK: (pk) => {
      dispatch(actionCreators.setUserPK(pk))
    }
  }
}

export default connect(null, mapDispatchToProps)(Root)


import React, { useState, useEffect, useRef } from 'react'
import images from '../assets/images'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode"
import Api from "../utils/api"
import { connect } from 'react-redux'
import { actionCreators } from '../store/reducers'
import messaging from '@react-native-firebase/messaging'
import * as Location from 'expo-location'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'
import { SafeAreaView, View, Image, ActivityIndicator, LogBox } from 'react-native'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin'


const Login = ({ navigation: { navigate }, deviceHeight, deviceWidth, setUserPK, setUserEmoji, setUserName, setPushSetting }) => {
  
  LogBox.ignoreAllLogs()
  
  const [gettingLoginStatus, setGettingLoginStatus] = useState(true)
  const toastRef = useRef()

  const [userPK1, setUserPK1] = useState(0)
  const [userEmoji1, setUserEmoji1] = useState(null)


  const navigation = useNavigation()

  useEffect( async () => {
    const front = await Location.getForegroundPermissionsAsync()
    const back = await Location.getBackgroundPermissionsAsync()
    if (userPK1 !== 0 && userEmoji1) {
      if (!front.granted && !back.granted) {
        navigation.reset({ routes: [{ name: 'InfoAgree' }] })
      }
      else {
        navigation.reset({ routes: [{ name: 'Main' }] })
      }
    } else if (userPK1 !== 0 && !userEmoji1) {
      navigation.reset({ routes: [{ name: 'NicknameTutorial' }] })
    } else {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        webClientId: '5095342969-dcob776t7ckfeu2gddkb2j4ke2cprfst.apps.googleusercontent.com',
      })
      isSignedIn()
    }
  }, [userPK1 ,userEmoji1])

  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn()
    const accessToken = await AsyncStorage.getItem('access_token')
    if (accessToken) {
      await getCurrentUserInfo()
      setTimeout(() => {
        setGettingLoginStatus(false)
      }, 1000)
    }
    setGettingLoginStatus(false)
  }
  
  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently()
      const accessToken = await AsyncStorage.getItem('access_token')
      var fcmToken = ''
      await messaging().getToken()
        .then((res) => {
          fcmToken = res
        })
      await Api.setFCMToken(fcmToken)
      .catch((err) => {
        console.log(err)
      })
      await setUserPK(jwt_decode(accessToken).pk)
      Api.getUser(jwt_decode(accessToken).pk)
        .then((res) => {
          setUserEmoji(res.data.success.emoji)
          setUserEmoji1(res.data.success.emoji)
          setUserPK1(res.data.success.id)
          setUserName(res.data.success.name)
          setPushSetting(res.data.success.acceptPush, res.data.success.acceptRadius, res.data.success.acceptSync)
        })
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log('아직 로그인 하지 않았음')
      } else {
        console.log("에러에러")
      }
    }
  }

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      })
      const userInfo = await GoogleSignin.signIn()
      await Api.loginGoogle(userInfo.idToken)
        .then(async (res) => {
          await AsyncStorage.setItem('access_token', res.headers['access_token'])
          await AsyncStorage.setItem('refresh_token', res.headers['refresh_token'])
          setUserPK(res.data.success.id)
        }).catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.log('Message', JSON.stringify(error))
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        toastRef.current.show('로그인이 중단되었습니다.')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        toastRef.current.show('로그인 중입니다.')
      } else if (
        error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        toastRef.current.show('죄송합니다. 서비스를 이용할 수 없습니다.\n잠시 후 재시도 해주세요.')
      } else {
        console.log(error.message)
      }
    }
    isSignedIn()
  }

  if (gettingLoginStatus) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FF6A77' }}>
        <View style={{ flex: 0.7, justifyContent: "center", alignItems: "center" }}>
          <View style={{}}>
            <Image
              source={images.logo}
              style={{ width: deviceWidth * 0.5, height: deviceWidth * 0.5 }}
            />
          </View>
        </View>
        <View style={{ flex: 0.3, alignItems: "center" }}>
          <View style={{ elevation: 4 }}>
            <GoogleSigninButton
              style={{ width: 312, height: 68 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={signIn}
            />
          </View>
        </View>
        <Toast 
          ref={toastRef}
          positionValue={deviceHeight * 0.4}
          fadeInDuration={200}
          fadeOutDuration={1000}
          style={{backgroundColor:'rgba(0, 0, 0, 0.5)'}}
        />
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    deviceHeight: state.user.deviceHeight,
    myRadius: state.user.myRadius,
    SERVER_URL: state.user.SERVER_URL,
    userEmoji: state.user.userEmoji,
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
    setPushSetting: (acceptPush, acceptRadius, acceptSync) => {
      dispatch(actionCreators.setPushSetting({acceptPush, acceptRadius, acceptSync}))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
import React from 'react'
import { Text, View, TouchableOpacity, LogBox } from 'react-native'
import Modal from "react-native-modal"
import Api from '../../utils/api'
import { connect } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { actionCreators } from '../../store/reducers'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin'


const LogoutModal = ({ isModalVisible, setModalVisible, setUserEmoji, setUserPK }) => {
  
  LogBox.ignoreAllLogs()

  const navigation = useNavigation()
  
  const sendModalVisible = () => {
    setModalVisible(!isModalVisible)
  }

  const sendLogout = () => {
    signOut()
  }

  const signOut = async () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '5095342969-dcob776t7ckfeu2gddkb2j4ke2cprfst.apps.googleusercontent.com',
    })
    try {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
      Api.setUserKilled()
        .then(async() => {
          setUserEmoji(null)
          setUserPK(0)
          await AsyncStorage.removeItem('access_token')
          await AsyncStorage.removeItem('refresh_token')
          setModalVisible(!isModalVisible)
          navigation.reset({ routes: [{ name: 'Login' }] })
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={sendModalVisible}
      useNativeDriver={true}
      style={{
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
      }}
    >
      <View 
        style={{
          padding: 20,
          backgroundColor: 'white',
          width: 320,
          height: 170,
        }}
      > 
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>로그아웃</Text>
        <Text style={{ fontSize: 14, marginBottom: 2 }}>로그아웃 하시겠습니까?</Text>
        <View style={{ paddingTop: 30, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <TouchableOpacity 
            style={{paddingLeft: 10, paddingRight: 10}} 
            onPress={sendModalVisible}
          >
            <Text style={{ fontSize: 16, color: 'black' }}>아니오</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{paddingLeft: 20, paddingRight: 20}} 
            onPress={sendLogout}
          >
            <Text style={{ fontSize: 16, color: 'red' }}>네</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    setUserPK: (pk) => {
      dispatch(actionCreators.setUserPK(pk))
    },
    setUserEmoji: (emoji) => {
      dispatch(actionCreators.setUserEmoji(emoji))
    },
  }
}

export default connect(null, mapDispatchToProps)(LogoutModal)
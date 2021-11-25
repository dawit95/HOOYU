import React from 'react'
import { Text, View, TouchableOpacity, LogBox } from 'react-native'
import Modal from "react-native-modal"
import api from '../../utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { connect } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { actionCreators } from '../../store/reducers'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const UnregisterModal = ({ isModalVisible, setModalVisible, setUserEmoji, setUserPK }) => {

  LogBox.ignoreAllLogs()

  const navigation = useNavigation()

  const sendModalVisible = () => {
    setModalVisible(!isModalVisible)
  }

  const sendReport = async () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '5095342969-dcob776t7ckfeu2gddkb2j4ke2cprfst.apps.googleusercontent.com',
    })
    try {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()

      api.userDelete()
        .then(async() => {
          setModalVisible(!isModalVisible)
          setUserEmoji(null)
          setUserPK(0)
          await AsyncStorage.removeItem('access_token')
          await AsyncStorage.removeItem('refresh_token')
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
          height: 190,
        }}
      >
        <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 20}}>회원탈퇴</Text>
        <Text style={{fontSize: 14, marginBottom: 2}}>회원 탈퇴 하시겠습니까?</Text>
        <Text style={{fontSize: 14, marginBottom: 2, color: 'gray'}}>(탈퇴 시 데이터는 보존되지 않습니다.)</Text>
        <View style={{paddingTop: 30, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
          <TouchableOpacity 
            style={{paddingRight: 30}} 
            onPress={sendModalVisible}
          >
            <Text style={{fontSize: 16, color: 'black'}}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{paddingRight: 20}} 
            onPress={sendReport}
          >
            <Text style={{fontSize: 16, color: 'red'}}>회원 탈퇴</Text>
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

export default connect(null, mapDispatchToProps)(UnregisterModal)

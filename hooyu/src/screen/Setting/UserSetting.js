import React, { useState } from 'react'
import { View, Text, TouchableOpacity, LogBox } from 'react-native'
import { connect } from 'react-redux'
import NicknameChangeModal from '../../components/modal/nicknameChangeModal'
import LogoutModal from '../../components/modal/logoutModal'
import UnregisterModal from '../../components/modal/unregisterModal'


const UserSetting = ({deviceWidth, deviceHeight}) => {

  LogBox.ignoreAllLogs()

  const [isNicknameChangeModalVisible, setNicknameChangeModalVisible] = useState(false)
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false)
  const [isUnregisterModalVisible, setUnregisterModalVisible] = useState(false)
  
  return (
    <>
      <View>
        <NicknameChangeModal
          isModalVisible={isNicknameChangeModalVisible}
          setModalVisible={setNicknameChangeModalVisible}
        />
        <LogoutModal
          isModalVisible={isLogoutModalVisible}
          setModalVisible={setLogoutModalVisible}
        />
        <UnregisterModal
          isModalVisible={isUnregisterModalVisible}
          setModalVisible={setUnregisterModalVisible}
        />
      </View>
      <TouchableOpacity
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
        onPress={() => { setNicknameChangeModalVisible(true) }}
      >
        <View><Text style={{fontSize: 16, fontWeight: '700'}}>닉네임 변경</Text></View>
      </TouchableOpacity>
      <TouchableOpacity
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
        onPress={() => { setLogoutModalVisible(true) }}
      >
        <View><Text style={{fontSize: 16, fontWeight: '700'}}>로그아웃</Text></View>
      </TouchableOpacity>
      <TouchableOpacity
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
        onPress={() => { setUnregisterModalVisible(true) }}
      >
        <View><Text style={{fontSize: 16, fontWeight: '700', color: 'red'}}>회원탈퇴</Text></View>
      </TouchableOpacity>
    </>
  )
}

function mapStateToProps(state) {
  return {
    deviceHeight: state.user.deviceHeight,
    deviceWidth: state.user.deviceWidth,
  }
}

export default connect(mapStateToProps)(UserSetting)
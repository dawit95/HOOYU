import React from 'react'
import { Text, TouchableOpacity, View, LogBox } from 'react-native'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons' 
import { connect } from 'react-redux'


const SettingScreen = ({ navigation: { navigate }, deviceWidth }) => {

  LogBox.ignoreAllLogs()

  return (
    <View>
      <TouchableOpacity
        style={{
          width: deviceWidth,
          height: 60,
          backgroundColor: 'white',
          paddingLeft: 20,
          paddingRight: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E5',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
        onPress={() => navigate("UserSetting")}
      >
        <MaterialIcons name="person" size={24} color="black" />
        <Text style={{marginLeft: 16, fontSize: 16, fontWeight: '700'}}>계정 설정</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{
          width: deviceWidth,
          height: 60,
          backgroundColor: 'white',
          paddingLeft: 20,
          paddingRight: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E5',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
        onPress={() => navigate("PrivateZoneSetting")}
      >
        <MaterialIcons name="lock" size={24} color="black" />
        <Text style={{marginLeft: 16, fontSize: 16, fontWeight: '700'}}>프라이빗 존</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={{
          width: deviceWidth,
          height: 60,
          backgroundColor: 'white',
          paddingLeft: 20,
          paddingRight: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E5',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
        onPress={() => navigate("PushSetting")}
      >
        <MaterialCommunityIcons name="bell-ring" size={24} color="black" />
        <Text style={{marginLeft: 16, fontSize: 16, fontWeight: '700'}}>푸시 알림</Text>
      </TouchableOpacity>
    </View>
  )
}

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth
  }
}

export default connect(mapStateToProps)(SettingScreen)
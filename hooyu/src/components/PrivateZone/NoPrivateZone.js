import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'


const NoPrivateZone = ({ goToSettingPrivateZone, deviceWidth }) => {
  
  const goSetting = () => {
    goToSettingPrivateZone()
  }

  const mainButton = () => {
    return {
      width: deviceWidth * 0.7,
      height: 50,
      backgroundColor: '#F38181',
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    }
  }

  return (
    <View style={{flex:1}}>
      <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', padding: 20}}>
        <Text style={{paddingBottom: 70, fontSize: 16}}>프라이빗 존을 설정해보세요.</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <TouchableOpacity 
          style={mainButton()} 
          onPress={() => goSetting()}
        >
          <Text style={{fontSize: 16, fontWeight: '700', color: 'white'}}>프라이빗 존 설정</Text>
        </TouchableOpacity>
      </View> 
    </View>
  )
}

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    SERVER_URL: state.user.SERVER_URL,
  }
}

export default connect(mapStateToProps)(NoPrivateZone)
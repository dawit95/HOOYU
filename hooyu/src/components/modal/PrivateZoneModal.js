import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, LogBox } from 'react-native'
import Modal from "react-native-modal"
import { connect } from 'react-redux'
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps'


const PrivateZoneModal = ({ isModalVisible, onCloseModal, deviceWidth, deviceHeight, currentPrivateZone }) => {  

  LogBox.ignoreAllLogs()

  const closeModal = () => {
    onCloseModal()
  }

  return (
    <Modal 
      isVisible={isModalVisible}
      onBackdropPress={closeModal}
      useNativeDriver={true}
      style={{
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
      }}
    >
      <View 
        style={{ 
          width: deviceWidth*0.9, 
          height: deviceHeight*0.5, 
          borderRadius: 10, 
          backgroundColor: 'white', 
          padding: 20
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: '#ccc' }}>
          <MapView
            style={{ flex : 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: currentPrivateZone.latitude,
              longitude: currentPrivateZone.longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            >
            <Marker
              coordinate={{latitude: currentPrivateZone.latitude, longitude: currentPrivateZone.longitude}}
              tappable={false}
            />
            <Circle
              center={{latitude: currentPrivateZone.latitude, longitude: currentPrivateZone.longitude}}
              radius={100}
              strokeWidth={2}
              strokeColor={'#FF6A77'}
              fillColor={ '#FF6A7755' }
            />
          </MapView>
        </View>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              marginTop: 20,
              width: deviceWidth * 0.7,
              height: 50,
              backgroundColor: '#F38181',
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={closeModal}
          >
            <Text style={{fontSize: 16, fontWeight: '700', color: 'white'}}>닫기</Text>
          </TouchableOpacity>
        </View> 
      </View>
    </Modal>
  )
}

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    deviceHeight: state.user.deviceHeight
  }
}

export default connect(mapStateToProps)(PrivateZoneModal)
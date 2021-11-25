import React from 'react'
import { Text, View, TouchableOpacity, LogBox } from 'react-native'
import Modal from "react-native-modal"

const BlockModal = ({ isModalVisible, setModalVisible }) => {  
  
  LogBox.ignoreAllLogs()

  const sendModalVisible = () => {
    setModalVisible(!isModalVisible)
  }

  const sendReport = () => {
    console.log('Send Block')
    sendModalVisible()
  }

  return (
    <Modal 
      isVisible={isModalVisible}
      onBackdropPress={sendModalVisible}
      useNativeDriver={true}
      style={{
        flex: 1, justifyContent: "center", alignItems: "center",
      }}
    >
      <View style={{
        padding: 20,
        backgroundColor: 'white',
        width: 320,
        height: 180,
      }}>
        <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 20}}>차단하기</Text>
        <Text style={{fontSize: 14, marginBottom: 20}}>해당 유저를 차단하겠습니까?</Text>
        <View style={{paddingTop: 24, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
          <TouchableOpacity style={{paddingRight: 30}} onPress={sendModalVisible}>
            <Text style={{fontSize: 16}}>아니오</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingRight: 20}} onPress={sendReport}>
            <Text style={{fontSize: 16, color: 'red'}}>네</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
  
}

export default BlockModal
import React, { useState } from 'react'
import { Text, View, TouchableOpacity, LogBox } from 'react-native'
import Modal from "react-native-modal"
import Checkbox from 'expo-checkbox'
import Api from '../../utils/api'


const ReportModal = ({ contentPK, isModalVisible, setModalVisible }) => {

  LogBox.ignoreAllLogs()

  const [checkIndex, setCheckIndex] = useState(-1)
  const [isCheckedOne, setCheckedOne] = useState(false)
  const [isCheckedTwo, setCheckedTwo] = useState(false)
  const [isCheckedThree, setCheckedThree] = useState(false)
  
  const reportItems = [
    {
      id: 1,
      title: '광고성 게시물',
      isChecked: isCheckedOne,
      setChecked: () => {
        setCheckIndex(0)
        setCheckedOne(!isCheckedOne)
        setCheckedTwo(false)
        setCheckedThree(false)
      },
    },
    {
      id: 2,
      title: '유해 게시물',
      isChecked: isCheckedTwo,
      setChecked: () => {
        setCheckIndex(1)
        setCheckedOne(false)
        setCheckedTwo(!isCheckedTwo)
        setCheckedThree(false)
      },
    },
    {
      id: 3,
      title: '성적 게시물',
      isChecked: isCheckedThree,
      setChecked: () => {
        setCheckIndex(2)
        setCheckedOne(false)
        setCheckedTwo(false)
        setCheckedThree(!isCheckedThree)
      },
    }
  ]
  
  const sendModalVisible = () => {
    setModalVisible(!isModalVisible)
    setCheckedOne(false)
    setCheckedTwo(false)
    setCheckedThree(false)
  }

  const sendReport = () => {
    Api.reportContent(contentPK, reportItems[checkIndex].title)
      .catch((err) => {
        console.log(err)
      })
    sendModalVisible()
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
          height: 280,
        }}
      >
        <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 20}}>신고하기</Text>
        <Text style={{fontSize: 14, marginBottom: 20}}>신고 사유를 선택하주세요.</Text>
        {reportItems.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Checkbox
              value={item.isChecked}
              onValueChange={item.setChecked}
              style={{
                marginRight: 16,
              }}
            />
            <Text style={{fontSize: 16, fontWeight: '700'}}>{item.title}</Text>
          </View>
        ))}
        <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
          <TouchableOpacity 
            style={{paddingLeft: 10, paddingRight: 10}} 
            onPress={sendModalVisible}
          >
            <Text style={{fontSize: 16}}>아니오</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{paddingLeft: 20, paddingRight: 20}}  
            onPress={sendReport}
          >
            <Text style={{fontSize: 16, color: 'red'}}>네</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default ReportModal
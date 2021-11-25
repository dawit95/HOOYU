import axios from 'axios'
import React, { useState } from 'react'
import { Alert, Text, TouchableOpacity, View, StyleSheet, TextInput, LogBox } from 'react-native'
import { connect } from 'react-redux'
import { actionCreators } from '../store/reducers'


const StatusTutorial = ({ navigation: { navigate }, route, deviceWidth, deviceHeight, SERVER_URL, setUserName, setUserEmoji}) => {
  
  LogBox.ignoreAllLogs()
  
  const styles = styleSheet(deviceWidth, deviceHeight)

  const [inputValue, setInputValue] = useState('')

  const registerStatus = () => {
    Alert.alert(
      '가입 성공',
      `${route.params.nickname}님 환영합니다!🎉`,
      [{text: '네!'}]
    )
    userSetting()
  }

  const userSetting = () => {
    setNickname()
  }

  const setNickname = () => {
    axios({
      url: SERVER_URL + 'user/nameSet',
      method: 'post',
      data: {
        userName: route.params.nickname
      }
    })
    .then(() => {
      setUserName(route.params.nickname)
      setEmoji()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const setEmoji = () => {
    axios({
      url: SERVER_URL + 'user/emojiSet',
      method: 'post',
      data: {
        userEmoji: route.params.emoji
      }
    })
    .then(() => {
      setUserEmoji(route.params.emoji)
      setStatus()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const setStatus = () => {
    axios({
      url: SERVER_URL + 'content/create/status',
      method: 'post',
      data: {
        color: 'pink',
        exon: inputValue
      }
    })
    .then(() => {
      navigate('InfoAgree')
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <View>
      <View style={styles.statusContainer}>
        <View style={{ width: deviceWidth * 0.8 }}> 
          <Text 
            style={{
              color: '#0B1C26',
              fontSize: 22,
              fontWeight: 'bold',
            }}
          >
            오늘 내 기분은?
          </Text>
          <Text 
            style={{
              color: '#4F5457',
              fontSize: 14,
              marginTop: deviceHeight * 0.01,
            }}
          >
            오늘 당신의 기분은 어떠신가요?
          </Text>
        </View>
        <View style={styles.statusInput}>
          <TextInput
            style={{
              fontSize: 18,
            }}
            autoCapitalize={'none'}
            value={inputValue}
            onChangeText={(e) => setInputValue(e)}
            maxLength={20}
            placeholder='상태 입력'
          />
        </View>
      </View>
      <View style={styles.register__container}>
        <TouchableOpacity
          style={[styles.register, inputValue === '' && { backgroundColor: '#A1A1A1'}]}
          disabled={inputValue === ''}
          onPress={() => registerStatus()}
        >
          <Text style={styles.register__text}>
            등록
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styleSheet = (deviceWidth, deviceHeight) => StyleSheet.create({
  statusContainer: {
    alignItems: 'center',
    marginTop: deviceHeight * 0.15,
  },
  statusInput: {
    borderBottomColor: '#0B1C26',
    borderBottomWidth: 2,
    marginTop: deviceHeight * 0.1,
    paddingHorizontal: 10,
    width: deviceWidth * 0.8,
  },
  register: {
    alignItems: 'center',
    backgroundColor: '#FF6A77',
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    marginTop: deviceHeight * 0.35,
    width: deviceWidth * 0.8,
  },
  register__container: {
    alignItems: 'center',
  },
  register__text: {
    color: 'white',
    fontSize: 15,
  }
})

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    deviceHeight: state.user.deviceHeight,
    SERVER_URL: state.user.SERVER_URL,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setUserEmoji: (emoji) => {
      dispatch(actionCreators.setUserEmoji(emoji))
    },
    setUserName: (userName) => {
      dispatch(actionCreators.setUserName(userName))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusTutorial)
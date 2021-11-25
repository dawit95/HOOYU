import React, {useEffect, useRef, useCallback, useState} from 'react'
import { Text, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, ScrollView, Dimensions, TextInput, Image, Button, LogBox } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/reducers'
import * as emojiImages from '../../assets/images'
import Toast from 'react-native-easy-toast'


const emojiArray = [
  ['smile', 'amazing', 'sad', 'crying', 'sense', 'angry'], 
  ['pouting', 'pokerface', 'love', 'sunglass', 'hard', 'sleep']
]

const Survey = ({ navigation, setUserEmoji, SERVER_URL, userEmoji, deviceWidth, deviceHeight }) => {
  
  LogBox.ignoreAllLogs()
  
  const styles = styleSheet(deviceWidth)

  const [emoji, setEmoji] = useState(userEmoji)
  const [isEmojiSelect, setIsEmojiSelect] = useState(false)
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [isSurveyValid, setIsSurveyValid] = useState(false)
  
  const toastRef = useRef()

  const SurveyTitle = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => setIsEmojiSelect(true)}
        >
          <Image
            style={styles.navEmojiSelect}
            source={emojiImages.default.emoji[emoji]}
          />
        </TouchableOpacity>
        <Text style={styles.navEmojiSelectText}>이모지 선택</Text>
      </View>
    )
  }

  const onTextChange = (index, text) => {
    setOptions(options.map((option, index2) => {
      return index !== index2 ? option: text
    }))
  }

  const onOptionDelete = (index) => {
    const tmpOptions = [...options]
    tmpOptions.splice(index, 1)
    setOptions(tmpOptions)
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <SurveyTitle {...props} />,
      headerRight: () => (
        <View>
          { isSurveyValid ? 
            <TouchableOpacity 
              style={{ padding: 10 }} 
              onPress={() => {
                createSurvey()
                navigation.navigate('Main')
              }}
            >
              <Text>등록</Text>
            </TouchableOpacity>
            :
            <TouchableWithoutFeedback
              onPress={() => showToast()}
            >
              <Text style={{color: 'gray', padding: 10 }}>등록</Text>
            </TouchableWithoutFeedback>
          }

        </View>
      )
    })
    const optionArray = new Array()
    for (let i=0; i<options.length; i++) {
      if (!optionArray.includes(options[i]))
      optionArray.push(options[i])
    }
    if (title && options[0] && options[1] && options.length == optionArray.length) {
      setIsSurveyValid(true)
    } else {
      setIsSurveyValid(false)
    }
  }, [navigation, emoji, options, title, isSurveyValid])

  const showToast = useCallback(() => {
    if (!title) {
      toastRef.current.show('질문을 입력해 주세요')
    } else if (options[0] == '' || options[1] == '') {
      toastRef.current.show('옵션 2개는 필수입니다')
    } else {
      toastRef.current.show('같은 옵션이 있습니다')
    }
  })

  const createEmoji = () => {
    setUserEmoji(emoji)
    axios({
      method: 'post',
      url: SERVER_URL + 'user/emojiSet',
      data: {
        "userEmoji": emoji,
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const createSurvey = () => {
    const validOptions = options.filter(option => option.trim())
    axios({
      method: 'post',
      url: SERVER_URL + 'content/create/survey',
      data: {
        "answerList": [...validOptions],
        "requestContentDto": {
          "color": '',
          "exon": title,
        }
      }
    })
    .then(() => {
      createEmoji()
    })
    .catch((err) => {
      console.log(err)
    })
  }


  return (
    <LinearGradient colors={["#AB79EF", "#FC98AB"]} style={styles.mainView}>
      <TouchableWithoutFeedback 
        onPress={() => setIsEmojiSelect(false)} 
        style={{flex: 1, width: deviceWidth, alignItems: 'center'}}
      >
        <KeyboardAwareScrollView 
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.surveyTitleView}>
            <Text style={{ color: "#000000CC", marginLeft: 3 }}>무엇이 궁금하신가요?</Text>
            <View style={{width: deviceWidth*0.8, height: 40, backgroundColor: 'white', borderRadius: 3, justifyContent: 'center', marginTop: 10, paddingHorizontal: 10}}>
              <TextInput 
                style={{height: '100%'}}
                placeholder={"질문을 입력해주세요"}
                onChangeText={(text) => setTitle(text)}
                maxLength={36}
              />
            </View>
          </View>
          <View style={styles.surveyContentView}>
            <Text style={{ color: "#000000CC", marginLeft: 3 }}>옵션</Text>
            <View style={styles.mainOptionTextView}>
              <TextInput 
                style={{height: '100%'}}
                placeholder={"옵션을 입력해주세요"}
                onChangeText={(text) => onTextChange(0, text)}
                maxLength={16}
              />
            </View>
            <View style={styles.mainOptionTextView}>
              <TextInput 
                style={{height: '100%'}}
                placeholder={"옵션을 입력해주세요"}
                onChangeText={(text) => onTextChange(1, text)}
                maxLength={16}
              />
            </View>
            {
              options.map((option, index) => (
                index > 1 &&
                <View 
                  key={index} 
                  style={styles.subOptionTextView}
                >
                  <TextInput 
                    style={{height: '100%'}}
                    placeholder={"옵션을 입력해주세요"}
                    onChangeText={(text) => onTextChange(index, text)}
                    value={options[index]}
                    maxLength={16}
                  />
                  <TouchableOpacity 
                    onPress={()=> onOptionDelete(index)}
                  >
                    <Text style={{ fontSize: 30, marginEnd: 10, color: 'black' }}>-</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
            {
              options.length < 5 && 
              <TouchableOpacity 
                style={{ alignItems: 'center', marginTop: 15 }}
                onPress={()=> {
                  setOptions((prevState) => [...prevState, ''])
                }}
              >
                <View style={styles.addOption}>
                  <Text style={{fontSize: 20}}>+</Text>
                </View>
              </TouchableOpacity>
            }
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
      { isEmojiSelect && 
        <View style={styles.emojiSelect}>
          { [0, 1].map((num, index) => (
            <View key={index} style={styles.emojiSelectRow}>
              {emojiArray[num].map((emotion, index2) => (
                <View key={index2} style={styles.emojiSelectCol}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsEmojiSelect(false)
                      setEmoji(emojiArray[index][index2])
                    }}
                    >
                    <Image 
                      source={emojiImages.default.emoji[emotion]}
                      style={{width: '100%', height: '100%'}}
                    />
                  </TouchableOpacity>
                </View>
                ))}
            </View>
          ))}
        </View>
      }
      <Toast 
        ref={toastRef}
        positionValue={deviceHeight * 0.4}
        fadeInDuration={200}
        fadeOutDuration={1000}
        style={{backgroundColor:'rgba(0, 0, 0, 0.5)'}}
      />
    </LinearGradient>
  )
}

const styleSheet = (deviceWidth) => StyleSheet.create({
  addOption: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emojiSelect: {
    position: 'absolute',
    width: 300,
    height: 100,
    top: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 4,
  },
  emojiSelectCol: {
    flex:1, 
    width: 10, 
    height: '100%',
    padding: 5
  },
  emojiSelectRow: {
    flex: 1, 
    flexDirection: 'row',
    width: '100%', 
    height: 10
  },
  minusOption: {
    height: 30,
    width: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainOptionTextView: {
    width: deviceWidth*0.8, 
    height: 40, 
    backgroundColor: 'white', 
    borderRadius: 3, 
    justifyContent: 'center', 
    marginTop: 10, 
    paddingHorizontal: 10
  },
  mainView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navEmojiSelect: {
    width: 34, 
    height: 34
  },
  navEmojiSelectText: { 
    marginLeft: 10, 
    color: '#aaa'
  },
  subOptionTextView: {
    width: deviceWidth*0.8, 
    height: 40, 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 3, 
    justifyContent: 'space-between', 
    alignItems:'center', 
    marginTop: 10, 
    paddingHorizontal: 10
  },
  surveyContentView: {
    flex: 2,
    padding: 5,
    paddingTop: 30,
  },
  surveyTitleView: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 5,
    marginTop: 80
  },
})


function mapStateToProps(state) {
  return {
    SERVER_URL: state.user.SERVER_URL,
    userEmoji: state.user.userEmoji,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setUserEmoji: (emoji) => {
      dispatch(actionCreators.setUserEmoji(emoji))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Survey)
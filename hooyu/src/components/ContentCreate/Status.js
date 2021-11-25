import React, {useRef, useState, useCallback} from 'react'
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, TextInput, Image, TouchableWithoutFeedback, LogBox } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import axios from 'axios'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/reducers'
import * as emojiImages from '../../assets/images'
import Toast from 'react-native-easy-toast'


const colorArray = ['#FFD0D0', '#CDD1FF', '#E8AFFE', '#CECECE', '#DEBACC', '#F9A996', '#FBF997']
const emojiArray = [
  ['smile', 'amazing', 'sad', 'crying', 'sense', 'angry'], 
  ['pouting', 'pokerface', 'love', 'sunglass', 'hard', 'sleep']
]


const Status = ({ navigation, setUserEmoji, SERVER_URL, userEmoji, deviceWidth, deviceHeight }) => {
  
  LogBox.ignoreAllLogs()
  
  const styles = styleSheet(deviceWidth)
  
  const [emoji, setEmoji] = useState(userEmoji)
  const [isEmojiSelect, setIsEmojiSelect] = useState(0)
  const [color, setColor] = useState('#FFD0D0')
  const [colorScrollX, setColorScrollX] = useState(0)
  const [status, setStatus] = useState('')
  
  const statusBackground = useRef()
  const colorScroll = useRef()
  const toastRef = useRef()

  const StatusTitle = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => setIsEmojiSelect(isEmojiSelect+1)}
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

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <StatusTitle {...props} />,
      headerRight: () => (
        <View>
          { status ? 
            <TouchableOpacity 
              style={{ padding: 10 }} 
              onPress={() => {
                createStatus()
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
  }, [navigation, status, color, emoji])

  const showToast = useCallback(() => {
    toastRef.current.show('상태를 입력해 주세요')
  })

  const onEndScroll = () => {
    colorScroll.current.scrollTo({ x : parseInt((colorScrollX+35)/70)*70 })
  }

  const onColorPress = (index) => {
    colorScroll.current.scrollTo({ x : index*70 })
  }

  const backgroundStyle = (color) => {
    return {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: color,
    }
  }

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

  const createStatus = () => {
    axios({
      method: 'post',
      url: SERVER_URL + 'content/create/status',
      data: {
        "color": color,
        "exon": status,
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
    <TouchableWithoutFeedback onPress={() => {setIsEmojiSelect(false)}}>
      <View style={backgroundStyle(color)} ref={statusBackground}>
        <View style={styles.foo}>
          <Text></Text>
        </View>
          <View style={styles.statusBox} >
            <TextInput 
              style={{ fontSize: 18, padding: 30, textAlign: 'center'}}
              placeholder={"상태를 입력해주세요"}
              onChangeText={(text) => setStatus(text)}
              multiline={true}
            />
          </View>
        <View style={styles.scrollViewBox} >
          <View style={styles.scrollViewInner}>
            <ScrollView 
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              onScroll = {(e) => {
                setColorScrollX(e.nativeEvent.contentOffset.x)
                setColor(colorArray[parseInt((colorScrollX+35)/70)])
              }}
              onScrollEndDrag={onEndScroll}
              ref={colorScroll}
            >
              <View style={styles.blankBox}></View>
              {
                colorArray.map((color, index) => (
                  <TouchableOpacity 
                    onPress={() => {onColorPress(index)}} 
                    key={index}
                  >
                    <LinearGradient
                      colors={colorArray[parseInt((colorScrollX+35)/70)] === color ? 
                        ["#AB79EF", "#FC98AB"] : ["white", "white"]}
                      style={{
                        width: colorArray[parseInt((colorScrollX+35)/70)] === color ? 
                        40 : 34,
                        height: colorArray[parseInt((colorScrollX+35)/70)] === color ? 
                        40 : 34,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: colorArray[parseInt((colorScrollX+35)/70)] === color ? 
                        15 : 18,
                        elevation: 4,
                        marginTop: colorArray[parseInt((colorScrollX+35)/70)] === color ? 
                        0 : 6
                      }}
                    >
                      <View
                        style={{ 
                          width: 34,
                          height: 34,
                          backgroundColor: color,
                        }}
                      ></View>
                    </LinearGradient>
                  </TouchableOpacity>
                  ))
                }
              <View style={styles.blankBox}></View>
            </ScrollView>
          </View>
        </View>
        { Boolean(isEmojiSelect%2) && 
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
      </View>
    </TouchableWithoutFeedback>
  )
}

const styleSheet = (deviceWidth) => StyleSheet.create({
  blankBox: {
    width: deviceWidth/2-65,
    height: 40,
    marginHorizontal: 15
  },
  colorBox: {
    width: 40,
    height: 40,
    borderColor: 'black',
    borderWidth: 2,
    marginHorizontal: 15
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
  emojiSelectRow: {
    flex: 1, 
    flexDirection: 'row',
    width: '100%', 
    height: 10
  },
  emojiSelectCol: {
    flex:1, 
    width: 10, 
    height: '100%',
    padding: 5
  },
  foo: {
    flex: 1,
  },
  mainView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#FFD0D0",
  },
  navEmojiSelect: {
    width: 34, 
    height: 34
  },
  navEmojiSelectText: { 
    marginLeft: 10, 
    color: '#aaa'
  },
  scrollViewBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scrollViewInner: {
    height: 40
  },
  statusBox: {
    flex: 3,
    justifyContent: "center",
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

export default connect(mapStateToProps, mapDispatchToProps)(Status)
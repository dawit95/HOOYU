import React, {useEffect, useRef, useState} from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Image, Animated, LogBox } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import axios from 'axios'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/reducers'
import * as emojiImages from '../../assets/images'
import { AntDesign } from "@expo/vector-icons"


const emojiArray = [
  'smile', 'amazing', 'sad', 'crying', 'sense', 'angry', 'pouting', 'pokerface', 'love', 'sunglass', 'hard', 'sleep'
]

const Emoji = ({ navigation, setUserEmoji, SERVER_URL, userEmoji, deviceWidth }) => {
  
  LogBox.ignoreAllLogs()

  const radius = deviceWidth * 1/3
  const emojiMoveLeft = [0, 0, radius*1/2, radius*Math.sqrt(3)/2, radius, radius*Math.sqrt(3)/2, radius*1/2, 0, -radius*1/2, -radius*Math.sqrt(3)/2, -radius, -radius*Math.sqrt(3)/2, -radius*1/2 ]
  const emojiMoveTop = [0, -radius, -radius*Math.sqrt(3)/2, -radius*1/2, 0, radius*1/2, radius*Math.sqrt(3)/2, radius, radius*Math.sqrt(3)/2, radius*1/2, 0, -radius*1/2, -radius*Math.sqrt(3)/2 ]
  
  const open = useRef(new Animated.Value(0)).current
  const floatValue = useRef(new Animated.Value(0)).current
  
  const [emoji, setEmoji] = useState(userEmoji)
  const [isEmojiSelect, setIsEmojiSelect] = useState(false)

  const range = (n) => {
    let arr = []
    for (let i = 0; i < n; i++) {
      arr.push(i/n)
    }
    arr.push(1)
    return arr
  }

  const toggleMenu = () => {
    Animated.timing(open, {
      toValue: isEmojiSelect ? 0 : 1,
      duration: 800,
      useNativeDriver: false,
    }).start()
    setIsEmojiSelect(!isEmojiSelect)
  }

  const floatUp = () => {
    Animated.timing(floatValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false
    }).start()
  }

  const floatDown = () => {
    Animated.timing(floatValue, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: false
    }).start()
  }

  const EmojiTitle = () => {
    return (
      <View></View>
    )
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <EmojiTitle {...props} />,
      headerRight: () => (
        <TouchableOpacity style={{ padding: 10 }} 
          onPress={() => {
            createEmoji()
            navigation.navigate('Main')
          }}
        >
          <Text>게시</Text>
        </TouchableOpacity>
      )
    })
    floatUp()
    floatValue.addListener(({value}) => {
      if (value == 1) {
        floatDown()
      } else if (value == 0) {
        floatUp()
      }
    })
  }, [navigation, emoji])

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

  return (
    <LinearGradient colors={["#AB79EF", "#FC98AB"]} style={styles.mainView}>
      <View style={styles.emojiSelect}>
        {
          emojiArray.map((emotion, index) => (
            <Animated.View 
              key={index} 
              style={['', {
                left: open.interpolate({
                  inputRange: range(index+1),
                  outputRange: emojiMoveLeft.slice(0, index+2)
                }),
                top: open.interpolate({
                  inputRange: range(index+1),
                  outputRange: emojiMoveTop.slice(0, index+2)
                })
              }]}
            >
              <TouchableOpacity
                style={styles.selectableEmoji}
                onPress={() => {
                  setIsEmojiSelect(false)
                  toggleMenu()
                  floatUp()
                  setEmoji(emojiArray[index])
                }}
              >
                <Image
                  source={emojiImages.default.emoji[emotion]}
                  style={styles.emojiDial}
                />
              </TouchableOpacity>
            </Animated.View>
          ))
        }
        {
          isEmojiSelect ?
          <TouchableOpacity
          style={styles.disableEmojiSelect}
          onPress={() => {
            setIsEmojiSelect(false)
            floatUp()
            toggleMenu()
          }}
          >
            <AntDesign name="close" size={30} color="#b4b4b4" />
          </TouchableOpacity>
          :
          <TouchableOpacity
          onPress={() => {
            setIsEmojiSelect(true)
            toggleMenu()
          }}
          style={styles.myEmojiButton}
          >
            <Animated.View 
              style={['', {
                top: floatValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [-3, 2, -3]
                })
              }]}
            >
              <Image
                source={emojiImages.default.emoji[emoji]}
                style={styles.myEmoji}
              />
            </Animated.View>
          </TouchableOpacity>
        }
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  disableEmojiSelect: {
    position: 'absolute',
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 60, 
    height: 60, 
    backgroundColor: '#eee', 
    borderRadius: 30, 
    elevation: 4
  },
  emojiDial: { 
    width: 50, 
    height: 50 
  },
  emojiSelect: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  mainView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myEmoji: { 
    width: 80, 
    height: 80 
  },
  myEmojiButton: {
    position: 'absolute',
    width: 80, 
    height: 80, 
    borderRadius: 40,
    elevation: 6,
  },
  selectableEmoji: { 
    position: 'absolute',
    width: 50, 
    height: 50, 
    left: -25,
    top: -25,
    elevation: 5,
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(Emoji)
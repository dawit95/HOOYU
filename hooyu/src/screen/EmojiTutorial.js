import React, { useState, useRef, useEffect } from 'react'
import { Animated, Dimensions, Text, TouchableOpacity, Image, View, StyleSheet, LogBox } from 'react-native'
import { actionCreators } from '../store/reducers'
import { connect } from 'react-redux'
import * as emojiImages from '../assets/images'
import { AntDesign } from "@expo/vector-icons"


const clientWidth = Dimensions.get('screen').width
const emojiArray = [
  'smile', 'amazing', 'sad', 'crying', 'sense', 'angry', 'pouting', 'pokerface', 'love', 'sunglass', 'hard', 'sleep'
]
const radius = clientWidth * 1/4
const emojiMoveLeft = [0, 0, radius*1/2, radius*Math.sqrt(3)/2, radius, radius*Math.sqrt(3)/2, radius*1/2, 0, -radius*1/2, -radius*Math.sqrt(3)/2, -radius, -radius*Math.sqrt(3)/2, -radius*1/2 ]
const emojiMoveTop = [0, -radius, -radius*Math.sqrt(3)/2, -radius*1/2, 0, radius*1/2, radius*Math.sqrt(3)/2, radius, radius*Math.sqrt(3)/2, radius*1/2, 0, -radius*1/2, -radius*Math.sqrt(3)/2 ]


const EmojiTutorial = ({ navigation: { navigate }, route, deviceWidth, deviceHeight, setUserEmoji}) => {

  LogBox.ignoreAllLogs()

  const styles = styleSheet(deviceWidth, deviceHeight)
  
  const open = useRef(new Animated.Value(0)).current
  const [emoji, setEmoji] = useState('smile')
  const [isEmojiSelect, setIsEmojiSelect] = useState(false)

  const floatValue = useRef(new Animated.Value(0)).current

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

  useEffect(() => {
    floatUp()
    floatValue.addListener(({value}) => {
      if (value == 1) {
        floatDown()
      } else if (value == 0) {
        floatUp()
      }
    })
  }, [emoji])


  const registerEmoji = () => {
    setUserEmoji(emoji)
    navigate('StatusTutorial', {...route.params, emoji: emoji})
  }

  return (
    <View>
      <View style={styles.emojiContainer}>
        <View 
          style={{
            width: deviceWidth * 0.8
          }}
        > 
          <Text 
            style={{
              color: '#0B1C26',
              fontSize: 22,
              fontWeight: 'bold',
            }}
          >
            지금의 감정은 무엇인가요?
          </Text>
        </View>
        <View
          style={styles.emojiSelect}
        >
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
                  style={{ width: 40, height: 40 }}
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
            toggleMenu()
            floatUp()
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
            style={styles.myEmoji}
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
                style={{ width: 80, height: 80 }}
                />
            </Animated.View>
          </TouchableOpacity>
        }
        </View>
      </View>
      <View style={styles.register__container}>
        <TouchableOpacity
          style={styles.register}
          onPress={() => registerEmoji()}
        >
          <Text
            style={styles.register__text}
          >
            등록
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styleSheet = (deviceWidth, deviceHeight) => StyleSheet.create({
  disableEmojiSelect: {
    width: 60, 
    height: 60, 
    backgroundColor: '#eee', 
    borderRadius: 30, 
    elevation: 4,
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute'
  },
  emojiContainer: {
    alignItems: 'center',
    marginTop: deviceHeight * 0.15,
  },
  emojiInput: {
    alignItems: 'center',
    borderBottomColor: '#0B1C26',
    height: deviceHeight * 0.5,
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: deviceWidth * 0.8,
  },
  emojiSelect: {
    height: deviceHeight * 0.5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myEmoji: {
    width: 80, 
    height: 80, 
    borderRadius: 40,
    position: 'absolute',
    elevation: 6,
  },
  register: {
    alignItems: 'center',
    backgroundColor: '#FF6A77',
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    marginTop: deviceHeight * 0.05,
    width: deviceWidth * 0.8,
  },
  register__container: {
    alignItems: 'center',
  },
  register__text: {
    color: 'white',
    fontSize: 15,
  },
  selectableEmoji: { 
    position: 'absolute',
    width: 40, 
    height: 40, 
    left: -25,
    top: -25,
    elevation: 5,
  }
})

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    deviceHeight: state.user.deviceHeight,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setUserEmoji: (emoji) => {
      dispatch(actionCreators.setUserEmoji(emoji))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmojiTutorial)
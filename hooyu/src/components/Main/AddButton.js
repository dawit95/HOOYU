import React, { useState, useRef } from 'react'
import { Animated, View, StyleSheet, Image, TouchableWithoutFeedback, __spread, LogBox } from 'react-native'
import { connect } from 'react-redux'
import { AntDesign } from "@expo/vector-icons"
import images from '../../assets/images'


const AddButton = ({ navigate, deviceWidth, deviceHeight, theme }) => {
  
  LogBox.ignoreAllLogs()
  
  const mainColor3 = theme == "morning" ? "#FDA604" : (theme == "evening" ? '#ED5646' : '#B4B4B4')
  const styles = styleSheet(deviceWidth, deviceHeight, mainColor3)
  
  const [isOpen, setIsOpened] = useState(false)

  const open = useRef(new Animated.Value(0)).current

  const toggleMenu = () => {
    Animated.timing(open, {
      toValue: isOpen ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start()
    setIsOpened(!isOpen)
  }

  return (
    <View
      style={styles.addButtonContainer}
    >
      <TouchableWithoutFeedback
        onPress={() => navigate('CreateContent', { emoji: images.emoji.amazing, menu: 0 })}
      >
        <Animated.View 
          style={[styles.addButtonEl, {
            left: open.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [deviceWidth * 0.43, deviceWidth * 0.1, deviceWidth * 0.28]
            }),
          }]}
        >
          <Image 
            style={{
              height: deviceWidth * 0.08,
              width: deviceWidth * 0.08,
            }}
            source={images.menu.emoji}
            resizeMode='contain' 
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => navigate('CreateContent', { emoji: images.emoji.amazing, menu: 1 })}
      >
        <Animated.View 
          style={[styles.addButtonEl, {
            left: open.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [deviceWidth * 0.43, deviceWidth * 0.1, deviceWidth * 0.44]
            }),
          }]}
        >
          <Image 
            style={{
              height: deviceWidth * 0.095,
              width: deviceWidth * 0.095,
            }}
            source={images.menu.status}
            resizeMode='contain' 
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => navigate('CreateContent', { emoji: images.emoji.amazing, menu: 2 })}
      >
        <Animated.View 
          style={[styles.addButtonEl, {
            left: open.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [deviceWidth * 0.43, deviceWidth * 0.1, deviceWidth * 0.6]
            }),
          }]}
        >
          <Image 
            style={{
              height: deviceWidth * 0.08,
              width: deviceWidth * 0.08,
            }}
            source={images.menu.image}
            resizeMode='contain' 
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => navigate('CreateContent', { emoji: images.emoji.amazing, menu: 3 })}
      >
        <Animated.View 
          style={[styles.addButtonEl, {
            left: open.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [deviceWidth * 0.43, deviceWidth * 0.1, deviceWidth * 0.76]
            }),
          }]}
        >
          <Image 
            style={{
              height: deviceWidth * 0.085,
              width: deviceWidth * 0.085,
            }}
            source={images.menu.question}
            resizeMode='contain' 
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => toggleMenu()}
      >
        <Animated.View 
          style={[styles.addButton,{
            left: open.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [deviceWidth * 0.43, deviceWidth * 0.1, deviceWidth * 0.1]
            }),
            transform: [
              {
                rotate: open.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "45deg"]
                })
              }
            ]
          }]}
        >
          <AntDesign name="plus" size={24} color="#fff" />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styleSheet = (deviceWidth, deviceHeight, mainColor3) => StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: mainColor3,
    borderRadius: 35,
    elevation: 4,
    height: deviceWidth * 0.14,
    justifyContent: 'center',
    marginTop: deviceHeight * 0.13,
    width: deviceWidth * 0.14,
    top: -deviceWidth * 0.01,
    position: 'absolute'
  },
  addButtonContainer: {
    alignItems: 'center',
    flex: 0.25,
  },
  addButtonEl: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 35,
    elevation: 4,
    height: deviceWidth * 0.12,
    justifyContent: 'center',
    marginTop: deviceHeight * 0.13,
    width: deviceWidth * 0.12,
    position: 'absolute'
  },
})

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    deviceHeight: state.user.deviceHeight,
  }
}

export default connect(mapStateToProps)(AddButton)
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import { Animated, View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView, LogBox } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import images from '../../assets/images'


const MainList = forwardRef(({ deviceWidth, deviceHeight, theme, users, selectUser, selectedUser, setUsers, mainListSortMode, setMainListSortMode }, ref) => {
  
  LogBox.ignoreAllLogs()
  
  const navigation = useNavigation()

  const [now, setNow] = useState(new Date().toString())

  const mainList = useRef(new Animated.Value(deviceHeight)).current
  const isInitialMount = useRef(true)

  useEffect(() => {
    sortByDistance()
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      const node = scrollRef.current
      node.scrollTo({ y: (deviceWidth * 0.07 + 22) *  selectedUser, animated: true})
    }
  }, [selectedUser])

  useImperativeHandle(ref, () => ({
    open: () => {
      const now = new Date()
      setNow(now.toString())
      Animated.timing(mainList, {
        toValue: deviceHeight * 0.6,
        duration: 400,
        useNativeDriver: false,
      }).start()
    },
    close: () => {
      selectUser(-1)
      Animated.timing(mainList, {
        toValue: deviceHeight,
        duration: 400,
        useNativeDriver: false,
      }).start()
    }
  }))

  const mainColor1 = theme == "morning" ? "#57B4DF" : (theme == "evening" ? '#EC5446' : '#0B1C26')
  const mainColor4 = theme == "morning" ? "#E7F7FF" : (theme == "evening" ? '#FCE2E0' : '#E9E9E9')

  const styles = styleSheet(deviceWidth, deviceHeight, mainColor1, mainColor4)

  const humanize = (date) => {
    if (date === null) {
      return "게시물 없음"
    }
    let r = Date.parse(now) - Date.parse(date) + 32400000
    if (parseInt(r) > 2678400000) {
      r = "1달 이전 게시"
    } else if (parseInt(r) > 86400000) {
      r = parseInt(parseInt(r) / 86400000).toString() + "일 전 게시"
    } else if (parseInt(r) >= 3600000) {
      r = parseInt(parseInt(r) / 3600000).toString() + "시간 전 게시"
    } else if (parseInt(r) >= 60000) {
      r = parseInt(parseInt(r) / 60000).toString() + "분 전 게시"
    } else {
      r = "방금 전 게시"
    }
    return r
  }

  const isNewContent = (date) => {
    if (date != null) {
      let r = Date.parse(now) - Date.parse(date) + 32400000
      if (parseInt(r) <= 86400000) {
        return true
      }
    } 
    return false
  }

  const sortByDistance = () => {
    const newUsers = [...users]
    newUsers.sort(function(a, b) {
      return a.distDto.dist - b.distDto.dist
    })
    setUsers(newUsers)
    setMainListSortMode('distance')
    selectUser(-1)
  }

  const sortByTime = () => {
    const newUsers = [...users]
    newUsers.sort(function(a, b) {
      return Date.parse(b.contentTime.recent) - Date.parse(a.contentTime.recent)
    })
    setUsers(newUsers)
    setMainListSortMode('time')
    selectUser(-1)
  }

  const scrollRef = useRef()
  
  return (
    <Animated.View style={{ top: mainList }}>
      <View style={styles.mainList}>
        <View style={styles.mainListHeader}>
          <TouchableWithoutFeedback 
            onPress={() => sortByDistance()}
          >
            <View style={styles.mainListHeaderOption}>
              <Text style={[styles.mainListHeaderOptionText, {color: mainListSortMode === 'distance' ? 'black': '#B4B4B4'}]}>
                거리순
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback 
            onPress={() => sortByTime()}
          >
            <View style={styles.mainListHeaderOption}>
              <Text style={[styles.mainListHeaderOptionText, {color: mainListSortMode === 'time' ? 'black': '#B4B4B4'}]}>
                최신순
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ScrollView ref={scrollRef}>
          {users.map((user, index) => (
            <View
              key={index}
              style={{
                borderBottomColor: mainColor4,
                borderBottomWidth: 2,
              }}
            >
              <TouchableWithoutFeedback  
                onPress={() => selectUser(index)}
              >
                <View style={styles.user}>
                  <View 
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row'
                    }}
                  >
                    <Image
                      style={styles.mainListEmoji}
                      source={images.emoji[user.emoji]}
                      resizeMode="contain"
                    />
                    <Text style={styles.userText}>
                      {user.name}
                    </Text>
                  </View>
                    <Text style={styles.userText}>
                      {humanize(user.contentTime.recent)}
                    </Text>
                </View>
              </TouchableWithoutFeedback>
              {index == selectedUser && 
                <View style={styles.userMenu}>
                  <LinearGradient 
                    colors={['#AB79EF', '#FC98AB']}
                    style={{
                      alignItems: 'center',
                      borderRadius: 9.5,
                      justifyContent: 'center',
                      padding: isNewContent(user.contentTime.status) ? 2.5 : 0,
                    }}
                  >
                    <TouchableOpacity
                      style={styles.userMenuButton}
                      onPress={() => {navigation.navigate('Profile', {nickname: user.name, content: 'status', emoji: user.emoji})}}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        상태
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                  <LinearGradient 
                    colors={['#AB79EF', '#FC98AB']}
                    style={{
                      alignItems: 'center',
                      borderRadius: 9.5,
                      justifyContent: 'center',
                      padding: isNewContent(user.contentTime.images) ? 2.5 : 0,
                    }}
                  >
                    <TouchableOpacity
                      style={[styles.userMenuButton, {backgroundColor: user.contentTime.images === null ? '#B4B4B4' : mainColor1}]}
                      onPress={() => {navigation.navigate('Profile', {nickname: user.name, content: 'image', emoji: user.emoji})}}
                      disabled={user.contentTime.images === null ? true : false}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        사진
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                  <LinearGradient 
                    colors={['#AB79EF', '#FC98AB']}
                    style={{
                      alignItems: 'center',
                      borderRadius: 9.5,
                      justifyContent: 'center',
                      padding: isNewContent(user.contentTime.survey) ? 2.5 : 0,
                    }}
                  >
                    <TouchableOpacity
                      style={[styles.userMenuButton, {backgroundColor: user.contentTime.survey === null ? '#B4B4B4' : mainColor1}]}
                      onPress={() => {navigation.navigate('Profile', {nickname: user.name, content: 'survey', emoji: user.emoji})}}
                      disabled={user.contentTime.survey === null ? true : false}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        질문
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              }
            </View>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  )
})

const styleSheet = (deviceWidth, deviceHeight, mainColor1, mainColor4) => StyleSheet.create({
  mainList: {
    position: 'absolute',
    width: '100%',
    height: deviceHeight * 0.4,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 11,
  },
  mainListEmoji: {
    height: deviceWidth * 0.07,
    marginRight: 10,
    width: deviceWidth * 0.07,
  },
  mainListHeader: {
    alignItems: 'center',
    borderBottomColor: mainColor4,
    borderBottomWidth: 3,
    flexDirection: 'row',
    height: deviceHeight * 0.05,
    justifyContent: 'flex-end',
  },
  mainListHeaderOption: {
    paddingRight: 20,
  },
  mainListHeaderOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  user: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
  },
  userMenu: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 70,
    paddingTop: 5,
    width: '100%'
  },
  userMenuButton: {
    alignItems: 'center',
    backgroundColor: mainColor1,
    borderRadius: 7,
    paddingVertical: 3,
    width: deviceWidth * 0.17,
  },
  userText: {
    fontWeight: 'bold',
  },
})

export default MainList
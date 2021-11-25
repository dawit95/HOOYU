import React, { useEffect, useRef, useState } from 'react'
import { Text, Image, View, TouchableOpacity, ScrollView, LogBox } from 'react-native'
import { connect } from 'react-redux'
import { actionCreators } from '../store/reducers'
import * as emojiImages from '../assets/images'
import ImageContent from '../components/ImageContent'
import StatusContent from '../components/StatusContent'
import SurveyContent from '../components/SurveyContent'
import images from '../assets/images'
  

const ProfileScreen = ({ navigation, route, userName, userEmoji, deviceWidth }) => {
  LogBox.ignoreAllLogs()

  const [ownerName, setOwnerName] = useState(route.params.nickname === userName ? userName : route.params.nickname)
  const [isStatus, setIsStatus] = useState(true)
  const [isImage, setIsImage] = useState(true)
  const [isSurvey, setIsSurvey] = useState(true)
  
  const scrollRef = useRef()

  const moveTo = [
    {
      status: 0,
      image: 0,
      survey: 0,
    },
    {
      status: 0,
      image: 50 + deviceWidth + 40 + 40 + 10,
      survey: 50 + deviceWidth + 40 + 40 + 10,
    },
    {
      status: 0,
      image: 50 + deviceWidth + 40 + 40 + 10,
      survey: (50 + deviceWidth + 40 + 40 + 10)*2,
    },
  ]

  const getPointToScroll = () => {
    const checkList = isImage + isSurvey
    setTimeout(() => {
      const node = scrollRef.current
      node.scrollTo({ y: moveTo[checkList][route.params.content], animated: true })
    }, 400)
  }

  const ProfileTitle = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          style={{ width: 34, height: 34 }}
          source={ownerName === userName ? emojiImages.default.emoji[userEmoji] : emojiImages.default.emoji[route.params.emoji]}
        />
        <Text style={{ marginLeft: 10 }}>{ownerName}</Text>
      </View>
    )
  }

  useEffect(() => {
    getPointToScroll()
    navigation.setOptions({
      headerTitle: (props) => <ProfileTitle {...props} />,
      headerRight: () => (
        (ownerName === userName && (
          <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('Setting')}>
            <Text>설정</Text>
          </TouchableOpacity>
        )))
    })
  }, [navigation])

  return (
    <>
      <ScrollView
        style={{backgroundColor: '#D7D7D7'}}
        ref={scrollRef}
      >
        {isStatus 
        ? 
        (
          <>
            <StatusContent 
              ownerName={ownerName}
              setIsStatus={setIsStatus}
            />
          </>
        )
        : 
        (
          <>
          <View
            style={{
              width: deviceWidth,
              height: 50,
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 13,
              paddingRight: 20,
              alignItems: 'center',
              elevation: 10,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Image 
                style={{
                  height: deviceWidth * 0.075,
                  width: deviceWidth * 0.075,
                }}
                source={images.menu.status}
                resizeMode='contain' />
              <Text style={{ fontSize: 15 }}>상태 메시지</Text>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#FF6A77',
              height: deviceWidth,
              justifyContent: 'center',
              width: deviceWidth,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold'
              }}
            >
              남긴 상태 메시지가 없습니다.
            </Text>
          </View>
          <View 
            style={{
              alignItems:'center',
              backgroundColor: 'white',
              flexDirection: 'row', 
              height: 40,
              paddingLeft: 10
            }}
          >
            <Image 
              style={{
                height: 22,
                width: 22,
              }}
              source={images.emoji.sad}
            />
          </View>
          <View 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 40,
              backgroundColor: 'white',
              elevation: 10 
            }}
          >
            <Text
              style={{
                fontSize: 15,
                marginLeft: 15,
              }}
            >
              공감...은 나중에
            </Text>
          </View>
          <View style={{ height: 10, backgroundColor: "#D7D7D7"}}></View>
          </>
        )}
        {isImage && (
          <>
            <ImageContent 
              ownerName={ownerName}
              setIsImage={setIsImage}
            />
          </>
        )}
        {isSurvey && (
          <>
            <SurveyContent 
              ownerName={ownerName}
              setIsSurvey={setIsSurvey}
            />
          </>
        )}
        {!isImage && !isSurvey && (
          <>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: 'white',
                elevation: 3,
                height: 160,
                justifyContent: 'center',
                width: deviceWidth,
              }}
            >
              <Image
                resizeMode='contain'
                source={ images.profileLogo }
                style={{
                  width: deviceWidth * 0.7
                }}
              />
            </View>
            <View style={{ height: 10, backgroundColor: "#D7D7D7"}}></View>
          </>
        )}
      </ScrollView>
    </>
  )
}

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    deviceHeight: state.user.deviceHeight,
    userName: state.user.userName,
    userEmoji: state.user.userEmoji,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setUserName: (emoji) => {
      dispatch(actionCreators.setUserName(emoji))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
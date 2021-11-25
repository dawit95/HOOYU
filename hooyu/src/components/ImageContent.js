import React, { useEffect, useState, useRef } from 'react'
import { Image, Text, View, TouchableOpacity, TouchableWithoutFeedback, LogBox } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import LinearGradient from 'react-native-linear-gradient'
import Api from '../utils/api'
import { connect } from 'react-redux'
import * as emojiImages from '../assets/images'
import images from '../assets/images'
import DeleteModal from '../components/modal/deleteModal'
import ReportModal from '../components/modal/reportModal'


const emojiArray = ['like', 'smile', 'love', 'amazing', 'sad', 'angry']

const ImageContent = ({ ownerName, userPK, userName, deviceWidth, setIsImage }) => {
  
  LogBox.ignoreAllLogs()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isEmojiSelect, setIsEmojiSelect] = useState(false)
  const [imageData, setImageData] = useState([])
  const [isEmotions, setEmotions] = useState(false)
  const [giveEmotion, setGiveEmotion] = useState('')
  const [imageEmoji, setImageEmoji] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteModalContent, setDeleteModalContent] = useState(null)
  const [isReportModalVisible, setReportModalVisible] = useState(false)
  const [reportModalContent, setReportModalContent] = useState(null)
  
  const swiperFlatList = useRef()

  const now = new Date()
  
  useEffect(() => {
    Api.getUserImage(ownerName)
      .then((res) => {
        if (res.data.success.length === 0) {
          setIsImage(false)
        } else {
          let data = res.data.success
          getEmotion(data[0].contentPk)
          setImageData(data)
        }
      })
      .catch((err) => {
      console.log(err)
      })
  }, [])

  const deleteToggleModal = () => {
    setDeleteModalContent(imageData[currentIndex].contentPk)
    setDeleteModalVisible(!isDeleteModalVisible)
  }

  const reportToggleModal = () => {
    setReportModalContent(imageData[currentIndex].contentPk)
    setReportModalVisible(!isReportModalVisible)
  }

  const getEmotion = (contentPK) => {
    Api.getContentEmotion(contentPK)
      .then((result) => {
        let chk = false
        let isMe = ''
        let emojis = {
          'like': 0,
          'smile': 0,
          'love': 0,
          'amazing': 0,
          'sad': 0,
          'angry': 0
        }
        for (let emojiData of result.data.success) {
          if (emojiData.userPK === userPK) {
            isMe = emojiData.contentEmoji
          }
          emojis[emojiData.contentEmoji]++
          chk = true
        }
        
        for (const key in emojis) {
          if (emojis[key] === 0) {
            delete emojis[key]
          }
        }

        setImageEmoji(emojis)
        setEmotions(chk)
        setGiveEmotion(isMe)
        setIsLoaded(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const addEmotion = (emoji, contentId) => {
    Api.setContentEmotion(emoji, contentId)
      .then(() => {
        getEmotion(contentId)
      })  
      .catch((err) => {
        console.log(err)
      })
  }

  const deleteEmotion = () => {
    Api.setContentEmotion(giveEmotion, imageData[currentIndex].contentPk)
      .then(() => {
        getEmotion(imageData[currentIndex].contentPk)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const humanize = (date) => {
    const moment = require("moment")
    let r = Date.parse(now) - Date.parse(date) + 32400000
    if (parseInt(r) > 2678400000) {
      r = moment(date).format("YYYY.MM.DD")
    } else if (parseInt(r) > 86400000) {
      r = parseInt(parseInt(r) / 86400000).toString() + "일 전"
    } else if (parseInt(r) >= 3600000) {
      r = parseInt(parseInt(r) / 3600000).toString() + "시간 전"
    } else if (parseInt(r) >= 60000) {
      r = parseInt(parseInt(r) / 60000).toString() + "분 전"
    } else {
      r = "방금 전"
    }
    return r
  }

  const convertCount = (cnt) => {
    if (cnt > 1000000) {
      const convert = cnt / 1000000
      return convert.toFixed(1) + 'M'
    } else if (cnt > 1000) {
      const convert = cnt / 1000
      return convert.toFixed(1) + 'K'
    } else {
      return cnt
    }
  }

  const reRenderImage = () => {
    Api.getUserImage(ownerName)
      .then((res) => {
        if (res.data.success.length === 0) {
          setIsImage(false)
        } else {
          let data = res.data.success
          getEmotion(currentIndex === data.length ? data[currentIndex - 1].contentPk : data[currentIndex].contentPk)
          if (currentIndex === data.length) {
            setCurrentIndex(currentIndex - 1)
          }
          setImageData(data)
          swiperFlatList.current.scrollToIndex({ index: currentIndex === 0 ? currentIndex : currentIndex - 1 })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <View>
      <View style={{ flex: 1 }}>
        <DeleteModal
          contentPK={deleteModalContent}
          isModalVisible={isDeleteModalVisible}
          setModalVisible={setDeleteModalVisible}
          reRender={reRenderImage}
        />
        <ReportModal
          contentPK={reportModalContent}
          isModalVisible={isReportModalVisible}
          setModalVisible={setReportModalVisible}
        />
      </View>
      <View
        style={{
          width: deviceWidth,
          height: 50,
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: 20,
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
              height: deviceWidth * 0.06,
              width: deviceWidth * 0.06,
              marginRight: 7,
            }}
            source={images.menu.image}
            resizeMode='contain' />
          <Text>사진</Text>
        </View>
        <TouchableOpacity onPress={ownerName === userName ? deleteToggleModal : reportToggleModal}>
          <AntDesign name={ownerName === userName ? "close" : "exclamationcircle"} size={18} color={ownerName === userName ? "black" : "#FF6A77"} />
        </TouchableOpacity>
      </View>
      <SwiperFlatList
        ref={swiperFlatList}
        data={imageData}
        onChangeIndex={({ index }) => {
          setCurrentIndex(index)
          setIsEmojiSelect(false)
          getEmotion(imageData[index].contentPk)
        }}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => {setIsEmojiSelect(false)}}>
            <View
              key={item.contentPk}
              style={{
                width: deviceWidth,
                height: deviceWidth,
                flex: 1,
                justifyContent: 'center',
                alignItems:"center"
              }}
            >
              <Image source={{ uri: item.exon }} style={{ width: '100%', height: '100%' }} />
            </View>
          </TouchableWithoutFeedback>
        )}
      />
      <TouchableWithoutFeedback onPress={() => {setIsEmojiSelect(false)}}>
        <View style={{flexDirection: 'row', height: 40, backgroundColor: 'white'}}>
          <View style={{flexDirection: 'row', alignItems:'center', marginLeft: 10}}>
            {!isEmotions &&
              <View>
                <Text
                  style={{
                    color: '#B4B4B4'
                  }}
                >
                  첫 공감을 남겨보세요
                </Text>
              </View>}
            {isEmotions && Object.keys(imageEmoji).map((item, index) => (
              <View key={index} style={{flexDirection: 'row', alignItems:'center', marginLeft: 10}}>
                <Image
                  style={{ width: 22, height: 22, marginRight: 5 }}
                  source={emojiImages.default.emoji[item]}
                />
                <Text style={{ fontSize: 12 }}>
                  {convertCount(imageEmoji[item])}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
      { isEmojiSelect && 
        <View style={{
          position: 'absolute',
          width: 300,
          height: 70,
          borderRadius: 10,
          backgroundColor: 'white',
          elevation: 2,
          left: 50,
          bottom: 55,
          paddingLeft: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          {emojiArray.map((emotion, index) => (
            <TouchableOpacity
              key={index}
              style={{
                elevation: 10,
                flex: 1,
                height: 35,
              }}
              onPress={() => {
                setIsEmojiSelect(false)
                addEmotion(emotion, imageData[currentIndex].contentPk)
              }}
            >
              <Image
                resizeMode="cover"
                source={emojiImages.default.emoji[emotion]}
                style={{ width: 35, height: 35 }}
              />
            </TouchableOpacity>
          ))}     
        </View>
      }
      <TouchableWithoutFeedback onPress={() => {setIsEmojiSelect(false)}}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 40,
          backgroundColor: 'white',
          elevation: 3 
        }}>
          {isLoaded && giveEmotion === '' &&
            <TouchableOpacity 
              style={{ 
                alignItems: 'center',
                flexDirection: 'row', 
                marginLeft: 15, 
                marginRight: 15 
              }}
              onPress={() => setIsEmojiSelect(!isEmojiSelect)}
            > 
              <Image source={images.sympathy} style={{ width: 20, height: 20, marginRight: 2, top: 1 }} />
              <Text style={{ fontSize: 15 }}>{isEmojiSelect ? '닫기': '공감'}</Text>
            </TouchableOpacity>
          }
          {isLoaded && giveEmotion !== '' && 
            <>
              <TouchableOpacity
                onPress={() => deleteEmotion()}
              >
                <LinearGradient 
                  colors={['#AB79EF', '#FC98AB']}
                  style={{
                    alignItems: 'center',
                    borderRadius: 20,
                    justifyContent: 'center',
                    marginLeft: 15,
                    marginRight: 15,
                    padding: 2,
                  }}
                >
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={emojiImages.default.emoji[giveEmotion]}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </>
          }
          {imageData.length !== 0
          ?
            <Text
              style={{
                color: '#B4B4B4',
                fontSize: 12,
              }}
            >
              {humanize(imageData[currentIndex].createAt)}
            </Text>
          :
            <>
            </>
          }
        </View>
      </TouchableWithoutFeedback>
      <View style={{ height: 10, backgroundColor: "#D7D7D7"}}></View>
    </View>
  )
}

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    userName: state.user.userName,
    userPK: state.user.userPK
  }
}

export default connect(mapStateToProps)(ImageContent)
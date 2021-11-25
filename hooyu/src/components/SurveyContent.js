import React, { useEffect, useState, useRef } from 'react'
import { Image, Text, View, TouchableOpacity, TouchableWithoutFeedback, LogBox } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import LinearGradient from 'react-native-linear-gradient'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import Api from '../utils/api'
import { connect } from 'react-redux'
import * as emojiImages from '../assets/images'
import images from '../assets/images'
import DeleteModal from '../components/modal/deleteModal'
import ReportModal from '../components/modal/reportModal'


const emojiArray = ['like', 'smile', 'love', 'amazing', 'sad', 'angry']

const SurveyContent = ({ ownerName, userPK, userName, deviceWidth, setIsSurvey }) => {

  LogBox.ignoreAllLogs()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isEmojiSelect, setIsEmojiSelect] = useState(false)
  const [surveyData, setSurveyData] = useState([])
  const [isEmotions, setEmotions] = useState(false)
  const [giveEmotion, setGiveEmotion] = useState('')
  const [surveyEmoji, setSurveyEmoji] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteModalContent, setDeleteModalContent] = useState(null)
  const [isReportModalVisible, setReportModalVisible] = useState(false)
  const [reportModalContent, setReportModalContent] = useState(null)
  
  const now = new Date()

  useEffect(() => {
    updateSurveyData()
  }, [])

  const updateSurveyData = () => {
    Api.getUserSurvey(ownerName)
      .then((res) => {
        let data = res.data.success
        if (data.length === 0) {
          setIsSurvey(false)
        } else {
          getEmotion(data[currentIndex].contentPK)
        }
        setSurveyData(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const deleteToggleModal = () => {
    setDeleteModalContent(surveyData[currentIndex].contentPK)
    setDeleteModalVisible(!isDeleteModalVisible)
  }

  const reportToggleModal = () => {
    setReportModalContent(surveyData[currentIndex].contentPK)
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

        setSurveyEmoji(emojis)
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
    Api.setContentEmotion(giveEmotion, surveyData[currentIndex].contentPK)
      .then(() => {
        getEmotion(surveyData[currentIndex].contentPK)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const voteToSurvey = (answerPK, contentPK) => {
    Api.voteSurvey(answerPK, contentPK)
      .then(() => {
        updateSurveyData()
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

  const swiperFlatList = useRef()

  const reRenderSurvey = () => {
    Api.getUserSurvey(ownerName)
      .then((res) => {
        let data = res.data.success
        if (data.length === 0) {
          setIsSurvey(false)
        } else {
          getEmotion(currentIndex === data.length ? data[currentIndex - 1].contentPK : data[currentIndex].contentPK)
          if (currentIndex === data.length) {
            setCurrentIndex(currentIndex - 1)
          }
        }
        setSurveyData(data)
        swiperFlatList.current.scrollToIndex({ index: currentIndex === 0 ? currentIndex : currentIndex - 1 })
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
          reRender={reRenderSurvey}
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
          paddingLeft: 17,
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
              marginRight: 5,
            }}
            source={images.menu.question}
            resizeMode='contain' />
          <Text>질문</Text>
        </View>
        <TouchableOpacity onPress={ownerName === userName ? deleteToggleModal : reportToggleModal}>
          <AntDesign name={ownerName === userName ? "close" : "exclamationcircle"} size={18} color={ownerName === userName ? "black" : "#FF6A77"} />
        </TouchableOpacity>
      </View>
      <SwiperFlatList
        ref={swiperFlatList}
        data={surveyData}
        onChangeIndex={({ index }) => {
          setCurrentIndex(index)
          setIsEmojiSelect(false)
          getEmotion(surveyData[index].contentPK)
        }}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => {setIsEmojiSelect(false)}}>
            <View
              key={item.contentPK}
              style={{
                width: deviceWidth,
                height: deviceWidth,
                backgroundColor: '#0B1C26',
                flex: 1,
                justifyContent: 'center',
                alignItems:"center"
              }}
            >
              {(ownerName === userName || item.myVote !== '') &&
                <>
                  <Text style={{color: 'white', fontSize: 20, opacity: 0.8, marginBottom: 50, paddingHorizontal: 20, textAlign: 'center'}}>{item.exon}</Text>
                  {item.answerList.map((ans, idx) => {
                    const total = Object.values(item.count).reduce((a, b) => a + b)
                    const num = Number.isNaN(Math.round(item.count[ans]/total*100)) ? 0 : Math.round(item.count[ans]/total*100)
                    return (
                      <LinearGradient colors={["#AB79EF", "#FC98AB"]}
                        key={item.answerPK[ans]}
                        style={{
                          alignItems: 'center',
                          borderRadius: 3,
                          justifyContent: 'center',
                          marginTop: 7,
                          padding: ownerName === userName || item.myVote === ans ? 1 : 0
                        }}
                      >
                        <View 
                          style={{
                            width: deviceWidth * 0.75,
                            height: 40,
                            backgroundColor: '#0B1C26',
                            borderColor: 'white',
                            borderRadius: 3,
                            borderWidth: ownerName === userName || item.myVote === ans ? 0 : 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                         }}
                        >
                          <Text 
                            style={{
                              zIndex: 1, 
                              height: '100%', 
                              fontSize: 16, 
                              textAlignVertical: 
                              'center', paddingLeft: 5, 
                              color: 'rgba(255, 255, 255, 0.8)'
                            }}
                            onChangeText={(text) => onTextChange(0, text)}
                          >
                            {ans}
                          </Text>
                          <Text 
                            style={{
                              zIndex: 1, 
                              height: '100%', 
                              fontSize: 16, 
                              textAlignVertical: 
                              'center', 
                              paddingLeft: 5, 
                              color: 'rgba(255, 255, 255, 0.8)'
                            }}
                            onChangeText={(text) => onTextChange(0, text)}
                          >
                            {num + "%"}
                          </Text>
                          <LinearGradient colors={[ownerName === userName || item.myVote === ans ? "#AB79EF" : "#B4B4B4", ownerName === userName || item.myVote === ans ? "#FC98AB" : "#FFFFFF"]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                            width: deviceWidth * 0.75 * num / 100 - (ownerName === userName || item.myVote === ans ? 0 : 2),
                            position: 'absolute',
                            opacity: ownerName === userName || item.myVote === ans ? 0.8 : 0.5,
                            top: 0,
                            left: 0,
                            bottom: 0,
                          }}>
                          </LinearGradient>
                        </View>
                      </LinearGradient>
                    )})}
                </>
              }
              {(ownerName !== userName && item.myVote === '') &&
                <>
                  <Text style={{ color: 'white', fontSize: 20, opacity: 0.8, marginBottom: 50, paddingHorizontal: 20, textAlign: 'center' }}>{item.exon}</Text>
                  {item.answerList.map((ans, idx) => {
                    const total = Object.values(item.count).reduce((a, b) => a + b)
                    const num = Number.isNaN(Math.round(item.count[ans]/total*100)) ? 0 : Math.round(item.count[ans]/total*100)
                    return (
                      <TouchableWithoutFeedback
                        key={item.answerPK[ans]} 
                        onPress={() => {
                          voteToSurvey(surveyData[currentIndex].answerPK[ans], surveyData[currentIndex].contentPK)
                        }}
                      >
                        <View style={{
                          width: deviceWidth * 0.75,
                          height: 40,
                          backgroundColor: '#0B1C26',
                          borderColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 3,
                          borderWidth: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 7,
                          paddingHorizontal: 10,
                        }}>
                          <Text style={{zIndex: 1, height: '100%', fontSize: 16, textAlignVertical: 'center', paddingLeft: 5, color: 'rgba(255, 255, 255, 0.8)'}}
                            onChangeText={(text) => onTextChange(0, text)}
                          >{ans}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    )})}
                </>
              }
              <View style={{justifyContent: 'flex-start', width: '75%'}}>
                <Text style={{ color: 'white', fontSize: 13, opacity: 0.7, marginLeft: 8, marginTop: 15 }}>
                  {Object.values(item.count).reduce((a, b) => a + b) + '명 참여중'}
                </Text>
              </View>
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
            {isEmotions && Object.keys(surveyEmoji).map((item, index) => (
              <View key={index} style={{flexDirection: 'row', alignItems:'center', marginLeft: 10}}>
                <Image
                  style={{ width: 24, height: 24, marginRight: 5 }}
                  source={emojiImages.default.emoji[item]}
                  />
                <Text>{convertCount(surveyEmoji[item])}</Text>
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
                addEmotion(emotion, surveyData[currentIndex].contentPK)
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
          {surveyData.length !== 0
          ?
            <Text
              style={{
                color: '#B4B4B4',
                fontSize: 12,
              }}
            >
              {humanize(surveyData[currentIndex].createAt)}
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
    deviceHeight: state.user.deviceHeight,
    userPK: state.user.userPK,
    userName: state.user.userName,
  }
}

export default connect(mapStateToProps)(SurveyContent)
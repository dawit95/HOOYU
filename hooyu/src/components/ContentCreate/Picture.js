import React, {useRef, useState, useCallback} from 'react'
import { Text, TouchableOpacity, View, Animated, StyleSheet, PermissionsAndroid, Image, LogBox } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import imageUpload from '../../assets/createcontent/uploadImage.png'
import * as ImagePicker from 'react-native-image-picker'
import axios from 'axios'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/reducers'
import * as emojiImages from '../../assets/images'
import Toast from 'react-native-easy-toast'

const emojiArray = [
  ['smile', 'amazing', 'sad', 'crying', 'sense', 'angry'], 
  ['pouting', 'pokerface', 'love', 'sunglass', 'hard', 'sleep']
]

const Picture = ({ navigation, setUserEmoji, SERVER_URL, userEmoji, deviceWidth, deviceHeight }) => {
  LogBox.ignoreAllLogs()

  const [isEmojiSelect, setIsEmojiSelect] = useState(false)
  const [emoji, setEmoji] = useState(userEmoji)
  const [imageFile, setImageFile] = useState('')

  const floatValue = useRef(new Animated.Value(0)).current
  const toastRef = useRef()

  const PictureTitle = () => {
    return (
      <View 
        style={{
          flexDirection: 'row', 
          alignItems: 'center'
        }}
      >
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

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <PictureTitle {...props} />,
      headerRight: () => (
        <View>
          { imageFile ? 
            <TouchableOpacity 
              style={{ padding: 10 }} 
              onPress={() => {
                createPicture()
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
    floatUp()
    floatValue.addListener(({value}) => {
      if (value == 1) {
        floatDown()
      } else if (value == 0) {
        floatUp()
      }
    })
  }, [navigation, emoji, imageFile])

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

  const showToast = useCallback(() => {
    toastRef.current.show('사진을 선택해 주세요')
  })

  const imageGalleryLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo'
    }
  
    ImagePicker.launchImageLibrary(options, (res) => {
      if (!res.didCancel && !res.error && !res.customButton) {
        setImageFile(res.assets[0])
      }
    })
  }  

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        '서비스 이용 알림',
        '안드로이드에서만 지원됩니다.',
        [{text: '확인'}]
      )
    }

    if (Platform.OS === 'android') {
      const galleryGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      )
      if (
        galleryGranted === PermissionsAndroid.RESULTS.GRANTED
      ) {
        imageGalleryLaunch()
      } else {
        Alert.alert(
          '서비스 이용 알림',
          '갤러리 접근 권한을 얻지 못했습니다.',
          [{text: '확인'}]
        )
      }
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

  const createPicture = () => {
    const formData = new FormData()

    formData.append('upload', {
      uri: imageFile.uri,
      type: imageFile.type,
      name: imageFile.fileName
    })

    axios({
      method: 'post',
      url: 'content/upload',
      data: formData
    })
    .then((res) => {
      savePicture(res.data.success)
      createEmoji()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const savePicture = (uri) => {
    axios({
      method: 'post',
      url: SERVER_URL + 'content/create/image',
      data: {
        color: '',
        exon: uri,
      }
    })
  }

  return (
    <LinearGradient colors={["#AB79EF", "#FC98AB"]} style={styles.mainView}>
      <TouchableWithoutFeedback onPress={() => {setIsEmojiSelect(false)}} style={{flex: 1}}>
        <View style={{width: deviceWidth, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {
            imageFile ? 
            <View>
              <View style={{ elevation: 15}}>
                <Image
                  style={{ width: deviceWidth-80, height: deviceWidth-80 }}
                  source={{ uri: imageFile.uri }}
                />
              </View>
              <TouchableOpacity 
                style={{
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginTop: 50
                }} 
                onPress={() => imageGalleryLaunch()}
              >
                <View 
                  style={{ 
                    borderColor: 'red',
                    elevation: 4,
                    width: 200, 
                    height: 40, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    borderRadius: 10,
                    backgroundColor: 'crimson'
                  }}
                >
                  <Text style={{ textAlign: 'center', color: 'white' }}>Select Another Photo</Text>
                </View>
              </TouchableOpacity>
            </View>
            : 
            <TouchableOpacity onPress={() => requestGalleryPermission()}
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
                  style={{ width: 150, height: 150, marginLeft: 25 }}
                  source={imageUpload}
                />
              </Animated.View>
            </TouchableOpacity>
          }
        </View>
      </TouchableWithoutFeedback>
      { isEmojiSelect && 
        <View style={styles.emojiSelect}>
          { [0, 1].map((num, index) => (
            <View key={index} style={styles.emojiSelectRow}>
              {emojiArray[num].map((emotion, index2) => (
                <View key={index2} style={styles.emojiSelectCol}>
                  <TouchableOpacity
                    onPress={() => {
                      setEmoji(emojiArray[index][index2])
                      setIsEmojiSelect(false)
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

const styles = StyleSheet.create({
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


export default connect(mapStateToProps, mapDispatchToProps)(Picture)
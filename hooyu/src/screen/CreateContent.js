import React, {useRef, useState, useEffect} from 'react'
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, LogBox } from 'react-native'
import Status from '../components/ContentCreate/Status'
import Emoji from '../components/ContentCreate/Emoji'
import Picture from '../components/ContentCreate/Picture'
import Survey from '../components/ContentCreate/Survey'
import { connect } from 'react-redux'

const menuArray = ['이모지', '상태 메시지', '사진', '설문']
const menuLocation = [0, 93, 172, 260]

const CreateContent = ({ navigation, route, deviceHeight, deviceWidth }) => {

  LogBox.ignoreAllLogs()

  const styles = styleSheet(deviceWidth)

  const [selectedMenu, setSelectedMenu] = useState(route.params.menu)

  const menuScroll = useRef()

  const menuComponent = [
    <Emoji navigation={navigation} route={route} deviceHeight={deviceHeight} deviceWidth={deviceWidth} />,
    <Status navigation={navigation} route={route} deviceHeight={deviceHeight} deviceWidth={deviceWidth} />, 
    <Picture navigation={navigation} route={route} deviceHeight={deviceHeight} deviceWidth={deviceWidth} />,
    <Survey navigation={navigation} route={route} deviceHeight={deviceHeight} deviceWidth={deviceWidth} />,
  ]

  useEffect(() => {
    menuScroll.current.scrollTo({ x:menuLocation[selectedMenu] })
  })

  return (
    <View style={styles.mainView}>
      <View style={styles.content}>
        {menuComponent[selectedMenu]}
      </View>
      <View style={styles.footer}>
        <View>
          <ScrollView
            horizontal={true}
            ref={menuScroll}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.blankBoxStart}></View>
            {
              menuArray.map((menu, index) => (
                <TouchableOpacity 
                key={index}
                onPress={() => {
                  menuScroll.current.scrollTo({ x:menuLocation[index] })
                  setSelectedMenu(index)
                }}
                >
                  <Text 
                    style={{
                      marginHorizontal: 20,
                      fontSize: menuArray[selectedMenu] === menu ? 17 : 13,
                      color: menuArray[selectedMenu] === menu ? 'black' : '#aaa',
                      paddingTop: menuArray[selectedMenu] === menu ? -10 : 2
                    }}
                  >
                    {menu}
                  </Text>
                </TouchableOpacity>
              ))
            }
            <View style={styles.blankBoxEnd}></View>
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

const styleSheet = (deviceWidth) => StyleSheet.create({
  blankBoxEnd: {
    width: deviceWidth/2-76,
    marginHorizontal: 20,
  },
  blankBoxStart: {
    width: deviceWidth/2-85,
    marginHorizontal: 20,
  },
  checkBox: {
    borderWidth: 2,
  },
  content: {
    flex: 9,
  },
  footer: {
    height: 60,
    backgroundColor: "#eee",
    justifyContent: 'center',
  },
  mainView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  notSelectedMenuText: {
    marginHorizontal: 20,
    fontSize: 16,
    paddingBottom: 2
  },
  selectedMenuText: {
    marginHorizontal: 20,
    fontSize: 16,
    paddingBottom: 2
  }
})

function mapStateToProps(state) {
  return {
    deviceWidth: state.user.deviceWidth,
    deviceHeight: state.user.deviceHeight,
  }
}

export default connect(mapStateToProps)(CreateContent)
import React from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import Root from './src/navigation/Root'
import { Provider } from 'react-redux'
import Store from './src/store/store'


const store = Store()

export default function App() {

  LogBox.ignoreAllLogs()
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </Provider>
  )
}
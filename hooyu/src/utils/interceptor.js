import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode"


axios.defaults.baseURL = "https://k5a101.p.ssafy.io/api/v1/"
axios.defaults.headers.post["Content-Type"] = "application/json"

axios.interceptors.request.use(
  async function (config) {
    const word = config.url.split("/")
    if (word[0] != "login") {
      const accessToken = await AsyncStorage.getItem('access_token')
      const refreshToken = await AsyncStorage.getItem('refresh_token')
      const decodedAccessToken = jwt_decode(accessToken)
      if (decodedAccessToken.exp < Date.now() / 1000 + 10) {
        config.headers["access_token"] = accessToken
        config.headers["refresh_token"] = refreshToken
      }
      else {
        config.headers["access_token"] = accessToken
      }
      if (word[0] == 'content' && word[1] == 'upload') {
        config.headers["Content-Type"] = 'multipart/form-data'
      }
    }
    return config
  },
  function (error) {
    console.log(error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  async function (response) {

    const accessToken = await AsyncStorage.getItem('access_token')
    if (
      accessToken &&
      response.headers["access_token"] &&
      response.headers["access_token"] != accessToken
    ) {
      await AsyncStorage.setItem("access_token", response.headers["access_token"])
    }
    return response
  },
  function (error) {
    console.log(error)
    return Promise.reject(error)
  }
)

export default axios
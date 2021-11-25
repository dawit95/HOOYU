import axios from './interceptor'

export default {

  deleteContent(contentPK) {
    return axios({
      url: 'content',
      method: 'delete',
      data: { contentPK: contentPK }
    })
  },
  
  loginGoogle(data) {
    return axios({
      url: 'login/google',
      method: 'post',
      data: { googleIdToken: data }
    })
  },

  getUser() {
    return axios({
      url: 'user/setup',
      method: 'get'
    })
  },
  
  isDuplicatedNickname(inputValue) {
    return axios({
      url: `user/duplicated/${inputValue}`,
      method: 'get'
    })
  },

  updateNickname(inputValue) {
    return axios({
      url: `user/nameSet`,
      method: 'post',
      data: {
        userName: inputValue,
      }
    })
  },
  
  setPushSetting(accept, radius, sync) {
    return axios({
      url: `user/push`,
      method: 'post',
      data: {
        accept: accept,
        radius: radius,
        sync: sync
      }
    })
  },
  
  setFCMToken(browserToken) {
    return axios({
      url: 'browser/in',
      method: 'post',
      data: {
        browserToken: browserToken
      }
    })
  },
  
  setPushAlarmReceive(accept, radius, sync) {
    return axios({
      method: 'post',
      url: 'user/push',
      data: {
        accept: accept,
        radius: radius,
        sync: sync
      }
    })
  },
  
  setUserAlived() {
    return axios({
      method: 'put',
      url: 'user/wakeup'
    })
  },

  setUserKilled() {
    return axios({
      method: 'put',
      url: 'user/killed'
    })
  },

  reportContent(contentPK, reason) {
    return axios({
      method: 'post',
      url: 'content/report',
      data: { contentPK, reason }
    })
  },

  getUserStatus(userName) {
    return axios({
      method: 'get',
      url: `content/status/${userName}`,
    })
  },

  getUserImage(userName) {
    return axios({
      method: 'get',
      url: `content/image/${userName}`,
    })
  },

  getUserSurvey(userName) {
    return axios({
      method: 'get',
      url: `content/survey/${userName}`,
    })
  },

  getContentEmotion(contentPK) {
    return axios({
      method: 'get',
      url: `emotion/${contentPK}`,
    })
  },
  
  setContentEmotion(emoji, contentPK) {
    return axios({
      method: 'post',
      url: 'emotion/empathize',
      data: {
        contentEmoji: emoji,
        contentPk: contentPK
      }
    })
  },
  
  voteCheck(contentPK) {
    return axios({
      method: 'post',
      url: 'content/vote/check',
      data: {
        contentPK
      }
    })
  },

  voteSurvey(answerPK, contentPK) {
    return axios({
      method: 'post',
      url: 'content/vote/survey',
      data: {
        answerPK,
        contentPK
      }
    })
  },

  userDelete() {
    return axios({
      method: 'delete',
      url: 'user/drop'
    })
  }
}
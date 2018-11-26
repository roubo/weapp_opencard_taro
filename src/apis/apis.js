import Taro from '@tarojs/taro'


let ROUBOAPI = 'https://junjiancard.manmanqiusuo.com/roubo/rouboapi/v1/'

const opencard = (type, params, callback) => {
  Taro.request({
    url: ROUBOAPI + 'opencard/' + '?type=' + type + "&" + params
  }).then(res => {
    callback.success(res.data)
  }).catch(err => {
    callback.fail(err)
  })
}

const apis = {
  opencard
}

export default apis

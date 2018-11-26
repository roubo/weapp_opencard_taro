import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, OpenData } from '@tarojs/components'
import './index.scss'
import apis from '../../apis/apis'
import {
  AtGrid } from 'taro-ui'


export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      baseData : [
        {
          image: 'https://junjiancard.manmanqiusuo.com/static/images/connect.png',
          value: '联系方式'
        },
      ],
      opensourceData : [
        {
          image: 'https://junjiancard.manmanqiusuo.com/static/images/npm.png',
          value: 'Nodejs'
        },
        {
          image: 'https://junjiancard.manmanqiusuo.com/static/images/github.png',
          value: 'GitHub'
        },
        {
          image: 'https://junjiancard.manmanqiusuo.com/static/images/producthunt.jpg',
          value: 'ProductHunt'
        },
      ],
      articleData : [
        {
          image: 'https://junjiancard.manmanqiusuo.com/static/images/jianshu.jpg',
          value: '简书'
        },
        {
          image: 'https://junjiancard.manmanqiusuo.com/static/images/juejin.png',
          value: '稀土掘金'
        },
      ],
      attitudeData : [
        {
          image: 'https://junjiancard.manmanqiusuo.com/static/images/weibo.png',
          value: '微博'
        },
        {
          image: 'https://junjiancard.manmanqiusuo.com/static/images/twitter.png',
          value: 'twitter'
        },
        {
          image: 'https://junjiancard.manmanqiusuo.com/static/images/facebook.png',
          value: 'Facebook'
        },
      ]
    }
  }

  config = {
    navigationBarTitleText: '配置名片'
  }

  componentWillMount () {}

  /**
   * 检测是否有登录信息
   * @returns {boolean}
   */
  isLogin = () => {
    const openid = Taro.getStorageSync('openid')
    if (openid) {
      return true
    }
    return false
  }

  componentDidMount () {
    // 查询是否有登录信息，如果没有则触发一次登录流程，最终保存openid
    if(!this.isLogin()) {
      Taro.login({
        success(res) {
          if ('code' in res) {
            apis.opencard('login', 'wxcode=' + res['code'], {
              success: (ress) => {
                if( 'openid' in ress.data) {
                  Taro.setStorage({key: 'openid', data: ress.data.openid})
                }
              },
              fail: (err) => {
                console.log(JSON.stringify(err))
              }
            })
          }
        }
      })
    }

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClickBase = (item, index) => {
    Taro.navigateTo({
      url: '../search/index?type=connect&title=' + this.state.baseData[index].value
    })
  }

  onClickOpenSource = (item, index) => {

  }

  onClickArticle = (item, index) => {

  }

  onClickAttitude = (item, index) => {

  }
  render () {
    return (
      <View className='page'>
        <View className='item'>
          <View className='title'>
            <View className='div' />
            <Text className='titleText'>基本信息</Text>
          </View>
          <AtGrid className='grid' onClick={this.onClickBase} data={this.state.baseData} />
        </View>
        <View className='item'>
          <View className='title'>
            <View className='div' />
            <Text className='titleText'>开源作品</Text>
          </View>
          <AtGrid className='grid' onClick={this.onClickOpenSource} data={this.state.opensourceData} />
        </View>
        <View className='item'>
          <View className='title'>
            <View className='div' />
            <Text className='titleText'>我的文章</Text>
          </View>
          <AtGrid className='grid' onClick={this.onClickArticle} data={this.state.articleData} />
        </View>
        <View className='item'>
          <View className='title'>
            <View className='div' />
            <Text className='titleText'>我的态度</Text>
          </View>
          <AtGrid className='grid' onClick={this.onClickAttitude} data={this.state.attitudeData} />
        </View>
      </View>

    )
  }
}


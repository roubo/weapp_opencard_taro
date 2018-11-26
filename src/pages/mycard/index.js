import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, OpenData } from '@tarojs/components'
import {
  AtAvatar, AtDivider, AtIcon, AtButton
} from 'taro-ui'
import './index.scss'
import apis from '../../apis/apis'


export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data : null
    }
  }

  config = {
    navigationBarTitleText: '我的名片'
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

  onSettingClick = () => {
    Taro.switchTab({
      url: '/pages/setting/index'
    })
  }

  render () {
    return (
      <View className='page'>
        <View className='base'>
          <AtAvatar size='small' openData={{ type: 'userAvatarUrl' }} />
          <OpenData className='nickname' type='userNickName' />
        </View>
        {this.state.data || (
          <View className='divider'>
            <AtDivider>
              <AtIcon color='#858585' value='blocked' />
            </AtDivider>
           <AtButton className='button'  onClick={this.onSettingClick}>还没有配置您的名片哦，点击前去配置吧~</AtButton>
          </View>
        )}
      </View>
    )
  }
}


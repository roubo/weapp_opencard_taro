import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, OpenData, Image } from '@tarojs/components'
import {
  AtAvatar, AtDivider, AtIcon, AtButton
} from 'taro-ui'
import './index.scss'
import apis from '../../apis/apis'


export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data : null,
      baseInfo: null,
      juejin: null,
      enough: true
    }
  }

  config = {
    navigationBarTitleText: '我的名片'
  }

  /**
   * 先从存储中获取信息
   */
  componentWillMount () {

    const baseInfo = Taro.getStorageSync('baseInfo')
    if (baseInfo !== '') {
      this.setState({
        baseInfo: baseInfo
      })
    }
    const juejin = Taro.getStorageSync('juejin')
    if (juejin !== '') {
      this.setState({
        juejin: juejin,
        data: [],
        enough: false
      })
    }

  }

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
    this.updateInfo()
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.updateInfo()
  }

  componentDidHide () { }

  /**
   *  跳转到配置页面
   */
  onSettingClick = () => {
    Taro.switchTab({
      url: '/pages/setting/index'
    })
  }

  /**
   * 更新页面信息
   */
  updateInfo = () => {
    const openid = Taro.getStorageSync('openid')
    apis.opencard('bskeys', 'from=juejin'
      + '&openid=' + openid, {
      success: (res)  => {
        this.setState({
          juejin: res.data,
          data: [],
          enough: false
        })
        Taro.setStorage({key: 'juejin', data: res.data}).then(
          (ress) => {
            console.log(ress)
          }
        )
      }
    })

    apis.opencard('bskeys', 'from=connect'
      + '&openid=' + openid, {
      success: (res)  => {
        this.setState({
          baseInfo: res.data,
          data: [],
          enough: false

        })
        Taro.setStorage({key: 'baseInfo', data: res.data}).then(
          (ress) => {
            console.log(ress)
          }
        )
      }
    })
  }
  render () {
    return (
      <View className='page'>
        <View className='base'>
          <AtAvatar size='small' openData={{ type: 'userAvatarUrl' }} />
          <OpenData className='nickname' type='userNickName' />
          {this.state.baseInfo && <Text className='nickname'>({this.state.baseInfo.name})</Text>}
        </View>

        {
          this.state.baseInfo &&
          <View className='baseConnect'>
            <View className='connectItem'>
              <AtIcon value='mail' size='15' />
              <Text className='connectText' selectable>{this.state.baseInfo.email}</Text>
            </View>
            <View className='connectItem'>
              <AtIcon value='phone' size='15' />
              <Text className='connectText' selectable>{this.state.baseInfo.phone}</Text>
            </View>
          </View>
        }

        {
          this.state.data &&
          <View>
            <AtDivider />
            <View className='title'>
              <View className='div' />
              <Text className='titleText'> 社区影响力 </Text>
            </View>
            <AtDivider />
          </View>
        }

        {
          this.state.juejin &&
          <View className='subitem'>
            <View className='subtitle'>
              <AtAvatar size='small' circle image='https://junjiancard.manmanqiusuo.com/static/images/juejin.png'></AtAvatar>
              <View className='subtitleTextContainer'>
                <Text className='subtitleName'>{this.state.juejin.name}(掘金)</Text>
                <Text className='subtitleInfo'>发表原创文章{this.state.juejin.postedPosts}篇</Text>
              </View>
            </View>
            <View className='juejinContainer'>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.juejin.followers}
                </Text>
                <AtIcon value='bell' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得关注数</Text>
              </View>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.juejin.totalCollections}
                </Text>
                <AtIcon value='heart' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得点赞数</Text>
              </View>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.juejin.totalViews}
                </Text>
                <AtIcon value='eye' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得阅读数</Text>
              </View>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.juejin.totalComments}
                </Text>
                <AtIcon value='message' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得评论数</Text>
              </View>
            </View>
            <AtDivider />
          </View>
        }
        {this.state.data || (
          <View className='divider'>
            <AtDivider>
              <AtIcon color='#858585' value='blocked' />
            </AtDivider>
           <AtButton className='button'  onClick={this.onSettingClick}>还没有配置您的名片哦，点击前去配置吧~</AtButton>
          </View>
        )}
        {(this.state.enough) || (
          <View className='divider'>
            <AtDivider>
              <AtIcon color='#858585' value='blocked' />
            </AtDivider>
            <AtButton className='button'  onClick={this.onSettingClick}>您的名片还不够丰满哦，点击配置更多吧~</AtButton>
          </View>
        )}
      </View>
    )
  }
}


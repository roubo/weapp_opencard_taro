import Taro, { Component } from '@tarojs/taro'
import Index from './pages/mycard/index'

import './app.scss'

class App extends Component {

  config = {
    pages: [
      'pages/mycard/index',
      'pages/myfollow/index',
      'pages/feedback/index',
      'pages/setting/index',
      'pages/search/index',
      'pages/mycard/share',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#626567',
      selectedColor: '#0e932e',
      backgroundColor: '#FBFBFB55',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/mycard/index',
          text: '我的名片',
          iconPath: './asset/images/cards.png',
          selectedIconPath: './asset/images/cards_focus.png'
        },
        {
          pagePath: 'pages/myfollow/index',
          text: '我的关注',
          iconPath: './asset/images/follow.png',
          selectedIconPath: './asset/images/follow_focus.png'
        },
        {
          pagePath: 'pages/setting/index',
          text: '配置名片',
          iconPath: './asset/images/setting.png',
          selectedIconPath: './asset/images/setting_focus.png'
        },
        {
          pagePath: 'pages/feedback/index',
          text: '反馈',
          iconPath: './asset/images/feedback.png',
          selectedIconPath: './asset/images/feedback_focus.png'
        }]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}



  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

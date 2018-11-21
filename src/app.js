import Taro, { Component } from '@tarojs/taro'
import Index from './pages/mycard/index'
import TabBar from './component/tabBar'

import './app.scss'

class App extends Component {

  config = {
    pages: [
      'pages/mycard/index',
      'pages/myfollow/index',
      'pages/feedback/index',
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
      borderStyle: 'white',
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
      <TabBar/>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

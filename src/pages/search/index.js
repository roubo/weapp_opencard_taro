import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import Connect from './templates/connect/index'
import JueJin from './templates/juejin/index'
import JianShu from './templates/jianshu/index'
import {AtList, AtListItem, AtSwipeAction, AtDivider} from 'taro-ui'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  config = {
    navigationBarTitleText: ""
  }

  componentWillMount () {
    Taro.setNavigationBarTitle({title: this.$router.params.title})
  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='page'>
        {this.$router.params.title === '联系方式' && <Connect />}
        {this.$router.params.title === '稀土掘金' && <JueJin />}
        {this.$router.params.title === '简书' && <JianShu />}
      </View>
    )
  }
}


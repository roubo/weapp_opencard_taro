import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import Connect from './templates/connect/index'
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
        {this.$router.params.type === 'connect' && <Connect />}
      </View>
    )
  }
}


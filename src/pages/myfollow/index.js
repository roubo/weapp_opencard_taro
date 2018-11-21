import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import TabBar from '../../component/tabBar'

export default class Index extends Component {

  constructor(props) {
    super(props)
  }

  config = {
    navigationBarTitleText: '我的关注'
  }
  componentWillMount () {}

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>我的关注</Text>
      </View>
    )
  }
}


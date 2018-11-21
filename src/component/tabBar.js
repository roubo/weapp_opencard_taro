import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'

export default class TabBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      current: 0
    }
  }

  componentWillMount () {}

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  pages = [
    '../mycard/index',
    '../myfollow/index',
    '../feedback/index',
  ]
  onClickTabBar =(value) => {
    this.setState({
      current: value
    })
    Taro.navigateTo({url: this.pages[value]})
  }

  render () {
    return (
      <View className='index'>
        <AtTabBar
          fixed
          current={this.state.current}
          selectedColor="#2e8b57"
          tabList={[
            {title:'我的名片', iconType:'money'},
            {title:'我的关注', iconType: 'eye'},
            {title:'反馈',iconType: 'repeat-play'}]}
          onClick={this.onClickTabBar}
        />
      </View>
    )
  }
}


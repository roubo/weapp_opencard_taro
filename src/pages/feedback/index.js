import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import {
  AtTextarea, AtButton
} from 'taro-ui'
export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      feedbackContent: ''
    }
  }

  config = {
    navigationBarTitleText: '反馈'
  }
  componentWillMount () {}

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onInputChange = (e) => {
    this.setState({
      feedbackContent: e.target.value
    })
  }
  render () {
    return (
      <View className='page'>
        <View className='feedback'>
          <AtTextarea
            height='250'
            value={this.state.feedbackContent}
            onChange={this.onInputChange}
            maxlength='200'
            placeholder='您的反馈是我的动力...'
          />
          <AtButton className='button'>提交反馈</AtButton>
        </View>
      </View>
    )
  }
}


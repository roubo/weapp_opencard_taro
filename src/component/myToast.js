import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtToast } from 'taro-ui'


export default class MyToast extends Component {

  constructor() {
    super(...arguments)
  }

  defaultProps = {
    image: '',
    icon: '',
    text: '',
    status: '',
    duration: 3000,
    hasMask: false,
    isOpened: false
  }


  render() {
    const {
      text,
      icon,
      status,
      isOpened,
      duration,
      image,
      hasMask
    } = this.props

    return (
      <View>
        <AtToast
          icon={icon}
          text={text}
          image={image}
          status={status}
          hasMask={hasMask}
          isOpened={isOpened}
          duration={duration}
        />
      </View>
    );
  }
}

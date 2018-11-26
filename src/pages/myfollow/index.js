import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import {AtList, AtListItem, AtSwipeAction, AtDivider} from 'taro-ui'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      followList : [
        {
          avatar: "https://junjiancard.manmanqiusuo.com/static/images/avatar01.png",
          name: "张同学",
          openid: 'xxxx'
        },
        {
          avatar: "https://junjiancard.manmanqiusuo.com/static/images/avatar02.png",
          name: "李同学",
          openid: 'xxxx'
        },
        {
          avatar: "https://junjiancard.manmanqiusuo.com/static/images/avatar03.png",
          name: "戴同学",
          openid: 'xxxx'
        },
        {
          avatar: "https://junjiancard.manmanqiusuo.com/static/images/avatar04.png",
          name: "刘同学",
          openid: 'xxxx'
        },
        {
          avatar: "https://junjiancard.manmanqiusuo.com/static/images/avatar05.png",
          name: "吴同学",
          openid: 'xxxx'
        },
        {
          avatar: "https://junjiancard.manmanqiusuo.com/static/images/avatar06.png",
          name: "范同学",
          openid: 'xxxx'
        },
      ]
    }
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
      <View className='page'>
        <View className='author'>
          <AtListItem
            title='军建（作者）'
            thumb='https://junjiancard.manmanqiusuo.com/static/images/author.jpg'
          />
        </View>
        <AtList>
          {this.state.followList.map((item, index) => {
            return (
              <AtSwipeAction
                key={index}
                options={[
                  {
                    text: '取消关注',
                    style : {
                      backgroundColor: '#6190E8'
                    }
                  }
                ]}
              >
                <AtListItem
                  title={item.name}
                  thumb={item.avatar}
                />
              </AtSwipeAction>

            )
          })}
        </AtList>
      </View>
    )
  }
}


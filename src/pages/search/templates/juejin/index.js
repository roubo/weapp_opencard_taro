import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import {AtToast, AtDivider, AtList, AtListItem, AtSearchBar} from 'taro-ui'
import apis from '../../../../apis/apis'
import './index.scss'
import MyToast from '../../../../component/myToast'

export default class JueJin extends Component {

  constructor(props) {
    super(props)
    this.state = {
      searchKey: '',
      searchResult: [],
      selectKey: null,
      showToast: false
    }
  }

  componentWillMount () {

  }

  componentDidMount () {
    this.getStoredSelectedKey()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  getStoredSelectedKey = () => {
    Taro.getStorage({key: 'juejin'}).then(
      (res) => {
        this.setState({
          selectKey: res.data.name,
        })
      }
    )
  }

  doSearch = (key) => {
    apis.opencard('search', 'from=juejin&key=' + encodeURIComponent('掘金' + key), {
      success: (res) => {
        this.setState({
          searchResult: res.data
        })
      }
    })
  }

  onActionClick = () => {
    this.doSearch(this.state.searchKey)
  }

  onItemSelectedClick = (item, e) => {
    const openid = Taro.getStorageSync('openid')
    apis.opencard('save', 'from=juejin'
      +'&uid=' + item.userid
      +'&openid=' + openid, {
      success: (res) => {
        this.setState({
          showToast: true,
          selectKey: item.name
        })
        apis.opencard('bskeys', 'from=juejin'
        + '&openid=' + openid
        + '&uid=' + item.userid, {
          success: (ress)  => {
            Taro.setStorage({key: 'juejin', data: ress.data}).then(
              (resss) => {
                console.log(resss)
              }
            )
          }
        })
      }
    })
  }

  onSearchChange = (value) => {
    this.setState({
      searchKey: value
    })
  }

  render () {
    return (
      <View className='page'>
        <AtDivider />
        <View className='explain'>
          <Text className='tip'>Tips</Text>
          <Text className='explainText'>
            您可以通过搜索您的掘金用户名，找到并选择您的用户名后，OpenCard 将会追踪您在掘金上的表现 ~
          </Text>
          {this.state.selectKey &&
          <Text className='selectText'>
            您当前追踪的掘金用户名为：{this.state.selectKey}
          </Text>}
        </View>
        <AtDivider />
        <AtSearchBar
          actionName='掘金'
          value={this.state.searchKey}
          onChange={this.onSearchChange}
          showActionButton
          onActionClick={this.onActionClick}
          onConfirm={this.onActionClick}
        />
        <AtList>
          {this.state.searchKey.length !== 0 && this.state.searchResult.map((item, index) => {
            return (
              <AtListItem title={item.name} onClick={this.onItemSelectedClick.bind(this, item)} key={index} />
            )
          })}
        </AtList>
        <MyToast
          isOpened={this.state.showToast}
          text='提交成功'
          status='success'
          icon='check'
        />
      </View>
    )
  }
}


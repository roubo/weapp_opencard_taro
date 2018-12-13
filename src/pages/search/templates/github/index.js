import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import {AtToast, AtDivider, AtList, AtListItem, AtSearchBar} from 'taro-ui'
import apis from '../../../../apis/apis'
import './index.scss'
import MyToast from '../../../../component/myToast'

export default class GitHub extends Component {

  constructor(props) {
    super(props)
    this.state = {
      searchKey: '',
      searchResult: [],
      selectKey: null,
      showToast: false,
      showLoading: false,
      repoList: [],
      selectRepos: {},
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
    Taro.getStorage({key: 'github'}).then(
      (res) => {
        this.setState({
          selectKey: res.data.login,
        })
        if(res.data.login){
          apis.opencard('repo', 'from=github&login=' + res.data.login, {
            success: (ress) => {
              this.setState({
                repoList: ress.data
              })
            }
          })
        }
      }
    )
    Taro.getStorage({key: 'repos'}).then(
      (res) => {
        this.setState({
          selectRepos: res.data,
        })
      }
    )
  }

  doSearch = (key) => {
    this.setState({
      showLoading: true,
      showToast: false
    })
    apis.opencard('search', 'from=github&key=' + encodeURIComponent(key), {
      success: (res) => {
        this.setState({
          searchResult: res.data,
          showLoading: false,
          showToast: false
        })
      },
      fail: (err) => {
        this.setState({
          showLoading: false,
          showToast: false
        })
      }
    })
  }

  onActionClick = () => {
    this.doSearch(this.state.searchKey)
  }

  onItemSelectedClick = (item, e) => {
    const openid = Taro.getStorageSync('openid')
    apis.opencard('save', 'from=github'
      +'&login=' + item.login
      +'&id=' + item.id
      +'&openid=' + openid, {
      success: (res) => {
        this.setState({
          showToast: true,
          selectKey: item.login,
          searchKey: null,
          searchResult: []

        })
        apis.opencard('bskeys', 'from=github'
        + '&openid=' + openid, {
          success: (ress)  => {
            Taro.setStorage({key: 'github', data: ress.data}).then(
              (resss) => {
                console.log(resss)
              }
            )
          }
        })
        apis.opencard('repo', 'from=github&login=' + item.login, {
          success: (ress) => {
            this.setState({
              repoList: ress.data
            })
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

  onSwitchChange = (item, e) => {
    const tmp = this.state.selectRepos
    tmp[item.name] = e.detail.value
    this.setState({
      selectRepos: tmp,
    })
    Taro.setStorage({key:'repos', data:tmp}).then(
      (res) => {
        console.log(res)
      }
    )
  }

  render () {
    return (
      <View className='page'>
        <AtDivider />
        <View className='explain'>
          <Text className='tip'>Tips</Text>
          <Text className='explainText'>
            您可以通过搜索您的 GitHub 用户名，找到并选择您的用户名后，OpenCard 将会追踪您在 GitHub 上的表现 ~
          </Text>
          {this.state.selectKey &&
          <Text className='selectText'>
            您当前追踪的 GitHub 用户名为：{this.state.selectKey}
          </Text>}
        </View>
        <AtDivider />
        <AtSearchBar
          actionName='GitHub'
          value={this.state.searchKey}
          onChange={this.onSearchChange}
          showActionButton
          onActionClick={this.onActionClick}
          onConfirm={this.onActionClick}
        />
        <AtList>
          {this.state.searchKey.length !== 0 && this.state.searchResult.map((item, index) => {
            return (
              <AtListItem title={item.login} onClick={this.onItemSelectedClick.bind(this, item)} key={index} />
            )
          })}
        </AtList>

        <AtList>
          {this.state.repoList.length !== 0 && this.state.repoList.map((item, index) => {
            return (
              <AtListItem
                hasBorder
                switchIsCheck={item.name in this.state.selectRepos ? this.state.selectRepos[item.name]:false }
                isSwitch
                title={item.name}
                onSwitchChange={this.onSwitchChange.bind(this, item)}
                key={index}
              />
            )
          })}
        </AtList>
        <MyToast
          isOpened={this.state.showToast}
          text='提交成功'
          status='success'
          icon='check'
        />
        <MyToast
          isOpened={this.state.showLoading}
          text='搜索较慢，请耐心等待一下..'
          status='loading'
          icon='check'
          hasMask
          duration={30000}
        />
      </View>
    )
  }
}


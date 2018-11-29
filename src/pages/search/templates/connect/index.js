import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import {AtButton, AtDivider, AtForm, AtInput, AtToast} from 'taro-ui'
import './index.scss'
import apis from "../../../../apis/apis";
import MyToast from '../../../../component/myToast'

export default class Connect extends Component {

  constructor(props) {
    super(props)
    this.state = {
      realName: '',
      phoneNumber: '',
      emailAddress: '',
      isSubmited: false,
      submitText: '提交',
      showToast: false
    }
  }

  componentWillMount () {
    this.getStoreBaseInfo()
  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onInputChangePhone = (value) => {
    this.setState({
      phoneNumber: value,
      submitText: this.state.isSubmited ? '重新提交' : '提交'
    })
  }
  onInputChangeRealName = (value) => {
    this.setState({
      realName: value,
      submitText: this.state.isSubmited ? '重新提交' : '提交'
    })
  }
  onInputChangeEmail = (value) => {
    this.setState({
      emailAddress: value,
      submitText: this.state.isSubmited ? '重新提交' : '提交'
    })
  }

  getStoreBaseInfo = () => {
    Taro.getStorage({key: 'baseInfo'}).then(
      (res) => {
        this.setState({
          realName: res.data.name,
          phoneNumber: res.data.phone,
          emailAddress: res.data.email,
          isSubmited: true,
          submitText: '重新提交'
        })
      }
    )
  }
  onSubmit = () => {
    Taro.setStorage({key: 'baseInfo', data: this.state}).then(
      (res) => {
        console.log(JSON.stringify(res))
      }
    )
    const openid = Taro.getStorageSync('openid')
    apis.opencard('save', 'from=connect&phone='
      +encodeURIComponent(this.state.phoneNumber)
      +'&email='+ encodeURIComponent(this.state.emailAddress)
      +'&name=' + encodeURIComponent(this.state.realName)
      +'&openid=' + openid, {
      success: (res) => {
        console.log(JSON.stringify(res))
        this.setState({
          showToast: true
        })
      }
    })
  }

  render () {
    return (
      <View className='page'>
        <AtDivider />
        <View className='explain'>
          <Text className='tip'>Tips</Text>
          <Text className='explainText'>
            您可以添加您的真实姓名、手机号和邮箱，方便一些正式场合使用~
          </Text>
        </View>
        <AtDivider />
        <View className='form'>
          <AtForm
            onSubmit={this.onSubmit}
          >
            <AtInput
              name='phone'
              title='手机:'
              type='phone'
              placeholder='您的手机号'
              value={this.state.phoneNumber}
              onChange={this.onInputChangePhone}
            />
            <AtInput
              name='email'
              title='邮箱:'
              type='text'
              placeholder='您的邮箱地址'
              value={this.state.emailAddress}
              onChange={this.onInputChangeEmail}
            />
            <AtInput
              name='name'
              title='姓名:'
              type='text'
              placeholder='您的姓名'
              value={this.state.realName}
              onChange={this.onInputChangeRealName}
            />
            <View className='submitButton'>
              <AtButton formType='submit'>{this.state.submitText}</AtButton>
            </View>
          </AtForm>
          <MyToast
            isOpened={this.state.showToast}
            text='提交成功'
            status='success'
            icon='check'
          />
        </View>
      </View>
    )
  }
}


import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, OpenData, Image } from '@tarojs/components'
import { AtAvatar, AtDivider, AtIcon, AtButton } from 'taro-ui'
import './index.scss'
import apis from '../../apis/apis'
import * as echarts from '../../component/ec-canvas/echarts'

export default class Share extends Component {

  config = {
    navigationBarTitleText: '分享的名片',
    usingComponents: {
      'ec-canvas': '../../component/ec-canvas/ec-canvas'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      data : null,
      baseInfo: null,
      juejin: null,
      jianshu: null,
      github: null,
      showEc: false,
      ecc: {
        onInit: this.ecInit
      }
    }
  }

  componentWillMount () {}


  componentDidMount () {
    // 查询是否有登录信息，如果没有则触发一次登录流程，最终保存openid
    if(!this.isLogin()) {
      Taro.login({
        success(res) {
          if ('code' in res) {
            apis.opencard('login', 'wxcode=' + res['code'], {
              success: (ress) => {
                if( 'openid' in ress.data) {
                  Taro.setStorage({key: 'openid', data: ress.data.openid})
                }
              },
              fail: (err) => {
                console.log(JSON.stringify(err))
              }
            })
          }
        }
      })
    }
    this.updateInfo()
  }

  componentWillUnmount () {}

  componentDidShow () {}

  componentDidHide () {}

  onShareAppMessage() {
    return {
      title: 'OpenCard 动态名片',
      path: '/pages/mycard/index',
      imageURL: 'https://junjiancard.manmanqiusuo.com/static/images/opencard.png'
    }
  }
  /**
   * 检测是否有登录信息
   * @returns {boolean}
   */
  isLogin = () => {
    const openid = Taro.getStorageSync('openid')
    if (openid) {
      return true
    }
    return false
  }

  /**
   * 初始化 echarts
   * @param canvas
   * @param width
   * @param height
   * @param xdata
   * @param ydata
   * @returns {*}
   */
  initChart = (canvas, width, height, xdata, yseries) => {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    })
    canvas.setChart(chart)
    const  option = {
      title : {
      },
      tooltip : {
        show: true,
        trigger: 'axis',
      },
      xAxis : [
        {
          show: true,
          type : 'category',
          boundaryGap : false,
          data: xdata
        }
      ],
      yAxis : [
        {
          show: true,
          type : 'value'
        }
      ],
      series: yseries
    }
    chart.setOption(option)
    return chart
  }

  ecInit = (canvas, width, heigh) => {
    let xdata = Taro.getStorageSync('shareXdata')
    let ydata = Taro.getStorageSync('shareYseries')
    for(let i in xdata) {
      let week = parseInt(i) + 1
      xdata[i] = 'w' + week
    }
    this.initChart(canvas, width, heigh, xdata, ydata)
  }

  /**
   * 更新页面信息(分享人）
   */
  updateInfo = () => {
    const openid = this.$router.params.fromOpenid
    apis.opencard('bskeys', 'from=juejin'
      + '&openid=' + openid, {
      success: (res)  => {
        this.setState({
          juejin: res.data,
          data: [],
        })
      }
    })

    apis.opencard('bskeys', 'from=connect'
      + '&openid=' + openid, {
      success: (res)  => {
        this.setState({
          baseInfo: res.data,
          data: [],
        })
      }
    })
    apis.opencard('bskeys', 'from=jianshu'
      + '&openid=' + openid, {
      success: (res)  => {
        this.setState({
          // jianshu: res.data,
          data: [],
        })
      }
    })
    apis.opencard('bskeys', 'from=github'
      + '&openid=' + openid, {
      success: (res)  => {
        this.setState({
          github: res.data,
          data: [],
        })
      },
      fail: (err) => {
        console.warn(err)
      }
    })

    let repos = []
    if(this.$router.params.repos){
      console.log(this.$router.params.repos)
      repos = this.$router.params.repos.split(',')
      console.log(repos)
    }
    let promises = []
    for (let itemIndex in repos) {
      promises.push(
        new Promise((resolve, reject) => {
          apis.opencard('contrib', 'from=github&login=' + this.$router.params.login + '&repo=' + repos[itemIndex], {
            success: (ress) => {
              resolve(ress.data)
            },
            fail: (errr) => {
              reject(errr)
            }
          })
        })
      )
    }
    Promise.all(promises).then((alldata) => {
      let count = 0
      let yseries = []
      let xdata = []
      let ydata = []
      for (let repoIndex in repos) {
        xdata = []
        ydata = []
        for (let i in alldata[count]){
          xdata.push(alldata[count][i].week)
          ydata.push(alldata[count][i].total)
        }
        yseries.push({
          name: repos[repoIndex],
          type:'line',
          smooth:true,
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
          data:ydata
        })
        count = count +  1
      }
      Taro.setStorageSync('shareXdata', xdata)
      Taro.setStorageSync('shareYseries', yseries)
      this.setState({
        showEc: true
      })
    }).catch((err) => {
      console.log("err:" + JSON.stringify(err))
    })

  }
  render () {
    return (
      <View className='page'>
        <View className='base'>
          <AtAvatar size='small' openData={{ type: 'userAvatarUrl' }} />
          <OpenData className='nickname' type='userNickName' />
          {this.state.baseInfo && <Text className='nickname'>({this.state.baseInfo.name})</Text>}
        </View>

        {
          this.state.baseInfo &&
          <View className='baseConnect'>
            <View className='connectItem'>
              <AtIcon value='mail' size='15' />
              <Text className='connectText' selectable>{this.state.baseInfo.email}</Text>
            </View>
            <View className='connectItem'>
              <AtIcon value='phone' size='15' />
              <Text className='connectText' selectable>{this.state.baseInfo.phone}</Text>
            </View>
          </View>
        }

        {
          this.state.data &&
          <View>
            <AtDivider />
            <View className='title'>
              <View className='div' />
              <Text className='titleText'> 社区影响力 </Text>
            </View>
            <AtDivider />
          </View>
        }

        {
          this.state.juejin &&
          <View className='subitem'>
            <View className='subtitle'>
              <AtAvatar size='small' circle image='https://junjiancard.manmanqiusuo.com/static/images/juejin.png'></AtAvatar>
              <View className='subtitleTextContainer'>
                <Text className='subtitleName'>{this.state.juejin.name}(掘金)</Text>
                <Text className='subtitleInfo'>发表原创文章{this.state.juejin.postedPosts}篇</Text>
              </View>
            </View>
            <View className='juejinContainer'>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.juejin.followers}
                </Text>
                <AtIcon value='bell' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得关注数</Text>
              </View>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.juejin.totalCollections}
                </Text>
                <AtIcon value='heart' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得点赞数</Text>
              </View>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.juejin.totalViews}
                </Text>
                <AtIcon value='eye' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得阅读数</Text>
              </View>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.juejin.totalComments}
                </Text>
                <AtIcon value='message' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得评论数</Text>
              </View>
            </View>
            <AtDivider />
          </View>
        }

        {
          this.state.jianshu &&
          <View className='subitem'>
            <View className='subtitle'>
              <AtAvatar size='small' circle image='https://junjiancard.manmanqiusuo.com/static/images/jianshu.jpg'></AtAvatar>
              <View className='subtitleTextContainer'>
                <Text className='subtitleName'>{this.state.jianshu.name}(简书)</Text>
                <Text className='subtitleInfo'>发表原创文章{this.state.jianshu.postedPosts}篇</Text>
              </View>
            </View>
            <View className='juejinContainer'>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.jianshu.followers}
                </Text>
                <AtIcon value='bell' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得关注数</Text>
              </View>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.jianshu.totalCollections.split('获得了')[1].split('个')[0]}
                </Text>
                <AtIcon value='heart' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得喜欢数</Text>
              </View>
              <View className='info'>
                <Text>
                  --
                </Text>
                <AtIcon value='eye' size='20' color='#5F5F5F' />
                <Text className='infoText'>获得阅读数</Text>
              </View>
              <View className='info'>
                <Text className='bigNumber'>
                  {this.state.jianshu.totalCollections.split('写了')[1].split('字')[0]}
                </Text>
                <AtIcon value='edit' size='20' color='#5F5F5F' />
                <Text className='infoText'>完成总字数</Text>
              </View>
            </View>
            <AtDivider />
          </View>
        }

        {
          this.state.data &&
          <View>
            <View className='title'>
              <View className='div' />
              <Text className='titleText'> 技术影响力 </Text>
            </View>
            <AtDivider />
          </View>
        }

        {
          this.state.github &&
          <View className='subitem'>
            <View className='subtitle'>
              <AtAvatar size='small' circle image='https://junjiancard.manmanqiusuo.com/static/images/github.png'></AtAvatar>
              <View className='subtitleTextContainer'>
                <Text className='subtitleName'>{this.state.github.name}({this.state.github.login})</Text>
                <Text className='subtitleInfo'>
                  公开仓库{this.state.github.public_repos}个，{this.state.github.followers}个关注者
                </Text>
              </View>
            </View>
            { this.state.showEc && (
              <View className='echartContainer'>
                <Text className='echartTitle'>【 最近一年内的贡献活跃曲线 】</Text>
                <View className='echartView'>
                  <View className='echarts'>
                    <ec-canvas id='mychart-dom-area' canvas-id='mychart-area' ec={this.state.ecc}></ec-canvas>
                  </View>
                </View>
              </View>
            )}
            <AtDivider />
          </View>
        }
      </View>
    )

  }
}


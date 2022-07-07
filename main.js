console.log($)
const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x) //把字符串变回对象
const hashMap = xObject || [
  {logo: 'A', url: 'https://www.acfun.cn'},
  {logo: 'B', url: 'https://www.bilibili.com'}
]//初始化的数组
const simplifyUrl = (url) => {
  return url.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/.*/, '') // 删除 / 开头的内容 正则表达式
}

const render = () => {
  //render函数渲染hash，后面调用
  $siteList.find('li:not(.last)').remove()
  //不找最后一个li 
  hashMap.forEach((node, index) => {
    const $li = $(`<li>
      <div class="site">
        <div class="logo">${node.logo}</div>
        <div class="link">${simplifyUrl(node.url)}</div>
        <div class="close">
          <svg class="icon">
            <use xlink:href="#icon-close"></use>
          </svg>
        </div>
      </div>
    </li>`).insertBefore($lastLi)
    //创建哈希遍历塞进去
    $li.on('click', () => {
      window.open(node.url)
    })//代替a标签作用，不然关闭按钮会跟a一直跳转
    $li.on('click', '.close', (e) => {
      e.stopPropagation() // 阻止冒泡，阻止svg点了还是跳转网页
      hashMap.splice(index, 1)//找到hash里面要删除的网站（遍历可以给出来）
      render()//删了后重新渲染
    })
  })
}

render()

$('.addButton').on('click', () => {
  let url = window.prompt('请问你要添加的网址是啥？')
  if (url.indexOf('http') !== 0) {
    url = 'https://' + url
  }
  console.log(url)
  // const $li= $(`<li>
//   <a href="${url}">
//     <div class="site">
//       <div class="logo">${url[0]}</div> $不是jquery 是js插入语法
//       <div class="link">${url}</div>
//     </div>
//     </a>
//     </li>`).insertBefore($lastLi) 插入新增网站前面
// })
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),//前面函数去除http 变大写
    url: url
  })
  render()
})

window.onbeforeunload = () => {//关闭页面
  const string = JSON.stringify(hashMap)//把hash变成字符串存在storage里面，storage只能存字符串
  localStorage.setItem('x', string)//本地存储里面设置个x值就是这个string
}

$(document).on('keypress', (e) => {
  const {key} = e
  //等价 const key = e.key
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url)
      //变小写开网站
    }
  }
})
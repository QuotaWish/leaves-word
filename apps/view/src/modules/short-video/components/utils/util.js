const Utils = {
  $stopPropagation(e) {
    e.stopImmediatePropagation()
    e.stopPropagation()
    e.preventDefault()
    e.cancelBubble = true
  },
  $getCss(curEle, attr) {
    let val = null,
      reg = null
    if ('getComputedStyle' in window) {
      val = window.getComputedStyle(curEle, null)[attr]
    } else {
      //ie6~8不支持上面属性
      //不兼容
      if (attr === 'opacity') {
        val = curEle.currentStyle['filter'] //'alpha(opacity=12,345)'
        reg = /^alphaopacity=(\d+(?:\.\d+)?)opacity=(\d+(?:\.\d+)?)$/i
        val = reg.test(val) ? reg.exec(val)[1] / 100 : 1
      } else {
        val = curEle.currentStyle[attr]
      }
    }
    // reg = /^(-?\d+(\.\d)?)(px|pt|em|rem)?$/i
    // return reg.test(val) ? parseFloat(val) : val
    return parseFloat(val)
  },
  $getCss2(curEle, attr) {
    let val = null,
      reg = null
    if ('getComputedStyle' in window) {
      val = window.getComputedStyle(curEle, null)[attr]
    } else {
      //ie6~8不支持上面属性
      //不兼容
      if (attr === 'opacity') {
        val = curEle.currentStyle['filter'] //'alpha(opacity=12,345)'
        reg = /^alphaopacity=(\d+(?:\.\d+)?)opacity=(\d+(?:\.\d+)?)$/i
        val = reg.test(val) ? reg.exec(val)[1] / 100 : 1
      } else {
        val = curEle.currentStyle[attr]
      }
    }
    // reg = /^(-?\d+(\.\d)?)(px|pt|em|rem)?$/i
    // return reg.test(val) ? parseFloat(val) : val
    return val
  },
  $setCss(el, key, value) {
    // console.log(value)
    if (key === 'transform') {
      //直接设置不生效
      el.style.webkitTransform =
        el.style.MsTransform =
          el.style.msTransform =
            el.style.MozTransform =
              el.style.OTransform =
                el.style.transform =
                  value
    } else {
      el.style[key] = value
    }
  },
}

export default Utils

import { debounce as _debounce, throttle as _throttle, isString } from 'lodash'
import { Dialog, Toast } from 'vant'

/**
 * 提示装饰器
 * @param {String | Object} message 需要提示用户的信息 或者 confirm 的配置
 * @param {Function} errorFn 请求异常的回调 返回this 使用function 则为你绑定
 */
export function confirm (message, errorFn = Function.prototype) {
  let config = {}
  isString(message) // 如果是字符串  那么只添加message
    ? config.message = message
    : config = message // 如果是对象 则自定义
  return function (target, name, descriptor) {
    const oldFn = descriptor.value
    descriptor.value = function (...args) {
      Dialog.confirm(config)
        .then(oldFn.apply(this, args))
        .catch(() => {
          globalWarn(`用户点击了取消:${name}`)
          if (errorFn) {
            errorFn.call(this, this)
          }
        })
    }
  }
}
/**
 * loading 开关装饰器
 * @param {String} loading 当前页面控制loading开关的字段名
 * @param {Function} errorCb 请求异常的回调 返回error 一般不用写
 * 如果 errorCb 为 function 为你绑定 this  如果是箭头函数 则第二个参数为this
 * @example
 * @loading('pageLoading',function(){that.demo = '123123'})
 * async getTable(){
 *  this.table =  this.$apis.demo()
 * }
 * @example
 * @loading('pageLoading',(error,that)=>{that.demo = '123123'})
 * async getTable(){
 *  this.table =  this.$apis.demo()
 * }
 */
export function loading (loading, errorCb = Function.prototype) {
  return function (target, name, descriptor) {
    const oldFn = descriptor.value
    descriptor.value = async function (...args) {
      try {
        this[loading] = true
        await oldFn.apply(this, args)
      } catch (error) {
        globalError(`${name}-----start-----${error}`)
        globalLog(error)
        globalError(`${name}-----end-----${error}`)
        errorCb.call(this, error, this)
      } finally {
        this[loading] = false
      }
    }
  }
}
/**
 * 全局提示
 * @param {String} 提示消息
 * @param {Function} errorCb
 */
export function toastLoading (message = '加载中...', errorCb = Function.prototype) {
  return function (target, name, descriptor) {
    const oldFn = descriptor.value
    descriptor.value = async function (...args) {
      const toast = Toast.loading({
        message,
        forbidClick: true, // 禁止背景点击
        duration: 0,
        loadingType: 'spinner'
      })
      try {
        await oldFn.apply(this, args)
      } catch (error) {
        globalError(`${name}-----start-----${error}`)
        globalLog(error)
        globalError(`${name}-----end-----${error}`)
        errorCb.call(this, error, this)
      } finally {
        toast.clear()
      }
    }
  }
}

/**
 * 打印所有函数的参数
 */
const consoleFormat = 'color:#000;background:#FF9900;padding:0 10px;'
export const log = (target, name, descriptor) => {
  const oldValue = descriptor.value
  descriptor.value = async function (...args) {
    globalLog(`${window.location.hash}页 执行函数%c${name}%c所有参数如下`, consoleFormat, '')
    for (let index = 0; index < args.length; index++) {
      globalLog(`%c参数${index + 1}:`, consoleFormat)
      globalLog(args[index])
    }
    globalLog('%c参数打印结束%c下面是下是函数运行数据', consoleFormat, '')
    await oldValue.apply(target, args)
  }
  return descriptor
}
/**
 *
 * @param {number} wait 需要延迟的毫秒数
 * @param {config} options
 * @typedef config {{
 *  leading:boolean,
 *  maxWait:number,
 *  trailing:boolean
 * }}
 */
export function debounceFn (wait = 500, options = {}) {
  return function (target, name, descriptor) {
    const oldFn = descriptor.value
    descriptor.value = _debounce(oldFn, wait, options)
  }
}

export function debounceFnStart (wait = 500) {
  return function (target, name, descriptor) {
    const oldFn = descriptor.value
    descriptor.value = _debounce(oldFn, wait, { leading: true, trailing: false })
  }
}

export function debounceFnEnd (wait = 500) {
  return function (target, name, descriptor) {
    const oldFn = descriptor.value
    descriptor.value = _debounce(oldFn, wait, { leading: false, trailing: true })
  }
}

/**
 *
 * @param {*} wait
 * @param {config} options
 * @typedef config {{
 *  leading:boolean,
 *  trailing:boolean,
 * }}
 */
export function throttleFn (wait = 500, options = { trailing: true, leading: true }) {
  return function (target, name, descriptor) {
    const oldFn = descriptor.value
    descriptor.value = _throttle(oldFn, wait, options)
  }
}

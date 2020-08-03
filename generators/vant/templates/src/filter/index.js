import Vue from 'vue'
import dayjs from 'dayjs'

/* 格式化金额 */
export const moneyFormat = (money) => {
  return money ? `${(money / 100).toFixed(2)}` : ''
}

Vue.filter('moneyFormat', moneyFormat)

/** 时间格式化 */

/**
 * format Date return YYYY-MM-DD
 * @param {dayjs} dayjsObject
 * @return {String} YYYY-MM-DD
 */
export const YYYY_MM_DD = _ => dayjs(_).format('YYYY-MM-DD')
Vue.filter('YYYY_MM_DD', YYYY_MM_DD)

/**
 * format Date return YYYY-MM-DD HH:mm
 * @param {dayjs} dayjsObject
 * @return {String} YYYY-MM-DD HH:mm
 */
export const YYYY_MM_DD_HH_MM = _ => dayjs(_).format('YYYY-MM-DD HH:mm')
Vue.filter('YYYY_MM_DD_HH_MM', YYYY_MM_DD_HH_MM)
/**
 * format Date return YYYY-MM-DD hh:mm:ss
 * @param {dayjs} dayjsObject
 * @return {String} YYYY-MM-DD hh:mm:ss
 */
export const YYYY_MM_DD_HH_MM_SS = _ => dayjs(_).format('YYYY-MM-DD HH:mm:ss')
Vue.filter('YYYY_MM_DD_HH_MM_SS', YYYY_MM_DD_HH_MM_SS)

/**
 * format Date return HH:mm:ss
 * @param {dayjs} dayjsObject
 * @return {String} HH:mm:ss
 */
export const HH_MM_SS = _ => dayjs(_).format('HH:mm:ss')
Vue.filter('HH_MM_SS', HH_MM_SS)
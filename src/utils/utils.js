/**
 * Created by longji on 2019/6/12.
 */
let utils = {}
var env = process.env.NODE_ENV === 'development' ? 'development'
  : process.env.VUE_APP_TITLE === 'test' ? 'test' : 'production'
switch (env) {
  case 'development':
    utils = {
      SupervisionIds: [485, 574, 451, 417],  // 测试用人员： 李宏，郑雪松, 徐凰耀， 朱思雨
    }
    break
  case 'test':
    utils = {
      SupervisionIds: [],
    }
    break
  case 'production':
    utils = {
      SupervisionIds: [485, 574, 451, 417],
    }
    break
}
export default utils

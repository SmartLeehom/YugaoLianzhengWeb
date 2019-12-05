/**
 * Created by longji on 2019/6/12.
 */
let utils = {}
var env = process.env.NODE_ENV === 'development' ? 'development'
  : process.env.VUE_APP_TITLE === 'test' ? 'test' : 'production'
switch (env) {
  case 'development':
    utils = {
      SupervisionIds: [485, 574],  // 测试用人员： 李宏，郑雪松
    }
    break
  case 'test':
    utils = {
      SupervisionIds: [],
    }
    break
  case 'production':
    utils = {
      SupervisionIds: [],
    }
    break
}
export default utils

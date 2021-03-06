/**
 * Created by longji on 2019/6/12.
 */
let baseUrl = {} // 这里是一个默认的url，可以没有
var env = process.env.NODE_ENV === 'development' ? 'development'
    : process.env.VUE_APP_TITLE === 'test' ? 'test' : 'production'
switch (env) {
    case 'development':
        baseUrl = {
          localUrl: 'http://localhost:8081/',
          fileUrl: 'http://localhost:8081/lianzheng/api/file/preview?',
          //localUrl: 'http://222.180.168.215:8081/yugaoapi/',
            // localUrl: 'http://zxsj.zdwa.com/yugaoapi/',
            // localUrl: 'http://topiano.mynatapp.cc/yugaoapi/',
            // localUrl: 'https://lujar.imdo.co/yugaoapi',
            // localUrl: 'http://qmr.natapp1.cc/yugaoapi/',
            // localUrl: 'https://lujar.imdo.co/yugaoapi/',
            engineerUrl: 'http://222.180.168.215:9104/',
            serverUrl: 'http://localhost:8081/lianzheng/api/'
        } // 这里是本地的请求url
      /*baseUrl = {
        localUrl: 'http://222.180.168.215:18090/',
        fileUrl: 'http://222.180.168.215:18090/lianzheng/api/file/preview?',
        serverUrl: 'http://222.180.168.215:18090/lianzheng/api/'
      } // 生产环境url*/
        break
    case 'test': // 注意这里的名字要和步骤二中设置的环境名字对应起来
        baseUrl = {
          localUrl: 'http://222.180.168.215:18090/',
          fileUrl: 'http://222.180.168.215:18090/lianzheng/api/file/preview?',
          serverUrl: 'http://222.180.168.215:18090/lianzheng/api/'
        } // 这里是测试环境中的url
        break
    case 'production':
        baseUrl = {
          localUrl: 'http://222.180.168.215:18090/',
          fileUrl: 'http://222.180.168.215:18090/lianzheng/api/file/preview?',
          serverUrl: 'http://222.180.168.215:18090/lianzheng/api/'
        } // 生产环境url
        break
}
export default baseUrl

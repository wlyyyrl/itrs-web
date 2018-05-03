// eslint-disable-next-line
import objectToFormData from 'object-to-formdata';
import axios from 'axios';

/**
 * 通用处理axios promise，方便回调
 * 
 * @param {Promise} promise axios promise
 * @param {Function} success 成功回调，会塞入服务端返回的信息
 * @param {Function} fail 失败回调，会塞入axios原始错误对象
 */
function handlePromise(promise, success, fail) {
  promise
    .then((result) => {
      if (success) {
        success(result.data);
      }
    })
    .catch((result) => {
      if (fail) {
        fail(result);
      }
    });
}

const API_BASE_URL = 'http://localhost:8080';

/**
 * Itrs系统Api封装
 */
class ItrsLoginApi {

  /**
   * 登录接口。
   * 登录成功：
   * {
   *     "status": 200,
   *     "sessionKey": "9d7c3a90-9407-43a0-bf78-fff2584e9818",
   *     "username": "x4x",
   *     "realName": "realName",
   *     "sex": "1"
   * }
   * 回调参数：
   * {
   *     "sessionKey": "9d7c3a90-9407-43a0-bf78-fff2584e9818",
   *     "username": "x4x",
   *     "realName": "realName",
   *     "sex": "1"
   * }
   * 
   * 登录失败：
   * {
   *     "timestamp": 1524990088495,
   *     "status": 401,
   *     "error": "Unauthorized",
   *     "message": "Authentication Failed: Cannot authenticate x4x",
   *     "path": "/auth/login"
   * }
   * 回调参数：
   * {
   *     "timestamp": 1524990088495,
   *     "status": 401,
   *     "error": "Unauthorized",
   *     "message": "Authentication Failed: Cannot authenticate x4x"
   * }
   * 
   * @param {Object} data 目前必须包含username和password字段
   * @param {Function} success 成功回调
   * @param {Function} fail 失败回调
   */
  static login(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/auth/login',
      method: 'post',
      params: {
        username: data.username,
        password: data.password
      },
      withCredentials: true
    });

    function wrappedSuccess(data) {
      var info = {
        sessionKey: data.sessionKey,
        username: data.username,
        realName: data.realName,
        sex: data.sex
      };
      success(info);
    }

    function wrappedFail(error) {
      
      if (error.response) {
        var data = error.response.data;
        var info = {
          timestamp: data.timestamp,
          status: data.status,
          error: data.error,
          message: data.message
        };
        fail(info);
      } else {
        fail(error);
      }
    }
    handlePromise(promise, wrappedSuccess, wrappedFail);
    return promise;
  }

  /**
   * 登出。没有返回数据，通过HTTP Code判断是否成功
   * 
   * @param {Object} data 参数
   * @param {Function} success 成功回调
   * @param {Function} fail 失败回调
   */
  static logout(success, fail) {
    const promise = axios(API_BASE_URL + '/auth/logout', {
      withCredentials: true
    });
    handlePromise(promise, success, fail);
  }

  /**
   * 检查登录状态。
   * 成功返回：
   * {
   *     "success":true,
   *     "message":"You are logged in.",
   *     "data":{
   *         "sessionKey":"3d19b6c7-99d0-4b9a-9e71-690d9ccb683f",
   *         "id":37,
   *         "userName":"x4x",
   *         "email":"wlyyy@163.com",
   *         "roles":[],
   *         "sex":1,
   *         "departmentId":1,
   *         "realName":"姓名",
   *         "loginTime":"2018-04-02 11:11:11",
   *         "refreshTime":"2018-04-02 11:11:11"
   *     }
   * }
   * 
   * 失败返回：
   * {
   ×     "success": false,
   ×     "message": "You are NOT logged in."
   × }
   * 
   * @param {Function} success 成功回调
   * @param {Function} fail 失败回调
   */
  static checkStatus(success, fail) {
    const promise = axios(API_BASE_URL + '/auth/check-status', {
      withCredentials: true
    });
    
    function wrappedSuccess(successData) {
      if (successData.success) {
        success(successData.data);
      } else {
        fail(successData);
      }
    }
    handlePromise(promise, wrappedSuccess, fail);
  }
}

export default ItrsLoginApi;

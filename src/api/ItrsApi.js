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

/**
 * Itrs系统Api封装
 */
class ItrsApi {

  /**
   * 获取用户接口。
   * 成功返回格式：
   * {
   *   success: true,
   *   message: "Get success.",
   *   data: {
   *     id: 1,
   *     userName: "wlyyy",
   *     email: "wlyyy@163.com",
   *     gmtCreate: "2020-02-02",
   *     gmtModify: "2020-03-03",
   *     realName: "大宝宝",
   *     departmentId: 1,
   *     sex: 2
   *   }
   * }
   * 
   * @param {Number} id id
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static getUser(id, success, fail) {
    const promise = axios({
      url: 'http://localhost:8080/user/' + id,
      method: 'get'
    });
    handlePromise(promise, success, fail);
    return promise;
  }
}

export default ItrsApi;
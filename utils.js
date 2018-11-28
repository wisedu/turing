import axios from 'axios'
// import moment from 'moment'

// const UA = navigator.userAgent.toLowerCase()

function serialize(data) {
  if (!data) return '';
  var pairs = [], value;
  for (var name in data) {
    if (!data.hasOwnProperty(name)) continue;
    if (typeof data[name] === 'function') continue;
    value = String(data[name]);
    name = encodeURI(name);
    value = encodeURI(value);
    pairs.push(name + '=' + value);
  }
  if (pairs.length) {
    return pairs.join('&');
  } else {
    return ''
  }
}

// function getApi (name) {
//   return api[name] || name
// }
let utils = {};

/**
 * @method Post
 * @description post请求
 * @param {String} url - 请求地址，可以是api中定义的名称，或者具体的url地址
 * @param {Object} data - 请求参数
 * @param {*} config - 请求配置，详见axios文档 [https://github.com/mzabriskie/axios]
 */
utils.Post = (url, data = null, config = {}) => {
  return axios({
    method: 'post',
    url: url,
    data: data,
    withCredentials: true,
    headers: {
      contentType: "application/json"
    },
    ...config
    // adapter: config.mockFlag ? () => MOCK_DATA[config.mock] : null
  })
}

/**
 * @method Get
 * @description get请求, 判断运行环境为今日校园时，使用原生壳子提供的get方法（此方法可以解决跨域问题）；若运行环境不是今日校园，则使用axios的get请求方法
 * @param {String} url - 请求地址，可以是api中定义的名称，或者具体的url地址
 * @param {Object} data - 请求参数
 * @param {*} config - 运行环境是今日校园时，此参数为header参数；运行环境不是今日校园时，此参数为请求配置，详见axios文档 [https://github.com/mzabriskie/axios]；
 */
utils.Get = (url, data = null, config = {}) => {
  return axios({
    method: 'get',
    url: url + (url.indexOf("?") > -1 ? "&" : "?") + serialize(data),
    ...config
  })
}

utils.Delete = (url, data = null, config = {}) => {
  return axios({
    method: 'delete',
    url: url,
    params: serialize(data),
    ...config
  })
}
 

utils.getUrlParam = function (name) {
  if (name === undefined) {
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();  
    if (url.indexOf("?") != -1) {  
      var str = url.substr(1);  
      var strs = str.split("&");  
      for(var i = 0; i < strs.length; i ++) {  
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
      }  
    } 
    return theRequest;
  } else {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }
}

utils.setFullUrl = function (url, prefix) {
  if ([".", "/"].indexOf(url.substring(0, 1)) > -1) {
    return prefix + url;
  } else {
    return url;
  }
}

utils.getContextPath = function(isFullPath) {
  var pathName = window.location.pathname;
  var index = pathName.substr(1).indexOf("/");
  var result = pathName.substr(0,index+1);

  if (isFullPath === false) {
    return result;
  } else {
    return window.location.origin + result;
  }
}

utils.cleanProps = function(data) {
  for(let prop in data) {
    if (data[prop] === undefined || data[prop] === null || data[prop] === "") {
      delete data[prop];
    }
  }
  return data;
} 

utils.toTreeData = function (data, parent_id, options) {
  let opt = options || {ukey:"id", pkey:'parent_id', toCKey:'children'}
  var tree = [];
  var temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i][opt.pkey] == parent_id || data[i][opt.ukey] === data[i][opt.pkey]) {
      var obj = data[i];
      temp = utils.toTreeData(data, data[i][opt.ukey], opt);
      if (temp.length > 0) {
        obj[opt.toCKey] = temp;
      }
      tree.push(obj);
    }
  }
  return tree;
}

//---extend

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};


utils.extend = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};

/**
 * 向父页面发送消息
 * @param data
 * @param data.type {string} 要发送的message类型
 * @param data.data {object} 要发送的数据
 */
utils.sendMessageToParent = function (data) {
    var type = data.type;
    var sendData = data.data;
    var guid = _createGuid();
    guid = '_send_message_flag_'+guid;
    //在当前页面中添加标识
    window[guid] = guid;

    var href = window.location.href;
    //将标识和链接地址发给父页面
    sendData['_send_message_href_'] = href;
    sendData['_send_message_flag_'] = guid;

    parent.postMessage({
        type: type,
        data: sendData
    },'*');
};

// /**
//  * 向父页面发送消息
//  * @param data
//  * @param data.container {selector} 页面容器
//  */
// utils.sendMessageToResetCardHeight = function (data) {
//     var pageContainerSelector = data.container;
//     var container = document.querySelector(pageContainerSelector);
//     var height = 0;
//     if(container){
//         height = container.scrollHeight;
//     }else{
//         return;
//     }

//     var sendData = {};
//     var guid = _createGuid();
//     guid = '_send_message_flag_'+guid;
//     //在当前页面中添加标识
//     window[guid] = guid;

//     var href = window.location.href;
//     //将标识和链接地址发给父页面
//     sendData['_send_message_href_'] = href;
//     sendData['_send_message_flag_'] = guid;
//     sendData['height'] = height;

//     parent.postMessage({
//         type: 'portals-card-height-reset',
//         data: sendData
//     },'*');
// };

function _createGuid() {
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "_" + S4() + "_" + S4() + "_" + S4() + "_" + S4() + S4() + S4());
}

export default utils;
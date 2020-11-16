# 22

```ts
function transformRequest(data) {
  let ret = '';
  for (const it in data) {
    let _temp = data[it] === null || data[it] === undefined ? '' : data[it];

    if (typeof _temp === 'object') {
      _temp = JSON.stringify(_temp);
    }

    ret += encodeURIComponent(it) + '=' + encodeURIComponent(_temp) + '&';
  }
  ret = ret.substring(0, ret.length - 1);
  return ret;
}

const __axios = (axios) => {
  const factory = (keyList, keys) => {
    return keyList.reduce((acc, key) => {
      acc[key[0]] = (params) => {
        const url = keys[key[0]];
        return axios({
          method: 'post',
          url,
          data: params,
          transformRequest: [transformRequest],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      };
      return acc;
    }, {});
  };

  return {
    factory,
  };
};

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    console.log(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// http response 拦截器
  instance.interceptors.response.use(
    (response) => {
      const data = response.data;
      if (data.code === 200) {
        return data.result;
      } else {
        console.warn(data);
        return data;
      }
    },
    (err) => {
      // 返回状态码不为200时候的错误处理
      console.error(err.toString());
      return Promise.resolve(err);
    }
  );
```

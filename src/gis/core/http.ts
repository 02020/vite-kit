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

const axios = (axios) => {
  const instance = axios.create({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [transformRequest],
  });

  instance.interceptors.response.use(
    (response) => {
      let data = response.data;
      data = typeof data === 'object' ? data : JSON.parse(data);
      // 对 data 进行任意转换处理
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

  instance.factory = (keyList, keys) => {
    return keyList.reduce((acc, key) => {
      acc[key[0]] = (data) => {
        const url = keys[key[0]];
        return instance({ method: 'post', url, data });
      };
      return acc;
    }, {});
  };

  instance.upload = (url, data) => {
    return axios({
      method: 'post',
      url,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return instance;
};

export { axios };

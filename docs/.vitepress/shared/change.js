/** @format */

const isObject = (val) => val !== null && typeof val === 'object';

const fileName = (path) => {
  if (!path) return '';
  var paths = path.split('/');
  return paths[paths.length - 1];
};

const fn = (x, m, prefix) => {
  if (isObject(x)) {
    return {
      text: x.title,
      children: x.children.map((c) => {
        return fn(c, m, prefix);
      }),
    };
  } else {
    let name = m.find((n) => n.value == fileName(x));
    let text = name ? name.text : fileName(x);
    return {
      text,
      link: '/' + prefix + x,
    };
  }
};

const fn2 = (x, prefix) => {
  return {
    text: x.title,
    children: x.children.map((c) => {
      if (isObject(c)) {
        return fn(c, prefix);
      } else {
        return { text: fileName(c), link: '/' + prefix + c.substr(1) };
      }
    }),
  };
};

const toConfig3 = (config, m, prefix) => {
  return config.map((x) => fn(x, m, prefix));
};

module.exports = { toConfig3 };

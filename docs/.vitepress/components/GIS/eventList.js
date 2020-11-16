/** @format */

const eventList = [
  {
    key: 'clear',
    title: '清空日志',
    fn: function(ev) {
      this.logs.splice(0, this.logs.length);
    },
  },
  {
    key: 'active',
    title: '接收点击',
    fn: function(ev) {
      this.gis.on('gis-click', this.onClickTest);
    },
  },
  {
    key: 'remove',
    title: '移除点击',
    fn: function(ev) {
      this.gis.off('gis-click', this.onClickTest);
    },
  },
  {
    key: 'removeAll',
    title: '移除所有',
    fn: function(ev) {
      this.gis.off('gis-click');
    },
  },
  {
    key: 'toggle',
    title: '切换',
    fn: function(ev) {
      this.gis.toggle('gis-click', this.onClickTest, false);
    },
  },
  {
    key: 'only1',
    title: '只启用当前1',
    fn: function(ev) {
      this.gis.only('gis-click', this.onClickOnly);
    },
  },
  {
    key: 'only2',
    title: '只启用当前2',
    fn: function(ev) {
      this.gis.only('gis-click', this.onClickOnly2);
    },
  },
  {
    key: 'removeOnly1',
    title: '移除only1',
    fn: function(ev) {
      this.gis.off('gis-click', this.onClickOnly);
    },
  },
  {
    key: 'removeOnly2',
    title: '移除only2',
    fn: function(ev) {
      this.gis.off('gis-click', this.onClickOnly2);
    },
  },
];

export { eventList };

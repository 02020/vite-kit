/** @format */
import mitt, { Emitter, EventType, Handler } from './mitt';
import { isFunction } from '../../shared';

export default class Bus {
  emitter: Emitter;
  constructor() {
    this.emitter = mitt();
  }
  /**
   * 启用或暂停消息分发
   * @param type 事件名称
   * @param value:true,false
   */
  toggle(type, fn: any, value: boolean) {
    if (isFunction(fn)) {
      this.emitter.toggle(type, fn, value);
    } else {
      this.emitter.toggle(type, null, fn);
    }
  }

  /**
   * 监听
   * @param args
   */
  on(...args) {
    // console.log(args)
    if (args.length == 3) {
      this.emitter.on(args[0] + '-' + args[1], args[2]);
    } else {
      this.emitter.on(args[0], args[1]);
    }
  }
  /**
   * 监听
   * @param args
   */
  only(...args) {
    // console.log(args)
    if (args.length == 3) {
      this.emitter.only(args[0] + '-' + args[1], args[2]);
    } else {
      this.emitter.only(args[0], args[1]);
    }
  }

  once(...args) {
    let type: EventType;
    let handler: Handler<any>;
    if (args.length == 3) {
      type = args[0] + '-' + args[1];
      handler = args[2];
    } else {
      type = args[0];
      handler = args[1];
    }
    let temp = (...params) => {
      handler.apply(null, params);
      this.emitter.off(type, temp);
    };

    this.emitter.on(type, temp);
  }

  emit(message, data) {
    this.emitter.emit(message, data);
  }

  off(type: EventType, handler: Handler) {
    this.emitter.off(type, handler);
  }
}

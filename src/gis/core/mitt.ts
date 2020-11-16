/** @format */

export type EventType = string | symbol;

// An event handler can take an optional event argument
// and should not return a value
export interface Handler<T = any> {
  (event?: T): void;
  active?: boolean;
}
export type WildcardHandler = (type: EventType, event?: any) => void;

// An array of all currently registered event handlers for a type
export type EventHandlerList = Array<Handler>;
export type WildCardEventHandlerList = Array<WildcardHandler>;

// A map of event types and their corresponding event handlers.
export type EventHandlerMap = Map<
  EventType,
  EventHandlerList | WildCardEventHandlerList
>;

export interface Emitter {
  all: EventHandlerMap;

  on<T = any>(type: EventType, handler: Handler<T>): void;
  on(type: '*', handler: WildcardHandler): void;

  only<T = any>(type: EventType, handler: Handler<T>): void;

  off<T = any>(type: EventType, handler?: Handler<T>): void;
  off(type: '*', handler?: WildcardHandler): void;

  emit<T = any>(type: EventType, event?: T): void;
  emit(type: '*', event?: any): void;

  toggle<T = any>(type: EventType, fn: any, flag?: boolean): void;
}

/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
export default function mitt(all?: EventHandlerMap): Emitter {
  all = all || new Map();
  let onlyMap = new Map();

  const toggle = function (
    target: EventHandlerMap,
    type: EventType,
    fn: any,
    flag?: boolean
  ) {
    const handlers = target.get(type);
    if (handlers && handlers.length) {
      handlers.forEach((handler) => {
        flag = flag || !handler.active;
        if (fn == handler) {
          handler.active = !flag;
        } else {
          handler.active = flag;
        }
      });
    }
  };

  return {
    /**
     * A Map of event names to registered handler functions.
     */
    all,

    /**
     * Register an event handler for the given type.
     * @param {string|symbol} type Type of event to listen for, or `"*"` for all events
     * @param {Function} handler Function to call in response to given event
     * @memberOf mitt
     */
    on<T = any>(type: EventType, handler: Handler<T>) {
      handler.active = true;
      const handlers = all.get(type);
      if (handlers) {
        if (handlers.indexOf(handler) < 0) {
          handlers.push(handler);
        }
      } else {
        all.set(type, [handler]);
      }
    },

    /**
     * Register an event handler for the given type.
     * @param {string|symbol} type Type of event to listen for, or `"*"` for all events
     * @param {Function} handler Function to call in response to given event
     * @memberOf mitt
     */
    only<T = any>(type: EventType, handler: Handler<T>) {
      handler.active = true;
      const handlers = onlyMap.get(type);
      if (handlers) {
        if (handlers.indexOf(handler) < 0) {
          handlers.unshift(handler);
        } else {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
          handlers.unshift(handler);
        }
      } else {
        onlyMap.set(type, [handler]);
      }
    },

    /**
     * Remove an event handler for the given type.
     * @param {string|symbol} type Type of event to unregister `handler` from, or `"*"`
     * @param {Function} handler Handler function to remove
     * @memberOf mitt
     */
    off<T = any>(type: EventType, handler?: Handler<T>) {
      let handlers = onlyMap.get(type);
      if (!handlers) {
        handlers = all.get(type);
      }
      if (handlers) {
        if(handler === void 0 ){
          handlers.splice(0, handlers.length);
        }else{
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        }
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing "*" handlers is not supported.
     *
     * @param {string|symbol} type The event type to invoke
     * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
     * @memberOf mitt
     */
    emit<T = any>(type: EventType, evt: T) {
      const handlers = onlyMap.get(type);
      if (handlers && handlers.length) {
        handlers[0].active && handlers[0](evt);
      } else {
        ((all.get(type) || []) as EventHandlerList).slice().map((handler) => {
          handler.active && handler(evt);
        });
      }
      ((all.get('*') || []) as WildCardEventHandlerList)
        .slice()
        .map((handler) => {
          handler(type, evt);
        });
    },

    toggle<T = any>(type: EventType, fn: any, flag?: boolean) {
      toggle(all, type, fn, flag);
      toggle(onlyMap, type, fn, flag);
    },
  };
}

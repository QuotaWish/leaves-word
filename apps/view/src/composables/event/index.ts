/**
 * 基于类的事件系统
 */

export interface LeafEvent {
  name: string;
}

// 事件监听器接口
export interface EventListener<T extends LeafEvent> {
  handleEvent: (event: T) => void;
}

// 事件管理器
class EventManager {
  private readonly listeners: Map<string, EventListener<LeafEvent>[]> = new Map();

  /**
   * 注册事件监听器
   */
  public registerListener<T extends LeafEvent>(
    EventClass: LeafEvent,
    listener: EventListener<T>,
  ): void {
    const eventName = EventClass.name;
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)?.push(listener as EventListener<LeafEvent>);
  }

  /**
   * 触发事件
   */
  public fireEvent<T extends LeafEvent>(event: T): void {
    const eventListeners = this.listeners.get(event.name) || [];
    for (const listener of eventListeners) {
      listener.handleEvent(event);
    }
  }

  /**
   * 注销事件监听器
   */
  public unregisterListener<T extends LeafEvent>(
    EventClass: { prototype: { eventName: string } },
    listener?: EventListener<T>,
  ): void {
    const eventName = EventClass.prototype.eventName;
    if (!listener) {
      this.listeners.delete(eventName);
      return;
    }

    const listeners = this.listeners.get(eventName);
    if (listeners) {
      this.listeners.set(
        eventName,
        listeners.filter(l => l !== listener),
      );
    }
  }
}

// 创建全局事件管理器实例
const eventManager = new EventManager();

/**
 * Hook用于在组件中访问事件管理器
 */
export function useLeafEventBus(): EventManager {
  return eventManager;
}

console.log("%cinit event listener", "color: #0000ff")
// 消息接收事件
// export class MessageReceivedEvent implements LeafEvent {
//   public readonly eventName = 'message:received';

//   constructor(
//     public readonly id: number,
//     public readonly content: string,
//     public readonly timestamp: number,
//   ) {}
// }

// 使用示例：
/*
// 注册一个Toast事件监听器
const toastListener: EventListener<ToastEvent> = {
  handleEvent: event => {
    console.log(`显示Toast: ${event.message}, 类型: ${event.type}`);
  },
};

const eventBus = useLeafEventBus();
eventBus.registerListener(ToastEvent, toastListener);

// 触发一个Toast事件
eventBus.fireEvent(new ToastEvent('操作成功', 'success'));

// 注销监听器
eventBus.unregisterListener(ToastEvent, toastListener);
*/

import type { ToastEvent } from './event/toast-event';
import { useLeafEventBus } from './event';

export function sendToast(event: ToastEvent) {
  const eventBus = useLeafEventBus();

  eventBus.fireEvent(event)
}

import type { LeafEvent } from '.';

export class ToastEvent implements LeafEvent {
  public readonly name = 'ToastEvent';

  constructor(
    public readonly message: string,
    public readonly type: 'success' | 'error' | 'warning' | 'info',
  ) { }
}

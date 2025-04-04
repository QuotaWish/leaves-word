import type { LeafEvent } from '.';

export class ToastEvent implements LeafEvent {
  public readonly name = 'ToastEvent';

  constructor(
    public readonly message: string,
    public readonly type: 'success' | 'error' | 'warning' | 'info',
  ) { }
}

export class AuthSuccessEvent implements LeafEvent {
  public readonly name = 'AuthSuccessEvent';

  constructor(
    public readonly userId: number,
    public readonly userName: string,
  ) { }
}

export class AuthLogoutEvent implements LeafEvent {
  public readonly name = 'AuthLogoutEvent';
}

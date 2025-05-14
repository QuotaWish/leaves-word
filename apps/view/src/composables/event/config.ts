import type { LeafEvent } from '.';

export class UserConfigSaveEvent implements LeafEvent {
  public readonly name = 'UserConfigSaveEvent';

  constructor(
    public readonly executor?: string,
  ) { }
}

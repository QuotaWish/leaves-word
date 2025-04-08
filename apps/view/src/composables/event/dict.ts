import type { LeafEvent } from '.';

export class DictionaryUpdateEvent implements LeafEvent {
  public readonly name = 'DictionaryUpdateEvent';

  constructor(
    public readonly id: string,
  ) { }
}

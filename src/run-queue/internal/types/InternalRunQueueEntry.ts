import type { RunQueueEntry } from '../../types/entry';

export interface InternalRunQueueEntry<T = any> extends RunQueueEntry<T> {
  /** A technical but human-readable ID of the entry */
  readonly id: string;
  /** Lower number is higher priority */
  readonly priority: number;
  /** If `true`, this entry can't be canceled */
  readonly neverCancel: boolean;

  /** Tries to cancel this entry */
  readonly cancel: () => boolean;
  /** Called if an error occurred while running this entry */
  readonly reject: (e: any) => void;
  /** Called when this entry is completed */
  readonly resolve: (value: T) => void;
  /** Runs this entry */
  readonly run: () => Promise<T> | T;
}

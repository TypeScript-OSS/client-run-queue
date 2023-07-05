import { getStatsHandler } from '../../config/stats-handler';
import { CANCELED } from '../consts';
import type { RunQueue } from '../queue';
import type { RunQueueEntryResult } from '../types/entry';
import type { InternalRunQueueEntry } from './types/InternalRunQueueEntry';

export class InternalRunQueueEntryImpl<T = any> implements InternalRunQueueEntry<T> {
  public readonly id: string;
  public readonly priority: number;
  public readonly neverCancel: boolean;
  public readonly promise: Promise<RunQueueEntryResult<T>>;

  public wasCanceled_ = false;
  public wasCompleted_ = false;
  public wasStarted_ = false;

  private queue_: RunQueue;
  private resolver_!: (value: RunQueueEntryResult<T> | PromiseLike<RunQueueEntryResult<T>>) => void;
  private runner_: () => Promise<T> | T;

  constructor(queue: RunQueue, id: string, priority: number, neverCancel: boolean, run: () => Promise<T> | T) {
    this.queue_ = queue;
    this.id = id;
    this.priority = priority;
    this.neverCancel = neverCancel;
    this.runner_ = run;

    this.promise = new Promise<RunQueueEntryResult<T>>((resolve) => {
      this.resolver_ = resolve;
    });
  }

  public wasCanceled() {
    return this.wasCanceled_;
  }

  public wasCompleted() {
    return this.wasCompleted_;
  }

  public wasStarted() {
    return this.wasStarted_;
  }

  public cancel() {
    if (this.wasCanceled_ || this.wasCompleted_ || this.neverCancel) {
      return false;
    }

    this.wasCanceled_ = true;
    this.resolver_({ ok: false, details: CANCELED });

    getStatsHandler().trackRunQueueDidCancelEntry?.({ runQueue: this.queue_, entryId: this.id });

    return true;
  }

  public resolve(value: T) {
    if (this.wasCompleted_ || this.wasCanceled_) {
      return;
    }

    this.wasCompleted_ = true;
    this.resolver_({ ok: true, details: value });
  }

  public reject(e: any) {
    if (this.wasCompleted_ || this.wasCanceled_) {
      return;
    }

    this.wasCompleted_ = true;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.resolver_({ ok: false, details: e });
  }

  public run() {
    this.wasStarted_ = true;
    return this.runner_();
  }
}

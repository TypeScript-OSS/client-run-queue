/**
 * The result of an entry.
 *
 * - Successfully completed entries will have `ok: true` and the `details` field will contain the resulting value.
 * - Canceled entries will have `ok: false` and `details: CANCELED`
 * - Unsuccessfully completed entries that haven't been canceled will have `ok: false` and the `details` field may contain a caught value
 */
export type RunQueueEntryResult<T> = { ok: true; details: T } | { ok: false; details: unknown };

/** An entry reference, which can be used to cancel the entry, check its status, or to get the promised value. */
export interface RunQueueEntry<T> {
  /** The promised value */
  promise: Promise<RunQueueEntryResult<T>>;

  /**
   * Tries to cancel the entry.  Cancelation may not be possible if:
   * - the entry is already canceled or completed
   * - the entry is marked as `neverCancel`
   */
  cancel: () => void;

  /** If `true`, the entry was canceled.  It may or may not have already been started. */
  wasCanceled: () => boolean;
  /**
   * If `true`, the entry was completed either successfully or not.  `wasStarted` will always be `true` if `wasCompleted` is true.
   * `wasCanceled` will never be true if `wasCompleted` is true.
   */
  wasCompleted: () => boolean;
  /** If `true`, the entry was started.  It may or may not also be either canceled or completed. */
  wasStarted: () => boolean;
}

/** Options to effect the processing of this entry */
export interface RunQueueScheduleOptions {
  /** If specified, the entry isn't scheduled until after an initial delay */
  delayMSec?: number;
  /**
   * If `true`, this entry ignores cancelation attempts.
   *
   * @defaultValue `false`
   */
  neverCancel?: boolean;
}

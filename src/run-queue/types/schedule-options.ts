/** Options to effect the processing of this entry */
export interface RunQueueScheduleOptions {
  /**
   * If `true`, this entry ignores cancelation attempts.
   *
   * @defaultValue `false`
   */
  neverCancel?: boolean;
}

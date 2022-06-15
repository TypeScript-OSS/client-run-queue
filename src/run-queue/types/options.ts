/** Options for customizing the behavior of queues */
export interface RunQueueOptions {
  /**
   * The maximum number of entries that can be processed in a single run iteration.
   *
   * @defaultValue Number.MAX_SAFE_INTEGER
   */
  continuousWorkMaxEntries?: number;
  /**
   * The amount of time that can be used for processing in a single run iteration.
   *
   * @defaultValue 10
   */
  continuousWorkTimeLimitMSec?: number;
  /**
   * The maximum number of entries that can be executed at once.
   *
   * @defaultValue 1
   */
  maxParallel?: number;
}

/* istanbul ignore file */

import type { RunQueue } from '../run-queue/queue';

export interface StatsHandler {
  /** Called whenever cancelAll is called on RunQueue */
  trackRunQueueDidCancelAllCancelableEntries?: (args: { runQueue: RunQueue; numEntriesCanceled: number }) => void;
  /** Called whenever a RunQueue entry is actually canceled */
  trackRunQueueDidCancelEntry?: (args: { runQueue: RunQueue; entryId: string }) => void;
  /** Called at the end of every RunQueue processing iteration */
  trackRunQueueDidCompleteIteration?: (args: { runQueue: RunQueue; durationMSec: number; numEntriesProcessed: number }) => void;
  /** Called after each RunQueue entry is processed */
  trackRunQueueDidProcessEntry?: (args: { runQueue: RunQueue; entryId: string; durationMSec: number; success: boolean }) => void;
  /** Called for each scheduled RunQueue entry */
  trackRunQueueDidSchedule?: (args: { runQueue: RunQueue; entryId: string }) => void;
}

const defaultStatsHandler: Readonly<StatsHandler> = Object.freeze({});

let globalStatsHandler: Readonly<StatsHandler> = defaultStatsHandler;

export const getStatsHandler = () => globalStatsHandler;

/** Resets the stats handler back to its default state, which is an empty object */
export const resetStatsHandler = () => {
  globalStatsHandler = defaultStatsHandler;
};

/**
 * Registers tracking functions that will be called throughout use, usually for debugging or collecting performance and usage stats.
 *
 * It's best not to set this in a production environment.
 */
export const setStatsHandler = (statsHandler: Readonly<StatsHandler>) => {
  globalStatsHandler = Object.freeze({ ...statsHandler });
};

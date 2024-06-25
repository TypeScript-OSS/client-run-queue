import { sleep } from '../../__test_dependency__/sleep.js';
import { resetStatsHandler, setStatsHandler } from '../../config/stats-handler.js';
import { DEFAULT_PRIORITY } from '../consts.js';
import { DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC } from '../internal/consts.js';
import { RunQueue } from '../queue.js';

describe('RunQueue', () => {
  describe('with default settings', () => {
    let q: RunQueue;

    beforeEach(() => {
      q = new RunQueue('test');
    });

    afterEach(() => {
      q.cancelAll();
    });

    it('running a single sync function should be completed after 0ms sleep', async () => {
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', () => 1);

      expect(entry.wasCompleted()).toBeFalsy();

      await sleep(0);

      expect(entry.wasCompleted()).toBeTruthy();
      expect(await entry.promise).toMatchObject({ ok: true, details: 1 });
    });

    it('running three very simple async functions should be completed in a single run queue iteration', async () => {
      let numRunQueueIterations = 0;
      setStatsHandler({
        trackRunQueueDidCompleteIteration: ({ runQueue }) => {
          if (runQueue === q) {
            numRunQueueIterations += 1;
          }
        }
      });
      try {
        const entries = [1, 2, 3].map((value) => q.schedule(DEFAULT_PRIORITY, `test${value}`, async () => value));

        for (const entry of entries) {
          expect(entry.wasCompleted()).toBeFalsy();
        }

        await Promise.all(entries.map((entry) => entry.promise));

        // Can be called right before the iteration stat is updated or right after
        expect(numRunQueueIterations).toBeLessThanOrEqual(1);

        let entryIndex = 0;
        for (const entry of entries) {
          expect(entry.wasCompleted()).toBeTruthy();
          expect(await entry.promise).toMatchObject({ ok: true, details: entryIndex + 1 });
          entryIndex += 1;
        }
      } finally {
        resetStatsHandler();
      }
    });

    it('running three async functions that each take longer than the continuousWorkTimeLimitMSec limit should take three run queue iterations', async () => {
      let numRunQueueIterations = 0;
      setStatsHandler({
        trackRunQueueDidCompleteIteration: ({ runQueue }) => {
          if (runQueue === q) {
            numRunQueueIterations += 1;
          }
        }
      });
      try {
        const entries = [1, 2, 3].map((value) =>
          q.schedule(DEFAULT_PRIORITY, `test${value}`, async () => {
            // + 1 to make sure it exceeds DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC
            await sleep(DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC + 1);
            return value;
          })
        );

        for (const entry of entries) {
          expect(entry.wasCompleted()).toBeFalsy();
        }

        await Promise.all(entries.map((entry) => entry.promise));

        // Can be called right before the last iteration stat is updated or right after
        expect(numRunQueueIterations).toBeGreaterThanOrEqual(2);

        let entryIndex = 0;
        for (const entry of entries) {
          expect(entry.wasCompleted()).toBeTruthy();
          expect(await entry.promise).toMatchObject({ ok: true, details: entryIndex + 1 });
          entryIndex += 1;
        }
      } finally {
        resetStatsHandler();
      }
    });
  });
});

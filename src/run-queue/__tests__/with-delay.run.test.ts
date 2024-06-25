import { sleep } from '../../__test_dependency__/sleep.js';
import { DEFAULT_PRIORITY } from '../../run-queue/consts.js';
import { RunQueue } from '../../run-queue/queue.js';

describe('RunQueue', () => {
  describe('when scheduling with delay', () => {
    let q: RunQueue;

    beforeEach(() => {
      q = new RunQueue('test');
    });

    afterEach(() => {
      q.cancelAll();
    });

    it('running a function with 50ms delay should be completed soon after 50ms', async () => {
      const start = performance.now();
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', () => 1, { delayMSec: 50 });

      expect(entry.wasCompleted()).toBeFalsy();

      while (performance.now() - start < 50) {
        if (performance.now() - start < 50) {
          expect(entry.wasStarted()).toBeFalsy();
        }

        await sleep(10);
      }
      await sleep(10); // Allowing extra 10ms buffer time for scheduling and run completion

      expect(entry.wasCompleted()).toBeTruthy();
      expect(await entry.promise).toMatchObject({ ok: true, details: 1 });
    });
  });
});

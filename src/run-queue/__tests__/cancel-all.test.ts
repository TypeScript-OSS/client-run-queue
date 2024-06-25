import { sleep } from '../../__test_dependency__/sleep.js';
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

    it('cancelAll should cancel everything on non-empty queue', () => {
      const entries = [1, 2].map((value) => q.schedule(DEFAULT_PRIORITY, `test${value}`, () => value));

      // Not sleeping so not giving entries a chance to run since they only run after interactions, which has a 0ms timeout delay

      q.cancelAll();

      for (const entry of entries) {
        expect(entry.wasCanceled()).toBeTruthy();
      }
    });

    it('cancelAll should cancel delayed entries', async () => {
      const entry = q.schedule(DEFAULT_PRIORITY, `test`, () => 1, { delayMSec: 1000 });

      await sleep(50);

      q.cancelAll();

      expect(entry.wasCanceled()).toBeTruthy();
    });

    it('cancelAll should do nothing on non-empty queue after all entries have run', async () => {
      const order: number[] = [];

      const entries = [1, 2].map((value) =>
        q.schedule(DEFAULT_PRIORITY, `test${value}`, () => {
          order.push(value);
          return value;
        })
      );

      let entryIndex = 0;
      for (const entry of entries) {
        expect(await entry.promise).toMatchObject({ ok: true, details: entryIndex + 1 });
        entryIndex += 1;
      }

      expect(order).toMatchObject([1, 2]);

      q.cancelAll();

      for (const entry of entries) {
        expect(entry.wasCanceled()).toBeFalsy();
        expect((await entry.promise).ok).toBeTruthy();
      }
    });

    it('cancelAll should cancel remaining entries on non-empty queue after some entries have run', async () => {
      const entries = [1, 2, 3].map((value, index) =>
        q.schedule(
          DEFAULT_PRIORITY,
          `test${value}`,
          async () => {
            // + 1 to make sure it exceeds DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC
            await sleep(DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC + 1);
            return value;
          },
          { delayMSec: 50 * index }
        )
      );
      const [firstEntry, ...restEntries] = entries;

      for (const entry of entries) {
        expect(entry.wasCanceled()).toBeFalsy();
        expect(entry.wasCompleted()).toBeFalsy();
      }

      // Waiting for first entry to complete
      await firstEntry.promise;
      expect(firstEntry.wasCanceled()).toBeFalsy();
      expect(firstEntry.wasCompleted()).toBeTruthy();
      expect(await firstEntry.promise).toMatchObject({ ok: true, details: 1 });

      for (const entry of restEntries) {
        expect(entry.wasCanceled()).toBeFalsy();
        expect(entry.wasCompleted()).toBeFalsy();
      }

      // Canceling remaining entries
      q.cancelAll();

      expect(firstEntry.wasCanceled()).toBeFalsy();

      for (const entry of restEntries) {
        expect(entry.wasCompleted()).toBeFalsy();
        expect(entry.wasCanceled()).toBeTruthy();
      }
    });
  });
});

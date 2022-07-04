import { sleep } from '../../__test_dependency__';
import { DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC } from '../internal/consts';
import { RunQueue } from '../queue';

describe('RunQueue', () => {
  describe('with maxParallel: 2', () => {
    let q: RunQueue;

    beforeEach(() => {
      q = new RunQueue('test', { maxParallel: 2 });
    });

    afterEach(() => {
      q.cancelAll();
    });

    it('two functions should be run in parallel', async () => {
      const entries = [1, 2, 3, 4, 5, 6, 7, 8].map((value) =>
        q.schedule(value, `test${value}`, async () => {
          await sleep(DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC + 1);
          return value;
        })
      );

      for (const entry of entries) {
        expect(entry.wasCompleted()).toBeFalsy();
      }

      await sleep(0);

      const [entry1, entry2, ...restEntries] = entries;
      const first2Entries = [entry1, entry2];

      for (const entry of first2Entries) {
        expect(entry.wasStarted()).toBeTruthy();
      }
      for (const entry of restEntries) {
        expect(entry.wasStarted()).toBeFalsy();
      }
    });
  });

  describe('with maxParallel: 8', () => {
    let q: RunQueue;

    beforeEach(() => {
      q = new RunQueue('test', { maxParallel: 8 });
    });

    afterEach(() => {
      q.cancelAll();
    });

    it('eight functions should be run in parallel', async () => {
      const entries = [1, 2, 3, 4, 5, 6, 7, 8].map((value) =>
        q.schedule(value, `test${value}`, async () => {
          await sleep(DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC + 1);
          return value;
        })
      );

      for (const entry of entries) {
        expect(entry.wasCompleted()).toBeFalsy();
      }

      await sleep(0);

      for (const entry of entries) {
        expect(entry.wasStarted()).toBeTruthy();
      }
    });
  });
});

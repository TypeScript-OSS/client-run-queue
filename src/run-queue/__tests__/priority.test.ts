import { sleep } from '../../__test_dependency__';
import { DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC } from '../internal/consts';
import { RunQueue } from '../queue';

describe('RunQueue', () => {
  describe('with default settings', () => {
    let q: RunQueue;

    beforeEach(() => {
      q = new RunQueue('test');
    });

    afterEach(() => {
      q.cancelAll();
    });

    it('functions with in-order priorities should start in order', async () => {
      const order: number[] = [];
      const entries = [1, 2, 3, 4, 5, 6, 7, 8].map((value) =>
        q.schedule(value, `test${value}`, async () => {
          order.push(value);
          await sleep(DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC + 1);
          return value;
        })
      );

      await Promise.all(entries.map((entry) => entry.promise));

      expect(order).toMatchObject([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('functions with reverse-order priorities should start in order', async () => {
      const order: number[] = [];
      const entries = [1, 2, 3, 4, 5, 6, 7, 8].map((value) =>
        q.schedule(-value, `test${value}`, async () => {
          order.push(value);
          await sleep(DEFAULT_CONTINUOUS_WORK_TIME_LIMIT_MSEC + 1);
          return value;
        })
      );

      await Promise.all(entries.map((entry) => entry.promise));

      expect(order).toMatchObject([8, 7, 6, 5, 4, 3, 2, 1]);
    });
  });
});

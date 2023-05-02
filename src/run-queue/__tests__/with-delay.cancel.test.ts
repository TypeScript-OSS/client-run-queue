import { jest } from '@jest/globals';

import { sleep } from '../../__test_dependency__';
import { CANCELED, DEFAULT_PRIORITY } from '../consts';
import { RunQueue } from '../queue';

describe('RunQueue', () => {
  describe('when scheduling with delay', () => {
    let q: RunQueue;

    beforeEach(() => {
      q = new RunQueue('test');
    });

    afterEach(() => {
      q.cancelAll();
    });

    it('cancel should work if run immediately', async () => {
      const runner = jest.fn(() => 1);
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', runner, { delayMSec: 50 });

      // Not sleeping so not giving entries a chance to run since they only run after interactions, which has a 0ms timeout delay

      entry.cancel();
      expect(entry.wasCanceled()).toBeTruthy();

      await sleep(100);

      expect(runner).not.toHaveBeenCalled();
    });

    it('canceling an entry a second time should do nothing', () => {
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', () => 1, { delayMSec: 50 });

      // Not sleeping so not giving entries a chance to run since they only run after interactions, which has a 0ms timeout delay

      entry.cancel();
      expect(entry.wasCanceled()).toBeTruthy();

      entry.cancel();
      expect(entry.wasCanceled()).toBeTruthy();
    });

    it('cancel should do nothing if the entry has already been run', async () => {
      const runner = jest.fn(() => 1);
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', runner, { delayMSec: 50 });

      expect(await entry.promise).toMatchObject({ ok: true, details: 1 });

      entry.cancel();
      expect(entry.wasCanceled()).toBeFalsy();
      expect(runner).toHaveBeenCalled();
    });

    it('cancel should work on a long running entry that has started but not completed', async () => {
      const runner = jest.fn(async () => {
        await sleep(500);
        return 1;
      });
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', runner, { delayMSec: 50 });

      await sleep(100);

      expect(entry.wasStarted()).toBeTruthy();
      entry.cancel();
      expect(entry.wasCanceled()).toBeTruthy();
      expect(runner).toHaveBeenCalled();

      expect(await entry.promise).toMatchObject({ ok: false, details: CANCELED });
    });
  });
});

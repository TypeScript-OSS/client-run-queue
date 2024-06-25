import { sleep } from '../../__test_dependency__/sleep.js';
import { CANCELED, DEFAULT_PRIORITY } from '../consts.js';
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

    it('cancel should work if run immediately', () => {
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', () => 1);

      // Not sleeping so not giving entries a chance to run since they only run after interactions, which has a 0ms timeout delay

      entry.cancel();
      expect(entry.wasCanceled()).toBeTruthy();
    });

    it('canceling an entry a second time should do nothing', () => {
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', () => 1);

      // Not sleeping so not giving entries a chance to run since they only run after interactions, which has a 0ms timeout delay

      entry.cancel();
      expect(entry.wasCanceled()).toBeTruthy();

      entry.cancel();
      expect(entry.wasCanceled()).toBeTruthy();
    });

    it('cancel should do nothing if the entry has already been run', async () => {
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', () => 1);

      expect(await entry.promise).toMatchObject({ ok: true, details: 1 });

      entry.cancel();
      expect(entry.wasCanceled()).toBeFalsy();
    });

    it('cancel should work on a long running entry that has started but not completed', async () => {
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', async () => {
        await sleep(500);
        return 1;
      });

      await sleep(0);

      expect(entry.wasStarted()).toBeTruthy();
      entry.cancel();
      expect(entry.wasCanceled()).toBeTruthy();

      expect(await entry.promise).toMatchObject({ ok: false, details: CANCELED });
    });
  });
});

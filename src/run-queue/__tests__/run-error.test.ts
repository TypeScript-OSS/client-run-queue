import { sleep } from '../../__test_dependency__';
import { CANCELED, DEFAULT_PRIORITY } from '../consts';
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

    it('error throwing entries should be completed but not ok', async () => {
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', async () => {
        throw new Error('Something Went Wrong');
      });

      expect(entry.wasCompleted()).toBeFalsy();

      await sleep(0);

      expect(entry.wasCompleted()).toBeTruthy();
      expect(await entry.promise).toMatchObject({ ok: false, details: new Error('Something Went Wrong') });
    });

    it('errors thrown on canceled but started entries should be ignored', async () => {
      const entry = q.schedule(DEFAULT_PRIORITY, 'test', async () => {
        await sleep(500);
        throw new Error('Something Went Wrong');
      });

      expect(entry.wasCompleted()).toBeFalsy();

      await sleep(0);

      expect(entry.wasCompleted()).toBeFalsy();

      entry.cancel();

      expect(await entry.promise).toMatchObject({ ok: false, details: CANCELED });
    });
  });
});

# client-run-queue

This package provides a RunQueue implementation for scheduling and managing async or time-consuming functions such that client-side interactivity disruptions are minimized.

## Usage Examples

```typescript
import { CANCELED, DEFAULT_PRIORITY, RunQueue } from 'client-run-queue';

const main = async () => {
  const q = new RunQueue('my-queue');

  const doSomeWork = async () => {
    // …do some work – just sleeping for some random time to simulate work here
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

    return Math.random();
  };

  // Scheduling an entry

  const entry = q.schedule(DEFAULT_PRIORITY, 'my-function', doSomeWork);

  // Checking its various statuses

  console.log('canceled', entry.wasCanceled());
  console.log('completed', entry.wasCompleted());
  console.log('started', entry.wasStarted());

  // Waiting for it to complete

  const result = await entry.promise;
  if (result.ok) {
    console.log('success', result.details);
  } else if (result.details === CANCELED) {
    console.log('canceled');
  } else {
    console.log('failure', result.details);
  }

  // Scheduling more entries using different priorities and options

  q.schedule(2, 'my-function', doSomeWork, { delayMSec: 1000 });
  q.schedule(0, 'my-function', doSomeWork, { neverCancel: true });
  q.schedule(1, 'my-function', doSomeWork);

  // Checking the queue length

  console.log('queue length', q.getQueueLength());

  // Canceling everything

  q.cancelAll();
};
main();
```

## Configuration

With RunQueue, one can specify:

- max parallelism
- max work units and/or continuous work duration per loop iteration
- priority and cancellable per entry (runnable function)

You may then:

- check the status of entries
- request cancellation of specific or all entries
- wait for the promised values of entries

In addition to configuring individual RunQueues in the ways mentioned above, you may also specify:

- a runAfterInteractions function to customize the coordinated scheduling mechanism for your environment (ex. React Native uses `InteractionManager.runAfterInteractions`).  See `setRunAfterInteractions`.  By default, `runAfterInteractions` uses a 0ms timeout.
- Stats tracking functions for debugging and analyzing usage.  See `setStatsHandler`.

## React Native

As noted above, for React Native, it's recommended to use `InteractionManager` for `runAfterInteractions`.  To do that, run code like the following, early in your programs execution:

```typescript
setRunAfterInteractions((_id, func) => {
  const handle = InteractionManager.runAfterInteractions(func);

  return handle.cancel;
})
```

## Thanks

Thanks for checking it out.  Feel free to create issues or otherwise provide feedback.

client-run-queue is maintained by the team at [Passfolio](https://www.passfolio.com).

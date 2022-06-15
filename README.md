# client-run-queue

A client-friendly run queue

This library provides a RunQueue implementation that supports scheduling and managing async and/or time-consuming functions in a client-friendly manner, such that client-side (e.g. browser-based or React Native) interactivity disruptions are minimized.

With RunQueue, one can specify:

- max parallelism
- max work units and/or continuous work duration per loop iteration
- priority and cancellable per entry (runnable function)

You may then:

- check the status of entries
- request cancellation of specific or all entries
- wait for the promised value from entries

### Configuration

In addition to configuring individual RunQueues in the ways mentioned above, you may also specify:

- a runAfterInteractions function to customize the coordinated scheduling mechanism for your environment (ex. React Native uses `InteractionManager.runAfterInteractions`).  See `setRunAfterInteractions`.
- Stats tracking functions for debugging and analyzing usage.  See `setStatsHandler`.

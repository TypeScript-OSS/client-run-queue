# Changelog

## [2.0.1] - 2022-02-02

### Changed

- Reverted change to `defaultRunAfterInteractions` - so it's back to using `setTimeout(func, 0)`
since we want it to actually run the event loop.  However, `RunQueue.schedule` where `delayMSec` is `0` still
uses queue-microtask.

## [2.0.0] - 2022-02-02

### Changed

- Using queue-microtask instead of `setTimeout(func, 0)` for `defaultRunAfterInteractions` and fo
r `RunQueue.schedule` when `delayMSec` is `0`.

## [1.1.11] - 2022-01-10

- Updated package dependencies

## [1.1.10] - 2022-08-23

- Optimized `toArray` on the internal type `DoubleLinkedList`, for cases where lists are unchanged.

## [1.1.9] - 2022-08-01

- Updated package dependencies.
- Updated README.

## [1.1.8] - 2022-07-21

- Updated package dependencies.
- Added linting to `prepublishOnly` work.
- Added unit test coverage thresholds.

## [1.1.7] - 2022-07-05

- Updated README.

## [1.1.6] - 2022-07-05

- Updated package file to point to new GitHub location.

## [1.1.5] - 2022-07-04

- Updated README.

## [1.1.4] - 2022-07-04

### Fixed

- An issue where calling `cancelAll` on scheduled entry with the `delayMSec` option set didn't work unless the delay time was reached first, since these entries weren't considered to be "scheduled".
- An issue where `getQueueLength` didn't count delayed scheduled entries.

## [1.1.3] - 2022-07-01

- Updated README.

## [1.1.2] - 2022-06-22

- Updated README.

## [1.1.1] - 2022-06-22

- Removed docs from npm.

## [1.1.0] - 2022-06-20

### Added

- Added support for delayed scheduling.

## [1.0.0] - 2022-06-17

- Initial official public release.

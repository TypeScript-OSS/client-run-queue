/* istanbul ignore file */

/**
 * A function used to run another function "after interactions".
 *
 * @see `setRunAfterInteractions`
 */
export type RunAfterInteractionsFunc = (id: string, func: () => Promise<void> | void) => () => void;

const defaultRunAfterInteractions: RunAfterInteractionsFunc = (_id, func) => {
  const timeout = setTimeout(func, 0);

  return () => {
    clearTimeout(timeout);
  };
};

/** The default implementation runs the function after a 0ms timeout using setTimeout. */
let globalRunAfterInteractions: RunAfterInteractionsFunc = defaultRunAfterInteractions;

/**
 * Runs the specified functions after interactions have been allowed.
 *
 * @see {@link setRunAfterInteractions}, which is used to determine how to actually do that.
 */
export const runAfterInteractions = (id: string, func: () => Promise<void> | void) => globalRunAfterInteractions(id, func);

/** Resets the run after interactions function to its default state */
export const resetRunAfterInteractions = () => {
  globalRunAfterInteractions = defaultRunAfterInteractions;
};

/**
 * Customize how to run a function after interactions.
 *
 * The default implementation runs the function after a 0ms timeout using setTimeout.
 *
 * For example, on React Native, we want to use InteractionManager.runAfterInteractions
 */
export const setRunAfterInteractions = (runAfterInteractions: RunAfterInteractionsFunc) => {
  globalRunAfterInteractions = runAfterInteractions;
};

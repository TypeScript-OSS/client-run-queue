/* istanbul ignore file */

export const sleep = async (durationMSec: number) => new Promise((resolve) => setTimeout(resolve, durationMSec));

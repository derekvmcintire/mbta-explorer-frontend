// A record that keeps track of the lock status for each route.
// The keys are route ids, and the values are boolean values indicating whether the route is locked.
const routeLocks: Record<string, boolean> = {};

/**
 * Acquires a lock for the specified route to prevent simultaneous updates.
 * If the route is already locked, it logs a message and returns `false`.
 * If the lock is successfully acquired, it returns `true`.
 * 
 * @param routeId - The ID of the route to lock.
 * @returns A boolean indicating whether the lock was successfully acquired (`true`), or if the route was already locked (`false`).
 */
export const acquireLock = (routeId: string): boolean => {
  // Check if the route is already locked
  if (routeLocks[routeId]) {
    console.log(`Update for ${routeId} is already in progress. Skipping.`);
    return false;
  }

  // Acquire the lock for the route
  routeLocks[routeId] = true;
  return true;
};

/**
 * Releases the lock for the specified route, allowing future updates.
 * 
 * @param routeId - The ID of the route to unlock.
 * @returns A void function that does not return any value.
 */
export const releaseLock = (routeId: string): void => {
  // Release the lock for the route
  routeLocks[routeId] = false;
};

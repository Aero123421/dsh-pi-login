/** Hold a submit lock before any await or setState. A second caller sees the flag immediately. */
export function claimSubmit(lock) {
  if (lock?.current) return false
  if (lock) lock.current = true
  return true
}

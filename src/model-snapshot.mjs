/**
 * One publication rule for a connection's model list.
 * A catalog reload and a switch save can both be in flight. Only a response
 * that is still current, and not older than a published revision, may replace
 * the snapshot. Pending switch values stay on top of an older full snapshot.
 */
export function createModelEditor() {
  let generation = 0
  let reloadSerial = 0
  let publishedRevision = -1
  const pending = new Map()
  const revisionOf = snapshot => typeof snapshot?.revision === 'number' ? snapshot.revision : undefined
  return {
    note(snapshot) {
      const revision = revisionOf(snapshot)
      if (revision !== undefined && revision > publishedRevision) publishedRevision = revision
    },
    invalidate() {
      generation += 1
      reloadSerial += 1
      pending.clear()
    },
    project(snapshot) {
      if (!snapshot?.models || pending.size === 0) return snapshot
      return {
        ...snapshot,
        models: snapshot.models.map(row => {
          const desired = pending.get(row.id)
          return desired ? { ...row, enabled: desired.enabled } : row
        }),
      }
    },
    beginReload() {
      const token = generation
      const serial = ++reloadSerial
      return {
        /** True while no newer catalog reload has started. A switch save does not retire the spinner. */
        current() { return serial === reloadSerial },
        accept(snapshot) {
          if (serial !== reloadSerial || token !== generation || pending.size > 0) return false
          const revision = revisionOf(snapshot)
          if (revision !== undefined && revision < publishedRevision) return false
          if (revision !== undefined) publishedRevision = revision
          return true
        },
      }
    },
    beginToggle(model, enabled) {
      const token = ++generation
      pending.set(model, { enabled, token })
      return {
        overlay(snapshot) {
          if (!snapshot?.models) return snapshot
          return {
            ...snapshot,
            models: snapshot.models.map(row => {
              const desired = pending.get(row.id)
              return desired ? { ...row, enabled: desired.enabled } : row
            }),
          }
        },
        accept(snapshot) {
          if (token !== generation) return false
          const revision = revisionOf(snapshot)
          if (revision !== undefined && revision > publishedRevision) publishedRevision = revision
          return true
        },
        finish() {
          const desired = pending.get(model)
          if (desired?.token === token) pending.delete(model)
        },
      }
    },
  }
}

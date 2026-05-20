/* Re-export barrel: every dataset the screens render is now sourced from the
 * adapter that transforms vendored v2 specs. Components keep their existing
 * `../data` imports — no call-site changes. */
export {
  INITIAL_NODES,
  INITIAL_EDGES,
  STICKIES,
  REGISTRY_NODES,
  QUEUE_DATA,
  NOTIFICATIONS,
  PICKER_NODES,
  DIFF_LINES,
  EXPORT_FILE_TREE,
} from './specAdapter';
export type { RegistryNode, PickerNode } from './specAdapter';

/**
 * AERVYN: Echoes of Time - Spatial Collision Detection System
 * Cylindrical player collision against bounding boxes, static world structures,
 * and floor bounds to prevent clipping.
 */

class CollisionSystemManager {
  constructor() {
    this.colliders = [];
  }

  // Register static bounding box obstacle
  registerBoxCollider(id, minX, maxX, minZ, maxZ) {
    this.colliders.push({ id, minX, maxX, minZ, maxZ });
  }

  clear() {
    this.colliders = [];
  }

  // Check proposed player X/Z position against obstacles
  resolveMovement(currX, currZ, targetX, targetZ, radius = 0.5) {
    let resolvedX = targetX;
    let resolvedZ = targetZ;

    // World 1 outer boundary clamp (Courtyard & Inner Sanctum: 80x80 area)
    const WORLD_BOUNDS = 38;
    resolvedX = Math.max(-WORLD_BOUNDS, Math.min(WORLD_BOUNDS, resolvedX));
    resolvedZ = Math.max(-WORLD_BOUNDS, Math.min(WORLD_BOUNDS, resolvedZ));

    // Check against registered obstacles
    for (const box of this.colliders) {
      // Check X movement
      if (
        resolvedX + radius > box.minX &&
        resolvedX - radius < box.maxX &&
        currZ + radius > box.minZ &&
        currZ - radius < box.maxZ
      ) {
        resolvedX = currX; // Stop X penetration
      }

      // Check Z movement
      if (
        currX + radius > box.minX &&
        currX - radius < box.maxX &&
        resolvedZ + radius > box.minZ &&
        resolvedZ - radius < box.maxZ
      ) {
        resolvedZ = currZ; // Stop Z penetration
      }
    }

    return { x: resolvedX, z: resolvedZ };
  }
}

export const CollisionSystem = new CollisionSystemManager();
export default CollisionSystem;

# AERVYN: ECHOES OF TIME
## GAME DESIGN DOCUMENT (GDD)

**Game Title:** AERVYN: ECHOES OF TIME  
**Genre:** 3D Cinematic Adventure / Mystery / Time Travel  
**Target Audience:** Fans of sci-fi adventure, environmental puzzle solving, and time-travel narratives  
**Platforms:** PC Web (Chrome, Edge, Firefox), Mobile Web (iOS Safari, Android Chrome), Steam / Desktop Wrapper  
**Engine:** Three.js + React Three Fiber + Drei + GSAP  
**Backend:** Laravel 12 + MySQL + Laravel Sanctum  
**Version:** 1.0.0 Commercial Release  

---

## 1. Vision & Core Philosophy

*AERVYN: ECHOES OF TIME* is an immersive 3D adventure game exploring the consequences of temporal manipulation. Players take on the role of a stranded Chrono Explorer who must traverse four distinct temporal epochs, uncover the truth behind the cosmic Time Fracture, and ultimately make a reality-defining choice.

### Key Pillars:
1. **Seamless Narrative Traversal:** Physical travel between ancient antiquity, a cybernetic broken present, and a fractured future floating across the cosmic void.
2. **Accessible Depth:** Responsive third-person controls on desktop (WASD/Mouse) and mobile (virtual joystick/touch controls) with intelligent orbit cameras.
3. **Engaging Environmental Puzzles:** Tactile interaction with pedestals, flux alignment terminals, time resonator switches, and the central Continuum Matrix.
4. **Independent Campaign & Asynchronous Social Layer:** A fully playable single-player campaign that requires no social interaction, complemented by an optional social hub where players can issue async speedrun and harvest challenges.

---

## 2. World Progression & Narrative Arcs

### Prologue: The Mystery of the First Timeline
The player awakens in the ruined courtyard of an ancient sanctuary. The air hums with residual Chrono Energy. An inscription reveals that reality was shattered when the Master Timeline Engine was destabilized.

### World 1: The Lost Kingdom (Antiquity)
- **Setting:** A grand Romanesque/Gothic castle courtyard bathed in warm moonlight and starlight. Ancient stone columns, runic pedestals, and carved stone portals stand testament to a forgotten era.
- **Key Objectives:**
  1. Learn character traversal (sprint, jump).
  2. Interact with the central Chrono Pedestal.
  3. Collect 3 Temporal Energy Fragments scattered across the ruins.
  4. Decipher the Ancient Stone Gate runic puzzle.
  5. Step onto the Portal Dais to activate the gateway to Timeline 2.
- **Lore Discovery:** The ancients discovered temporal energy and attempted to harness it, creating the first Keystone.

### World 2: The Broken Present (Dystopian Cyber City)
- **Setting:** A devastated metropolis where skyscrapers are frozen in mid-collapse. Neon holograms flicker against smog-filled rainy skies. Temporal anomalies bend gravity.
- **Key Objectives:**
  1. Calibrate the highway access terminal.
  2. Activate the emergency communications relay.
  3. Harvest 3 Quantum Energy Cores from hazardous distortion zones.
  4. Breach the subterranean security lab.
  5. Repair the Central Time Core reactor and open the portal to the future.
- **Lore Discovery:** 21st-century scientists attempted to exploit ancient Chrono energy, triggering an uncontrollable resonance cascade that shattered the present.

### World 3: The Fractured Future (The End of Time)
- **Setting:** Floating islands drifting above a cosmic void under deep violet and cyan nebulae. Shifting anti-gravity phase bridges connect floating research spires.
- **Key Objectives:**
  1. Calibrate the Sky Beacon.
  2. Cross the Phase Bridge.
  3. Recover 3 Chrono Shards across floating islands.
  4. Solve the Time Labyrinth resonator switches (Alpha, Beta, Gamma).
  5. Breach the Spire of Stasis.
  6. Confront and defeat **THE CHRONARCH** in the Timeline Engine Arena.
- **Boss Battle: The Chronarch:**
  - *Phase 1:* The Chronarch summons rotating energy shields; player must dodge orbital pulses.
  - *Phase 2:* Energy overload; player exploits vulnerability windows to strike core nodes.
  - *Phase 3:* Final desperation phase; gravity fluctuates as the Timeline Engine begins critical meltdown.

### World 4: The Last Timeline (The Zero Horizon)
- **Setting:** The Nexus of Creation. A transcendent celestial platform suspended in the primordial continuum, glowing with solar and prismatic starlight.
- **Key Objectives:**
  1. Cross the celestial bridge toward the Primordial Chrono Core.
  2. Align the 3 Epoch Keystones (Antiquity, Quantum, Singularity).
  3. Step into the Harmonization Nexus and make the ultimate decision.

---

## 3. The Dual Endings

Upon harmonizing the Primordial Chrono Core at the Zero Horizon, the player is presented with a momentous philosophical crossroad:

### Ending A: The Prime Timeline Weaver
- **Choice:** Restore the Master Timeline into a single, unified continuum.
- **Narrative Consequence:** History is restitched. The fractures heal, the ruined present is restored to life, and time flows forward in harmony. The player takes their place as the eternal guardian of the Chrono Keystone.
- **Visual Outcome:** Golden celestial dawn radiates across all timelines; peaceful credits roll.

### Ending B: The Shattered Continuum
- **Choice:** Preserve the multiverse as fractured, autonomous branches.
- **Narrative Consequence:** Rather than forcing a singular destiny, each timeline is granted total independence. New alternate realities sprout endlessly across the cosmos, granting all beings free will at the cost of eternal uncertainty.
- **Visual Outcome:** Prismatic aurora bursts into infinite divergent fractals across the cosmic void.

---

## 4. Gameplay Mechanics & Systems

### Traversal & Movement
- **Standard Locomotion:** Omnidirectional movement relative to camera orientation.
- **Sprint Mechanic:** Consumes Chrono Energy to double movement speed; essential for timed puzzle gates and hazard avoidance.
- **Jump & Vault:** Traversal across elevated platforms, broken highway segments, and floating sky islands.

### Health & Environmental Hazards
- **Player Health:** 100 HP.
- **Hazards:** Temporal distortion fields, unstable energy arcs, gravity drops.
- **Feedback:** Screen edge vignette red flash on damage, directional audio thuds.
- **Checkpoint Restoration:** Automated respawn at the most recently activated checkpoint.

### Inventory & Collectibles
- **Inventory Bar:** Real-time HUD displaying collected items:
  - Energy Fragments (World 1)
  - Quantum Cores (World 2)
  - Chrono Shards (World 3)
  - Epoch Keystones (World 4)
- **Story Journal:** Press [J] or click HUD icon to review all unlocked narrative archives, lore entries, and mission logs.

### Graphics Quality Presets
- **High:** Full shadows (2048x2048 map), 3500 celestial stars, antialiasing on, dynamic pixel ratio [1, 2].
- **Medium:** Optimized shadows (1024x1024 map), 2200 stars, antialiasing on, DPR 1.0.
- **Low:** Shadows disabled for maximum frame rate, 1000 stars, fast shader pipeline, DPR 0.8.

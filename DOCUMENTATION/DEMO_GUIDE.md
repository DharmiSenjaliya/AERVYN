# AERVYN: ECHOES OF TIME — Buyer Demo Guide & Evaluation Workflow

This guide explains how to access, evaluate, and demonstrate the interactive evaluation slice of **AERVYN: ECHOES OF TIME**.

---

## 1. Overview of Buyer Demo Mode
The Buyer Demo Mode is a self-contained, sandboxed slice of **World 1: The Lost Kingdom**. It is designed specifically for publishers, investors, commercial buyers, and licensing partners to evaluate gameplay responsiveness, graphics fidelity, controls, and puzzle interactions within 2 to 3 minutes without requiring account registration.

### Key Evaluation Attributes
- **Zero Registration Required:** Visitors can launch directly via `/demo` or the "PLAY DEMO" button on the commercial landing page.
- **State Isolation:** All demo state (milestones, collected fragments, puzzle state) is held in React component state. **No data is sent to `/api/game/save`**, ensuring zero pollution of production player saves or leaderboards.
- **Evaluation Watermark HUD:** A top-center indicator confirms "BUYER DEMO EVALUATION SLICE" and tracks real-time progress through 3 sequential objectives.

---

## 2. Evaluation Walkthrough Steps
Upon navigating to `http://localhost:5173/demo`:

### Step 1: Locomotion & Controls Verification
- **Controls:**
  - `W / A / S / D` or `Arrow Keys`: Move character.
  - `Shift`: Sprint (notice smooth camera pull-back and acceleration).
  - `Space`: Jump (test arc physics and landing feedback).
  - `Mouse Drag / Pointer`: Orbit camera freely around the character.
- **Evaluation Goal:** Confirm frame rate stability (targeted at 60 FPS) and absence of control lag.

### Step 2: Milestone 1 — Collect Keystone Fragment
- Guide the character towards the glowing golden energy fragment suspended above the ancient dais.
- Walk into the fragment.
- **Verification:** An audio pickup sound synthesizes, particle burst emits, and Milestone 1 marks complete in the HUD.

### Step 3: Milestone 2 — Solve the Runic Pedestal Dial
- Approach the central stone pedestal. The prompt `Press [E] to Inspect Pedestal` appears.
- Press `E` to open the interactive Runic Dial Puzzle modal.
- Click `Rotate Rune Dial (+45°)` until the dial aligns to the target 180° orientation.
- The alignment validates with visual cyan glow and success chime.
- Close the modal or click `Engage Temporal Mechanism`.
- **Verification:** Milestone 2 marks complete, and the ancient gateway portal ignites with a swirling particle vortex.

### Step 4: Milestone 3 — Activate Gateway Portal
- Walk through the swirling cyan and violet temporal vortex.
- **Verification:** Portal sound triggers, a brief teleportation fade executes, and the player is automatically transitioned to the **Demo Completion Screen** (`/demo/complete`).

---

## 3. Demo Completion Screen (`/demo/complete`)
The completion screen showcases:
- Confirmed "DEMO COMPLETE" certification.
- Summary of the 4 full worlds, boss encounters, and persistent cloud systems available in the full release.
- Direct commercial contact buttons:
  - **License / Inquire About AERVYN:** Scrolls directly to the inquiry form.
  - **Product Specifications:** Opens `/product` for full technical specs.
  - **Replay Demo:** Reruns the slice.
  - **Launch Full Game Campaign:** Links to `/play` to experience the complete persistent game.

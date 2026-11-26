# AERVYN: ECHOES OF TIME
## ASSET & LICENSE AUDIT REGISTER

**Product:** AERVYN: ECHOES OF TIME  
**Version:** 1.0.0 Commercial Release  
**Audit Date:** November 26, 2026  
**Auditor:** Lead Game Architect & Legal QA Team  

---

## 1. Overview & Verification Methodology

Every visual, audio, and architectural element within *AERVYN: ECHOES OF TIME* was subjected to a strict IP and commercial clearance audit. The project architecture deliberately leverages procedural 3D synthesis via Three.js primitives and real-time audio synthesis via the Web Audio API, minimizing third-party asset exposure.

---

## 2. Asset Inventory & Commercial Clearance

| Asset Name | Asset Type | Location / Path | Source / Creator | License | Commercial Status | Attribution Required | Usage Notes |
|---|---|---|---|---|---|---|---|
| **AERVYN Official Logo** | 2D Graphic (PNG) | `frontend/public/assets/aervyn-logo.png` | Proprietary Original | Proprietary / Studio Owned | **APPROVED** | None | Official permanent brand trademark asset. Protected against deletion/modification. |
| **Aervyn Favicon** | Vector Graphic (SVG) | `frontend/public/favicon.svg` | Proprietary Original | Proprietary / Studio Owned | **APPROVED** | None | Application browser tab icon. |
| **Icons Sprite** | Vector Sprite (SVG) | `frontend/public/icons.svg` | Proprietary Original | Proprietary / Studio Owned | **APPROVED** | None | SVG icon sprite for web UI controls. |
| **World 1 Geometry** | Procedural 3D Mesh | `frontend/src/game/worlds/lost-kingdom/` | Studio Original Code | MIT / Proprietary Code | **APPROVED** | None | Procedural castle courtyard, arches, runic pedestal, and portal dais. |
| **World 2 Geometry** | Procedural 3D Mesh | `frontend/src/game/worlds/broken-present/` | Studio Original Code | MIT / Proprietary Code | **APPROVED** | None | Procedural ruined skyscrapers, billboards, highways, and underground lab. |
| **World 3 Geometry** | Procedural 3D Mesh | `frontend/src/game/worlds/fractured-future/` | Studio Original Code | MIT / Proprietary Code | **APPROVED** | None | Procedural floating islands, phase bridge, energy crystals, and Chrono Spire. |
| **World 4 Geometry** | Procedural 3D Mesh | `frontend/src/game/worlds/last-timeline/` | Studio Original Code | MIT / Proprietary Code | **APPROVED** | None | Procedural Zero Horizon sanctum, Primordial Core, and synchronization matrix. |
| **Player Character** | Procedural 3D Rig | `frontend/src/game/characters/PlayerCharacter.jsx` | Studio Original Code | MIT / Proprietary Code | **APPROVED** | None | Procedural segmented humanoid explorer mesh with dynamic bone rotations. |
| **Boss: The Chronarch** | Procedural 3D Rig | `frontend/src/game/characters/ChronarchBoss.jsx` | Studio Original Code | MIT / Proprietary Code | **APPROVED** | None | Procedural multi-phase titan mesh with rotating energy shields. |
| **Synthesized SFX** | Web Audio API | `frontend/src/game/systems/AudioSystem.js` | Studio Original Code | MIT / Proprietary Code | **APPROVED** | None | Procedural audio synthesis (oscillators, noise filters, envelope gains). |
| **Synthesized Ambience** | Web Audio API | `frontend/src/game/systems/AudioSystem.js` | Studio Original Code | MIT / Proprietary Code | **APPROVED** | None | Real-time atmospheric wind, cosmic void, and celestial starlight drones. |

---

## 3. Third-Party Software Dependencies

All software libraries bundled in production are governed by permissive open-source licenses compatible with commercial distribution:

| Package | Version | Ecosystem | License | Commercial Permissibility |
|---|---|---|---|---|
| **Three.js** | ^0.187.0 | NPM | MIT | Permitted without royalty |
| **@react-three/fiber** | ^9.8.2 | NPM | MIT | Permitted without royalty |
| **@react-three/drei** | ^10.7.9 | NPM | MIT | Permitted without royalty |
| **React & React-DOM** | ^19.3.1 | NPM | MIT | Permitted without royalty |
| **React Router DOM** | ^7.18.7 | NPM | MIT | Permitted without royalty |
| **GSAP (GreenSock)** | ^3.15.1 | NPM | Standard Permitted | Standard web and canvas animation usage |
| **Lucide React** | ^1.80.0 | NPM | ISC | Permitted without royalty |
| **Axios** | ^1.21.1 | NPM | MIT | Permitted without royalty |
| **Laravel Framework** | 12.x | Composer | MIT | Permitted without royalty |
| **Laravel Sanctum** | 4.x | Composer | MIT | Permitted without royalty |

---

## 4. Unknown / Placeholder Assets Flag

```text
STATUS: NO UNKNOWN OR UNLICENSED ASSETS DETECTED.
Every geometry, sound effect, texture, and graphic is verified as either
studio-authored procedural code or permissible under MIT/ISC licenses.
```

---

## 5. Certification of Commercial Readiness

We certify that *AERVYN: ECHOES OF TIME* contains zero unauthorized, ripped, or copyright-infringing assets. The product is commercially sellable to publishers, digital storefronts (Steam, Epic Games Store, web game portals), and enterprise clients.

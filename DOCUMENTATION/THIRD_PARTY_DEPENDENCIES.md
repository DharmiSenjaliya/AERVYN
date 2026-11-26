# AERVYN: ECHOES OF TIME — Third-Party Dependency Inventory

This document lists all third-party libraries, frameworks, runtime dependencies, and development tools used in **AERVYN: ECHOES OF TIME**, extracted directly from `backend/composer.json` and `frontend/package.json`.

---

## 1. Backend Dependencies (PHP / Composer)

### Production Dependencies
| Package Name | Installed Constraint | Purpose | License | Production Usage |
|---|---|---|---|---|
| **php** | `^8.2` | Core server runtime environment | PHP License | Required runtime |
| **laravel/framework** | `^12.0` | Central web framework, routing, Eloquent ORM | MIT | Core backend API |
| **laravel/sanctum** | `^4.0` | Token-based API authentication | MIT | Authentication & Session Guards |
| **laravel/tinker** | `^2.10.1` | Interactive CLI repl debugging | MIT | Console management |

### Development & Testing Dependencies
| Package Name | Installed Constraint | Purpose | License | Production Usage |
|---|---|---|---|---|
| **phpunit/phpunit** | `^11.5.3` | Automated feature, integration, and E2E testing | BSD-3-Clause | Testing only |
| **fakerphp/faker** | `^1.23` | Realistic seed data generation | MIT | Seeders/testing only |
| **mockery/mockery** | `^1.6` | Mock object framework for testing | BSD-3-Clause | Testing only |
| **nunomaduro/collision**| `^8.6` | CLI error reporting formatting | MIT | Development only |
| **laravel/pint** | `^1.13` | Code style linter | MIT | Development only |
| **laravel/sail** | `^1.41` | Docker environment manager | MIT | Development only |
| **laravel/pail** | `^1.2.2` | Real-time log tailing | MIT | Development only |

---

## 2. Frontend Dependencies (JavaScript / Node.js / npm)

### Production Runtime Dependencies
| Package Name | Installed Version | Purpose | License | Production Usage |
|---|---|---|---|---|
| **react** | `^19.3.1` | Declarative UI component library | MIT | Core frontend framework |
| **react-dom** | `^19.3.1` | DOM renderer for React components | MIT | Core browser DOM rendering |
| **react-router-dom** | `^7.18.7` | Client-side routing and protected routes | MIT | Navigation & route guards |
| **three** | `^0.187.0` | WebGL 2.0 3D graphics rendering engine | MIT | 3D scenes, geometry, shaders |
| **@react-three/fiber** | `^9.8.2` | React reconciler for Three.js scene graphs | MIT | Declarative 3D world composition |
| **@react-three/drei** | `^10.7.9` | Utilities, camera controls, and overlays | MIT | 3D controls & canvas helpers |
| **gsap** | `^3.15.1` | High-performance animation engine | Standard ‘No-Charge’ / MIT | UI & cutscene transitions |
| **axios** | `^1.21.1` | Promise-based HTTP client for REST APIs | MIT | API communication & token interceptors |
| **lucide-react** | `^1.80.0` | Clean, cybernetic vector icon library | ISC | User interface iconography |

### Development & Build Dependencies
| Package Name | Installed Version | Purpose | License | Production Usage |
|---|---|---|---|---|
| **vite** | `^8.3.6` | Ultra-fast build tool and bundler | MIT | Development server & compilation |
| **@vitejs/plugin-react**| `^6.1.2` | Fast React refresh plugin for Vite | MIT | Development bundling |
| **eslint** | `^10.14.0` | JavaScript/JSX code quality analysis | MIT | Build-time code linting |
| **@types/react** | `^19.3.0` | TypeScript definitions for React | MIT | IDE autocomplete & type safety |
| **@types/react-dom** | `^19.3.0` | TypeScript definitions for ReactDOM | MIT | IDE autocomplete & type safety |

---

## 3. Commercial Clearance Assessment
All runtime dependencies used in both the backend and frontend are governed by permissive open-source licenses (**MIT**, **ISC**, and **BSD-3-Clause**). These licenses explicitly permit:
- Commercial utilization and redistribution.
- Proprietary modification and customization.
- Sub-licensing without revenue-sharing obligations.
- Zero copyleft contagion (GPL/AGPL-free codebase).

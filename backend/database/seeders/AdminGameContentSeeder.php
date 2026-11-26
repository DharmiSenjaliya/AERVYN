<?php

namespace Database\Seeders;

use App\Models\World;
use App\Models\Mission;
use App\Models\Collectible;
use App\Models\GameSetting;
use App\Models\Feedback;
use App\Models\GameSession;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminGameContentSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Worlds
        $worlds = [
            [
                'id' => 'world_1',
                'title' => 'World 1: The Lost Kingdom',
                'epoch' => 'Past Era (-840)',
                'description' => 'Ancient castle courtyard, stone pathways, 3 energy fragments, runic alignment puzzle, and time portal dais.',
                'thumbnail_url' => '/assets/thumbnails/world_1.jpg',
                'display_order' => 1,
                'is_active' => true,
                'required_level' => 1,
            ],
            [
                'id' => 'world_2',
                'title' => 'World 2: The Broken Present',
                'epoch' => 'Present Era (2026)',
                'description' => 'Destroyed futuristic city, cracked highways, 3 Quantum Cores, underground research lab, and the Central Time Core.',
                'thumbnail_url' => '/assets/thumbnails/world_2.jpg',
                'display_order' => 2,
                'is_active' => true,
                'required_level' => 3,
            ],
            [
                'id' => 'world_3',
                'title' => 'World 3: The Fractured Future',
                'epoch' => 'Future Era (3140)',
                'description' => 'Floating celestial islands, broken sky bridges, 3 Chrono Shards, Time Labyrinth, and The Chronarch boss encounter.',
                'thumbnail_url' => '/assets/thumbnails/world_3.jpg',
                'display_order' => 3,
                'is_active' => true,
                'required_level' => 5,
            ],
            [
                'id' => 'world_final',
                'title' => 'World 4: The Last Timeline',
                'epoch' => 'The Zero Horizon',
                'description' => 'Singularity nexus outside time. Solve the Continuum Synchronization Matrix, commune with the Primordial Core, and choose the destiny of reality.',
                'thumbnail_url' => '/assets/thumbnails/world_final.jpg',
                'display_order' => 4,
                'is_active' => true,
                'required_level' => 8,
            ],
        ];

        foreach ($worlds as $w) {
            World::updateOrCreate(['id' => $w['id']], $w);
        }

        // 2. Seed Missions for each World
        $missions = [
            // World 1 Missions
            [
                'id' => 'm1_step1',
                'world_id' => 'world_1',
                'title' => 'Courtyard Awakening',
                'description' => 'Step forward and explore the Ancient Castle Courtyard.',
                'step_number' => 1,
                'objectives' => ['Learn movement controls [W/A/S/D] or Joystick.'],
                'xp_reward' => 100,
                'is_active' => true,
            ],
            [
                'id' => 'm1_step2',
                'world_id' => 'world_1',
                'title' => 'Temporal Traversal',
                'description' => 'Learn character traversal: Sprint with [Shift] and Jump with [Space].',
                'step_number' => 2,
                'objectives' => ['Perform sprint traversal and leap across broken flagstones.'],
                'xp_reward' => 100,
                'is_active' => true,
            ],
            [
                'id' => 'm1_step3',
                'world_id' => 'world_1',
                'title' => 'The Chrono Keystone',
                'description' => 'Interact [E] with the Chrono Keystone atop the central pedestal.',
                'step_number' => 3,
                'objectives' => ['Claim the ancient stone keystone artifact.'],
                'xp_reward' => 150,
                'is_active' => true,
            ],
            [
                'id' => 'm1_step4',
                'world_id' => 'world_1',
                'title' => 'Energy Resonance',
                'description' => 'Search the courtyard colonnades to collect 3 Temporal Energy Fragments.',
                'step_number' => 4,
                'objectives' => ['Gather 3 energy fragments scattered in the ruins.'],
                'xp_reward' => 200,
                'is_active' => true,
            ],
            [
                'id' => 'm1_step5',
                'world_id' => 'world_1',
                'title' => 'The Runic Stone Gate',
                'description' => 'Channel collected fragments into the ancient stone gate lock mechanism.',
                'step_number' => 5,
                'objectives' => ['Unlock the inner chamber door.'],
                'xp_reward' => 250,
                'is_active' => true,
            ],
            [
                'id' => 'm1_step6',
                'world_id' => 'world_1',
                'title' => 'Chrono Alignment Dial',
                'description' => 'Align the three concentric runic dials inside the inner sanctum.',
                'step_number' => 6,
                'objectives' => ['Solve the temporal dial mechanism to open the rift.'],
                'xp_reward' => 300,
                'is_active' => true,
            ],
            [
                'id' => 'm1_step7',
                'world_id' => 'world_1',
                'title' => 'The Portal Leap',
                'description' => 'Step onto the portal dais and initiate the first temporal shift.',
                'step_number' => 7,
                'objectives' => ['Leap into the active time portal to restore Timeline 1.'],
                'xp_reward' => 500,
                'is_active' => true,
            ],

            // World 2 Missions
            [
                'id' => 'm2_step1',
                'world_id' => 'world_2',
                'title' => 'Arrival in the Broken City',
                'description' => 'Locate and interact with the damaged city access terminal on the overpass.',
                'step_number' => 1,
                'objectives' => ['Boot up the emergency power terminal.'],
                'xp_reward' => 150,
                'is_active' => true,
            ],
            [
                'id' => 'm2_step2',
                'world_id' => 'world_2',
                'title' => 'The Lost Signal',
                'description' => 'Locate the highway communication relay station and re-align the antenna.',
                'step_number' => 2,
                'objectives' => ['Broadcast emergency synchronization signal.'],
                'xp_reward' => 200,
                'is_active' => true,
            ],
            [
                'id' => 'm2_step3',
                'world_id' => 'world_2',
                'title' => 'Quantum Core Recovery',
                'description' => 'Recover 3 Quantum Energy Cores scattered across the ruined subway and highway.',
                'step_number' => 3,
                'objectives' => ['Retrieve Alpha, Beta, and Gamma quantum cores.'],
                'xp_reward' => 250,
                'is_active' => true,
            ],
            [
                'id' => 'm2_step4',
                'world_id' => 'world_2',
                'title' => 'The Subterranean Lab',
                'description' => 'Unlock the armored security bulkhead and breach the research lab.',
                'step_number' => 4,
                'objectives' => ['Bypass facility security grid.'],
                'xp_reward' => 300,
                'is_active' => true,
            ],
            [
                'id' => 'm2_step5',
                'world_id' => 'world_2',
                'title' => 'Phase Prism Alignment',
                'description' => 'Navigate the anomaly corridor and synchronize 3 holographic phase prisms.',
                'step_number' => 5,
                'objectives' => ['Align lasers to zero-point frequency.'],
                'xp_reward' => 350,
                'is_active' => true,
            ],
            [
                'id' => 'm2_step6',
                'world_id' => 'world_2',
                'title' => 'Repair the Time Core',
                'description' => 'Install all 3 Energy Cores into the Central Time Core reactor.',
                'step_number' => 6,
                'objectives' => ['Stabilize reactor core pressure.'],
                'xp_reward' => 400,
                'is_active' => true,
            ],
            [
                'id' => 'm2_step7',
                'world_id' => 'world_2',
                'title' => 'The Present Gateway',
                'description' => 'Step through the stabilized gateway to heal the present era.',
                'step_number' => 7,
                'objectives' => ['Traverse into the next era.'],
                'xp_reward' => 750,
                'is_active' => true,
            ],

            // World 3 Missions
            [
                'id' => 'm3_step1',
                'world_id' => 'world_3',
                'title' => 'Arrival at the End of Time',
                'description' => 'Locate and calibrate the Chrono Beacon on the landing sky island.',
                'step_number' => 1,
                'objectives' => ['Calibrate Chrono Beacon [E].'],
                'xp_reward' => 200,
                'is_active' => true,
            ],
            [
                'id' => 'm3_step2',
                'world_id' => 'world_3',
                'title' => 'The Fallen Sky City',
                'description' => 'Cross the skybridge and activate the solid-light Phase Bridge Terminal.',
                'step_number' => 2,
                'objectives' => ['Activate solid-light bridge [E].'],
                'xp_reward' => 250,
                'is_active' => true,
            ],
            [
                'id' => 'm3_step3',
                'world_id' => 'world_3',
                'title' => 'The Three Chrono Shards',
                'description' => 'Recover 3 Chrono Shards (Genesis, Flux, Singularity) across the floating islands.',
                'step_number' => 3,
                'objectives' => ['Reclaim all 3 floating Chrono Shards.'],
                'xp_reward' => 300,
                'is_active' => true,
            ],
            [
                'id' => 'm3_step4',
                'world_id' => 'world_3',
                'title' => 'The Time Labyrinth',
                'description' => 'Solve the 3 temporal resonator switches to open the Spire Gate.',
                'step_number' => 4,
                'objectives' => ['Harmonize Alpha, Beta, and Gamma switches.'],
                'xp_reward' => 350,
                'is_active' => true,
            ],
            [
                'id' => 'm3_step5',
                'world_id' => 'world_3',
                'title' => 'The Chronarch\'s Secret',
                'description' => 'Access the Chrono Archive Terminal inside the Research Spire.',
                'step_number' => 5,
                'objectives' => ['Decrypt the Chronarch\'s stasis motives.'],
                'xp_reward' => 400,
                'is_active' => true,
            ],
            [
                'id' => 'm3_step6',
                'world_id' => 'world_3',
                'title' => 'The Final Confrontation',
                'description' => 'Defeat THE CHRONARCH in the Timeline Engine Arena.',
                'step_number' => 6,
                'objectives' => ['Shatter temporal stasis barriers and defeat boss.'],
                'xp_reward' => 500,
                'is_active' => true,
            ],
            [
                'id' => 'm3_step7',
                'world_id' => 'world_3',
                'title' => 'The Fractured Future Restored',
                'description' => 'Restore the Master Timeline Engine to seal the cosmic fracture.',
                'step_number' => 7,
                'objectives' => ['Stabilize Master Timeline Engine.'],
                'xp_reward' => 1000,
                'is_active' => true,
            ],

            // World Final Missions
            [
                'id' => 'mf_step1',
                'world_id' => 'world_final',
                'title' => 'The Zero Horizon',
                'description' => 'Cross the ethereal celestial bridge toward the Primordial Chrono Core.',
                'step_number' => 1,
                'objectives' => ['Reach the Central Convergence Nexus.'],
                'xp_reward' => 300,
                'is_active' => true,
            ],
            [
                'id' => 'mf_step2',
                'world_id' => 'world_final',
                'title' => 'Continuum Synchronization',
                'description' => 'Align the 3 Epoch Keystones (Antiquity, Quantum, Singularity) in the matrix.',
                'step_number' => 2,
                'objectives' => ['Synchronize all three timelines simultaneously.'],
                'xp_reward' => 500,
                'is_active' => true,
            ],
            [
                'id' => 'mf_step3',
                'world_id' => 'world_final',
                'title' => 'The Nexus Decision',
                'description' => 'Commune with the Primordial Core and determine the ultimate fate of existence.',
                'step_number' => 3,
                'objectives' => ['Harmonize the Primordial Chrono Core.'],
                'xp_reward' => 700,
                'is_active' => true,
            ],
            [
                'id' => 'mf_step4',
                'world_id' => 'world_final',
                'title' => 'The Epilogue of Aervyn',
                'description' => 'Witness the destiny of reality: The Eternal Guardian vs The Architect of Tomorrow.',
                'step_number' => 4,
                'objectives' => ['Complete the Story Campaign.'],
                'xp_reward' => 1500,
                'is_active' => true,
            ],
        ];

        foreach ($missions as $m) {
            Mission::updateOrCreate(['id' => $m['id']], $m);
        }

        // 3. Seed Collectibles
        $collectibles = [
            // World 1
            [
                'id' => 'fragment_1',
                'world_id' => 'world_1',
                'category' => 'fragment',
                'name' => 'Temporal Energy Fragment Alpha',
                'description' => 'A glowing azure crystal discovered near the ancient castle fountain.',
                'story_text' => 'It vibrates at a resonant frequency that feels older than the stones themselves.',
                'is_active' => true,
            ],
            [
                'id' => 'fragment_2',
                'world_id' => 'world_1',
                'category' => 'fragment',
                'name' => 'Temporal Energy Fragment Beta',
                'description' => 'A warm amber shard retrieved from the eastern colonnade.',
                'story_text' => 'Touching it reveals faint visions of scholars dressed in ceremonial robes.',
                'is_active' => true,
            ],
            [
                'id' => 'fragment_3',
                'world_id' => 'world_1',
                'category' => 'fragment',
                'name' => 'Temporal Energy Fragment Gamma',
                'description' => 'A brilliant violet crystal found near the sealed stone archway.',
                'story_text' => 'The final harmonic key required to loosen the ancient door seals.',
                'is_active' => true,
            ],
            [
                'id' => 'keystone_antiquity',
                'world_id' => 'world_1',
                'category' => 'artifact',
                'name' => 'Chrono Keystone of Antiquity',
                'description' => 'The sacred artifact recovered from the central courtyard pedestal.',
                'story_text' => 'Forged by the First Architects to focus raw Chrono Energy into stable temporal conduits.',
                'is_active' => true,
            ],

            // World 2
            [
                'id' => 'quantum_core_1',
                'world_id' => 'world_2',
                'category' => 'quantum_core',
                'name' => 'Quantum Energy Core Alpha',
                'description' => 'High-density zero-point cell recovered from the highway commuter bus.',
                'story_text' => 'Emits a steady 60Hz electronic hum, cold to the touch.',
                'is_active' => true,
            ],
            [
                'id' => 'quantum_core_2',
                'world_id' => 'world_2',
                'category' => 'quantum_core',
                'name' => 'Quantum Energy Core Beta',
                'description' => 'Stabilized isotopic cell reclaimed from the metro tunnel debris.',
                'story_text' => 'A prototype reactor component designed during the evacuation of Nova Prime.',
                'is_active' => true,
            ],
            [
                'id' => 'quantum_core_3',
                'world_id' => 'world_2',
                'category' => 'quantum_core',
                'name' => 'Quantum Energy Core Gamma',
                'description' => 'Advanced flux cell recovered from the subterranean security armory.',
                'story_text' => 'Possesses enough power to restart the core cooling turbine.',
                'is_active' => true,
            ],

            // World 3
            [
                'id' => 'shard_genesis',
                'world_id' => 'world_3',
                'category' => 'chrono_shard',
                'name' => 'Chrono Shard of Genesis',
                'description' => 'Solar-golden celestial crystal hovering above the West Overlook island.',
                'story_text' => 'Holds memories of when time was first woven into reality.',
                'is_active' => true,
            ],
            [
                'id' => 'shard_flux',
                'world_id' => 'world_3',
                'category' => 'chrono_shard',
                'name' => 'Chrono Shard of Flux',
                'description' => 'Violet astral crystal recovered from the East Anomaly bastion.',
                'story_text' => 'Pulses erratically, defying the gravity of the void.',
                'is_active' => true,
            ],
            [
                'id' => 'shard_singularity',
                'world_id' => 'world_3',
                'category' => 'chrono_shard',
                'name' => 'Chrono Shard of Singularity',
                'description' => 'Cyan hyper-crystal salvaged from the Deep Bastion ruins.',
                'story_text' => 'Resonates with the frequency of the Chronarch’s inner sanctum.',
                'is_active' => true,
            ],

            // World 4 / Story Codex
            [
                'id' => 'keystone_matrix_antiquity',
                'world_id' => 'world_final',
                'category' => 'artifact',
                'name' => 'Antiquity Epoch Keystone Receptor',
                'description' => 'Anchors the first timeline to the Continuum Synchronization Matrix.',
                'story_text' => 'Infused with the warmth of ancient suns and stone masonry.',
                'is_active' => true,
            ],
            [
                'id' => 'keystone_matrix_quantum',
                'world_id' => 'world_final',
                'category' => 'artifact',
                'name' => 'Quantum Flux Keystone Receptor',
                'description' => 'Anchors the second timeline to the Continuum Synchronization Matrix.',
                'story_text' => 'Glows with cybernetic cyan neon and holographic circuit lines.',
                'is_active' => true,
            ],
            [
                'id' => 'keystone_matrix_singularity',
                'world_id' => 'world_final',
                'category' => 'artifact',
                'name' => 'Singularity Keystone Receptor',
                'description' => 'Anchors the third timeline to the Continuum Synchronization Matrix.',
                'story_text' => 'Radiates astral violet starlight from the edge of the universe.',
                'is_active' => true,
            ],
        ];

        foreach ($collectibles as $c) {
            Collectible::updateOrCreate(['id' => $c['id']], $c);
        }

        // 4. Seed Real Feedback Tickets
        $feedbackSamples = [
            [
                'player_name' => 'AetherSeeker',
                'player_email' => 'aether@aervyn.local',
                'category' => 'gameplay',
                'subject' => 'Jump distance during sprint feels responsive',
                'message' => 'The sprint-jump transition in World 1 courtyard is super smooth. Loving the new camera angle!',
                'status' => 'resolved',
                'admin_notes' => 'Acknowledged. Camera spring system verified on 60fps.',
                'resolved_at' => now()->subDays(1),
            ],
            [
                'player_name' => 'TimeBreaker',
                'player_email' => 'breaker@aervyn.local',
                'category' => 'bug',
                'subject' => 'Phase bridge terminal prompt collision',
                'message' => 'In World 3, if I stand too far on the left edge of the bridge terminal, [E] prompt flickers.',
                'status' => 'in_progress',
                'admin_notes' => 'Investigating proximity radius in PhaseBridgeTerminal.jsx. Increased from 2.8 to 3.2.',
                'resolved_at' => null,
            ],
            [
                'player_name' => 'NexusPilot',
                'player_email' => 'pilot@aervyn.local',
                'category' => 'graphics',
                'subject' => 'Zero Horizon visual aesthetics are stunning',
                'message' => 'The reflection mirrors in World 4 showing the other three worlds are breathtaking. Great cinematic work!',
                'status' => 'new',
                'admin_notes' => null,
                'resolved_at' => null,
            ],
            [
                'player_name' => 'CyberDrifter',
                'player_email' => 'drifter@aervyn.local',
                'category' => 'audio',
                'subject' => 'Add option to adjust typewriter sound blip volume',
                'message' => 'The typewriter blips during dialogue are cool, but having a dedicated slider in settings would be great.',
                'status' => 'new',
                'admin_notes' => null,
                'resolved_at' => null,
            ],
        ];

        foreach ($feedbackSamples as $f) {
            Feedback::firstOrCreate(['subject' => $f['subject']], $f);
        }

        // 5. Seed Real Game Settings
        $settings = [
            ['key' => 'game_title', 'value' => 'AERVYN: Echoes of Time', 'description' => 'Official product title', 'category' => 'general'],
            ['key' => 'game_tagline', 'value' => 'Echoes of Time', 'description' => 'Brand subtitle', 'category' => 'general'],
            ['key' => 'maintenance_mode', 'value' => 'false', 'description' => 'Global server maintenance lock', 'category' => 'maintenance'],
            ['key' => 'support_email', 'value' => 'support@aervyn.local', 'description' => 'Support contact address', 'category' => 'support'],
            ['key' => 'announcement', 'value' => 'Campaign & Final Chapter 2.0 is live! Explore all 4 worlds and uncover the fate of time.', 'description' => 'In-game announcement marquee', 'category' => 'general'],
            ['key' => 'xp_multiplier', 'value' => '1.0', 'description' => 'Global experience reward multiplier', 'category' => 'gameplay'],
        ];

        foreach ($settings as $s) {
            GameSetting::updateOrCreate(['key' => $s['key']], $s);
        }

        // 6. Seed Sample Game Sessions for existing players
        $sampleSessions = [
            ['user_id' => 2, 'world_id' => 'world_1', 'started_at' => now()->subHours(5), 'ended_at' => now()->subHours(4)->addMinutes(35), 'duration_seconds' => 2100, 'xp_earned' => 500, 'completed' => true],
            ['user_id' => 2, 'world_id' => 'world_2', 'started_at' => now()->subHours(4), 'ended_at' => now()->subHours(3)->addMinutes(10), 'duration_seconds' => 1800, 'xp_earned' => 750, 'completed' => true],
            ['user_id' => 2, 'world_id' => 'world_3', 'started_at' => now()->subHours(3), 'ended_at' => now()->subHours(1)->addMinutes(50), 'duration_seconds' => 4200, 'xp_earned' => 1000, 'completed' => true],
            ['user_id' => 2, 'world_id' => 'world_final', 'started_at' => now()->subHours(1), 'ended_at' => now()->subMinutes(15), 'duration_seconds' => 2700, 'xp_earned' => 1500, 'completed' => true],
        ];

        foreach ($sampleSessions as $ss) {
            GameSession::firstOrCreate(
                ['user_id' => $ss['user_id'], 'world_id' => $ss['world_id'], 'started_at' => $ss['started_at']],
                $ss
            );
        }
    }
}

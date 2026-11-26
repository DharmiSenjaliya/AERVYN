<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PlayerProgress;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Administrator
        $admin = User::firstOrCreate(
            ['email' => 'admin@aervyn.local'],
            [
                'name' => 'System Director',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'level' => 99,
                'xp' => 50000,
                'is_active' => true,
            ]
        );

        // 2. Seed Default Explorer Player
        $player = User::firstOrCreate(
            ['email' => 'player@aervyn.local'],
            [
                'name' => 'ChronoWalker',
                'password' => Hash::make('password123'),
                'role' => 'player',
                'level' => 3,
                'xp' => 450,
                'is_active' => true,
            ]
        );

        // 3. Seed Player Progress for World 1
        PlayerProgress::firstOrCreate(
            ['user_id' => $player->id, 'world_id' => 'world_1'],
            [
                'current_mission' => 'Awakening the Keystone',
                'current_step' => 1,
                'completed_objectives' => [],
                'inventory' => [],
                'checkpoint_id' => 'start_courtyard',
                'checkpoint_position' => ['x' => 0, 'y' => 1, 'z' => 6],
                'is_completed' => false,
                'playtime_seconds' => 720,
            ]
        );
    }
}

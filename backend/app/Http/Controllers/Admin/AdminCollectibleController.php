<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collectible;
use App\Models\PlayerProgress;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminCollectibleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Collectible::with('world:id,title');

        if ($worldId = $request->input('world_id')) {
            $query->where('world_id', $worldId);
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $allProgress = PlayerProgress::whereNotNull('inventory')->get(['inventory']);

        $collectibles = $query->orderBy('world_id')->get()->map(function ($c) use ($allProgress) {
            // Count how many players collected this specific item
            $collectedCount = 0;
            foreach ($allProgress as $prog) {
                if (is_array($prog->inventory) && in_array($c->id, $prog->inventory)) {
                    $collectedCount++;
                }
            }

            return [
                'id' => $c->id,
                'world_id' => $c->world_id,
                'world_title' => $c->world?->title,
                'category' => $c->category,
                'name' => $c->name,
                'description' => $c->description,
                'story_text' => $c->story_text,
                'is_active' => $c->is_active,
                'times_collected' => $collectedCount,
                'updated_at' => $c->updated_at,
            ];
        });

        return response()->json([
            'success' => true,
            'collectibles' => $collectibles,
        ]);
    }

    public function show($id): JsonResponse
    {
        $collectible = Collectible::with('world:id,title')->find($id);

        if (!$collectible) {
            return response()->json([
                'success' => false,
                'message' => 'Collectible not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'collectible' => $collectible,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $collectible = Collectible::find($id);

        if (!$collectible) {
            return response()->json([
                'success' => false,
                'message' => 'Collectible not found.'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'required|string|max:1000',
            'story_text' => 'nullable|string|max:2000',
            'is_active' => 'required|boolean',
        ]);

        $oldState = $collectible->only(['name', 'description', 'story_text', 'is_active']);
        $collectible->update($validated);

        AdminActivityLog::log(
            'update_collectible',
            'Collectible',
            $collectible->id,
            [
                'collectible_id' => $collectible->id,
                'old_state' => $oldState,
                'new_state' => $validated,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => "Content '{$collectible->name}' updated successfully.",
            'collectible' => $collectible,
        ]);
    }
}

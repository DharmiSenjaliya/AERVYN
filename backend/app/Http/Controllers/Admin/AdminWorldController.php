<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\World;
use App\Models\PlayerProgress;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AdminWorldController extends Controller
{
    public function index(): JsonResponse
    {
        $worlds = World::withCount('missions')
            ->orderBy('display_order')
            ->get()
            ->map(function ($w) {
                $activeCount = PlayerProgress::where('world_id', $w->id)->count();
                $completedCount = PlayerProgress::where('world_id', $w->id)->where('is_completed', true)->count();
                $completionRate = $activeCount > 0 ? round(($completedCount / $activeCount) * 100, 1) : 0;

                return [
                    'id' => $w->id,
                    'title' => $w->title,
                    'epoch' => $w->epoch,
                    'description' => $w->description,
                    'thumbnail_url' => $w->thumbnail_url,
                    'display_order' => $w->display_order,
                    'is_active' => $w->is_active,
                    'required_level' => $w->required_level,
                    'missions_count' => $w->missions_count,
                    'active_players' => $activeCount,
                    'completed_players' => $completedCount,
                    'completion_rate' => $completionRate,
                    'updated_at' => $w->updated_at,
                ];
            });

        return response()->json([
            'success' => true,
            'worlds' => $worlds,
        ]);
    }

    public function show($id): JsonResponse
    {
        $world = World::with(['missions', 'collectibles'])->find($id);

        if (!$world) {
            return response()->json([
                'success' => false,
                'message' => 'World not found.'
            ], 404);
        }

        $activeCount = PlayerProgress::where('world_id', $world->id)->count();
        $completedCount = PlayerProgress::where('world_id', $world->id)->where('is_completed', true)->count();

        return response()->json([
            'success' => true,
            'world' => array_merge($world->toArray(), [
                'active_players' => $activeCount,
                'completed_players' => $completedCount,
            ]),
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $world = World::find($id);

        if (!$world) {
            return response()->json([
                'success' => false,
                'message' => 'World not found.'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'epoch' => 'required|string|max:100',
            'description' => 'required|string|max:1000',
            'display_order' => 'required|integer|min:1|max:100',
            'is_active' => 'required|boolean',
            'required_level' => 'required|integer|min:1|max:100',
        ]);

        $oldState = $world->only(['title', 'epoch', 'description', 'display_order', 'is_active', 'required_level']);
        $world->update($validated);

        AdminActivityLog::log(
            'update_world',
            'World',
            $world->id,
            [
                'world_id' => $world->id,
                'old_state' => $oldState,
                'new_state' => $validated,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => "World '{$world->title}' updated successfully.",
            'world' => $world,
        ]);
    }

    public function uploadThumbnail(Request $request, $id): JsonResponse
    {
        $world = World::find($id);

        if (!$world) {
            return response()->json([
                'success' => false,
                'message' => 'World not found.'
            ], 404);
        }

        $request->validate([
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // max 2MB
        ]);

        $file = $request->file('thumbnail');
        $filename = 'world_' . Str::slug($world->id) . '_' . time() . '.' . $file->getClientOriginalExtension();

        $destinationPath = public_path('assets/worlds');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $file->move($destinationPath, $filename);
        $world->thumbnail_url = '/assets/worlds/' . $filename;
        $world->save();

        AdminActivityLog::log(
            'upload_world_thumbnail',
            'World',
            $world->id,
            ['thumbnail_url' => $world->thumbnail_url]
        );

        return response()->json([
            'success' => true,
            'message' => 'World thumbnail uploaded successfully.',
            'thumbnail_url' => $world->thumbnail_url,
        ]);
    }
}

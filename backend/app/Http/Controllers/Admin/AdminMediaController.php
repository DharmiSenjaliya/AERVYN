<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class AdminMediaController extends Controller
{
    /**
     * List all media assets in the library.
     */
    public function index(Request $request)
    {
        $mediaPath = public_path('uploads/media');
        $thumbsPath = public_path('uploads/thumbnails');

        if (!File::isDirectory($mediaPath)) {
            File::makeDirectory($mediaPath, 0755, true, true);
        }
        if (!File::isDirectory($thumbsPath)) {
            File::makeDirectory($thumbsPath, 0755, true, true);
        }

        $items = [];

        // 1. Core Official Brand Asset
        $items[] = [
            'id' => 'system_logo',
            'filename' => 'aervyn-logo.png',
            'title' => 'Official AERVYN Brand Logo',
            'category' => 'general',
            'url' => '/assets/aervyn-logo.png',
            'mime_type' => 'image/png',
            'size_bytes' => 3003207,
            'size_formatted' => '2.86 MB',
            'created_at' => '2026-11-26 08:41:00',
            'is_system' => true
        ];

        // 2. Scan uploaded media
        $files = array_merge(
            File::files($mediaPath),
            File::files($thumbsPath)
        );

        foreach ($files as $file) {
            $filename = $file->getFilename();
            $path = $file->getPathname();
            $isThumb = str_contains($path, 'thumbnails');
            $subfolder = $isThumb ? 'thumbnails' : 'media';
            $size = $file->getSize();

            $items[] = [
                'id' => md5($filename),
                'filename' => $filename,
                'title' => ucwords(str_replace(['-', '_', '.'], ' ', pathinfo($filename, PATHINFO_FILENAME))),
                'category' => $isThumb ? 'thumbnail' : 'general',
                'url' => "/uploads/{$subfolder}/{$filename}",
                'mime_type' => File::mimeType($path) ?: 'image/png',
                'size_bytes' => $size,
                'size_formatted' => round($size / 1024, 1) . ' KB',
                'created_at' => date('Y-m-d H:i:s', $file->getMTime()),
                'is_system' => false
            ];
        }

        // Filter by category if requested
        $category = $request->query('category');
        if ($category && $category !== 'all') {
            $items = array_values(array_filter($items, fn($item) => $item['category'] === $category));
        }

        return response()->json([
            'status' => 'success',
            'total' => count($items),
            'data' => $items
        ]);
    }

    /**
     * Upload new media asset.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,webp|max:2048',
            'category' => 'nullable|string|in:thumbnail,banner,character,general',
            'title' => 'nullable|string|max:100'
        ]);

        $file = $request->file('file');
        $category = $request->input('category', 'general');
        $title = $request->input('title', pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));

        $dirName = $category === 'thumbnail' ? 'thumbnails' : 'media';
        $uploadDir = public_path("uploads/{$dirName}");

        if (!File::isDirectory($uploadDir)) {
            File::makeDirectory($uploadDir, 0755, true, true);
        }

        $safeName = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $file->getClientOriginalName());
        $file->move($uploadDir, $safeName);

        $savedPath = "{$uploadDir}/{$safeName}";
        $size = File::size($savedPath);

        AdminActivityLog::log(
            'MEDIA_UPLOAD',
            'media',
            $safeName,
            [
                'filename' => $safeName,
                'category' => $category,
                'size_bytes' => $size,
                'mime_type' => File::mimeType($savedPath)
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Asset uploaded successfully to game media library.',
            'data' => [
                'id' => md5($safeName),
                'filename' => $safeName,
                'title' => $title,
                'category' => $category,
                'url' => "/uploads/{$dirName}/{$safeName}",
                'mime_type' => File::mimeType($savedPath),
                'size_bytes' => $size,
                'size_formatted' => round($size / 1024, 1) . ' KB',
                'created_at' => date('Y-m-d H:i:s'),
                'is_system' => false
            ]
        ], 201);
    }

    /**
     * Delete an uploaded media asset.
     */
    public function destroy(Request $request, $filename)
    {
        // Sanitize filename against directory traversal
        $safeFilename = basename($filename);

        if ($safeFilename === 'aervyn-logo.png' || str_starts_with($safeFilename, 'aervyn-logo')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Official AERVYN brand assets cannot be deleted.'
            ], 403);
        }

        $mediaPath = public_path("uploads/media/{$safeFilename}");
        $thumbPath = public_path("uploads/thumbnails/{$safeFilename}");

        $deleted = false;
        if (File::exists($mediaPath)) {
            File::delete($mediaPath);
            $deleted = true;
        } elseif (File::exists($thumbPath)) {
            File::delete($thumbPath);
            $deleted = true;
        }

        if (!$deleted) {
            return response()->json([
                'status' => 'error',
                'message' => 'Asset file not found on disk.'
            ], 404);
        }

        AdminActivityLog::log(
            'MEDIA_DELETE',
            'media',
            $safeFilename,
            ['filename' => $safeFilename]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Asset successfully deleted from game library.'
        ]);
    }
}

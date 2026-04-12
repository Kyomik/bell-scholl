<?php

namespace App\Http\Controllers;

use App\Services\HariService;
use App\Services\SessionService;
use Illuminate\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\Session\StoreSesiRequest;
use App\Http\Requests\Session\UpdateSesiRequest;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Log;

class SessionController extends Controller
{
    use ApiResponse;

    private $hariService;

    public function __construct(SessionService $sessionService, HariService $hariService)
    {
        $this->sessionService = $sessionService;
        $this->hariService = $hariService;
    }

    public function index(): View
    {
        try {
            $haris = $this->hariService->getAllKodeHari();
            $sessions = $this->sessionService->getAllSessions();
            return view('main', compact('haris', 'sessions'));
            
        } catch (\Exception $e) {
            dd($e);
            return view('main', [
                'success' => false,
                'haris' => collect(),
                'sessions' => collect(),
                'message' => 'Gagal mengambil data: ' . $e->getMessage()
            ]);
        }
    }

    public function store(StoreSesiRequest $request): JsonResponse {
        try {
            $validated = $request->validated();
            Log::info('Validated data for creating session: ', $validated);
            $session = $this->sessionService->createSession($validated);
            
            return $this->successResponse($session);
        
        } catch (ValidationException $e) {
            return response()->json([
                'isSuccess' => false,
                'error' => $e->getMessage()
            ], 503);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateSesiRequest $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validated();

            $session = $this->sessionService->updateSession($id, $validated);

            return $this->successResponse($session);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {

            return $this->errorResponse('Session tidak ditemukan', 404);

        } catch (\Exception $e) {

            return $this->errorResponse('Gagal memperbarui session');
        }
    }

    public function destroy(string $time): JsonResponse
    {
        try {
            $this->sessionService->deleteSessionByTime($time);

            return $this->successResponse(['time' => $time]);

        } catch (ValidationException $e) {

            return response()->json([
                'isSuccess' => false,
                'error' => $e->getMessage()
            ], 503);
            
        } catch (\Exception $e) {

            return response()->json([
                'isSuccess' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroyAll(): JsonResponse
    {
        try {
            $this->sessionService->deleteAllSession();

            return $this->successResponse();

        } catch (\Exception $e) {

            return response()->json([
                'isSuccess' => false,
                'error' => 'Gagal menghapus semua session'
            ], 500);
        }
    }
}
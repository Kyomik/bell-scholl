<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    protected $apiGateway;
    protected $tokenManager;

    public function __construct(APIGateway $apiGateway, TokenManager $tokenManager)
    {
        $this->apiGateway = $apiGateway;
        $this->tokenManager = $tokenManager;
    }

    public function attemptLogin(array $credentials): ?array
    {
        $user = $this->validateCredentials($credentials);

        try {
            $tokenData = $this->apiGateway->getToken($user->role);
        } catch (ApiGatewayException $e) {
            // Log error jika perlu
            throw $e; // atau return null, tergantung kebutuhan
        }

        // Simpan token menggunakan TokenManager
        $this->tokenManager->setTokens(
            $tokenData['access_token'],
            $tokenData['refresh_token'],
            $tokenData['expires_in']
        );

        Auth::login($user);

        return $tokenData;
    }

    private function validateCredentials(array $credentials): ?object
    {
        if (!Auth::once($credentials)) {
            throw ValidationException::withMessages([
                'username' => ['Username atau password yang kamu masukkan salah.'],
            ]);
        }

        // Jika berhasil, ambil data user-nya
        return Auth::user();
    }
}
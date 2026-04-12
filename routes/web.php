<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\AuthController;

Route::middleware('guest')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::get('/login', 'showLoginForm')->name('login');
        Route::post('/login', 'login');
    });
});

Route::middleware('auth')->group(function () {
    Route::controller(SessionController::class)->group(function () {
        Route::get('/', 'index')->name('session.index');
    });
    
    Route::controller(AuthController::class)->group(function () {
        Route::post('/refresh', 'refresh');
        Route::post('logout', 'logout')->name('logout');
    });
});
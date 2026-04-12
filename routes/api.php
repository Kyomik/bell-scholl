<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::prefix('bell')->group(function () {
    Route::controller(SessionController::class)->group(function () {
        Route::post('/', 'store')->name('session.store');
        Route::delete('/{time}', 'destroy')->name('session.delete');
        Route::delete('/', 'destroyAll')->name('session.deleteAll');
        Route::put('/', 'update')->name('session.update');
    });
});
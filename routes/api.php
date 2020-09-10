<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TypeVehiclesController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// rutas para configuraciones
// vehiculos
Route::group([
    'prefix' => 'settings'
], function() {

    Route::get('/vehicles', [TypeVehiclesController::class, 'getAll']);
    Route::post('/vehicles', [TypeVehiclesController::class, 'store']);
    Route::post('/vehicles/destroy', [TypeVehiclesController::class, 'destory']);

});

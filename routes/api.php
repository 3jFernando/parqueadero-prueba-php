<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TypeVehiclesController;
use App\Http\Controllers\ParkingLotController;
use App\Http\Controllers\ClientsController;
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

// rutas para parquedero y acciones
Route::group([
    'prefix' => 'parking-lot'
], function() {

    Route::post('/space/change-state', [ParkingLotController::class, 'changeStateSpaceToParkingLot']);

});

// rutas para clientes
Route::group([
    'prefix' => 'clients'
], function() {

    Route::post('/', [ClientsController::class, 'store']);
    Route::get('/', [ClientsController::class, 'getAll']);

});

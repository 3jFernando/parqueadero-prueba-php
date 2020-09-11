<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TypeVehiclesController;
use App\Http\Controllers\ParkingLotController;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\ReportsController;
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

    Route::post('/transaction', [ParkingLotController::class, 'storeTransaction']);
    Route::post('/transaction/breakfree', [ParkingLotController::class, 'breakFreeTransaction']);

});

// rutas para clientes
Route::group([
    'prefix' => 'clients'
], function() {

    Route::post('/', [ClientsController::class, 'store']);
    Route::get('/', [ClientsController::class, 'getAll']);
    Route::post('/destroy', [ClientsController::class, 'destroyClient']);
    Route::post('/vehicles', [ClientsController::class, 'storeVehicle']);
    Route::post('/vehicles/destroy', [ClientsController::class, 'destroyVehicle']);

});

// rutas para repotes
Route::group([
    'prefix' => 'reports'
], function() {

    Route::post('/most-used-parking', [ReportsController::class, 'mostUsedParking']);
    Route::post('/entry-and-exit-transactions', [ReportsController::class, 'entryAndExitTransactions']);
    Route::post('/number-of-vehicles-entered', [ReportsController::class, 'numberOfVehiclesEntered']);
    Route::post('/amount-obtained-per-day', [ReportsController::class, 'amountObtainedPerDay']);

});

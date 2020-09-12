<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientVehicle;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\TypeVehicleDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

date_default_timezone_set("America/Bogota");

class ParkingLotController extends Controller
{

    /*
     * cambiar el estado de un espacio de uno de los parqueaderos
     * */
    public function storeTransaction(Request $request)
    {
        DB::beginTransaction();
        try {

            // validar la zona de parqueo
            $spaceData = TypeVehicleDetail::select('t.rate', 'types_vehicles_details.*')
                ->join('types_vehicles as t', 't.id', '=', 'types_vehicles_details.id_type_vehicle');

            if($request->useParkingLotRandom) { // parqueadero aletorio
                $space = $spaceData->where('t.id', $request->typeVehicle)->where('state', 0)->first();
            } else { // espacio seleciconado por el usuario
                $space = $spaceData->where('types_vehicles_details.id', $request->idSpace)->first();
            }
            if($space === null) return response()->json(['status' => 460], 200);

            // validar el cliente
            $client = Client::find($request->client);
            if($client === null) return response()->json(['status' => 480], 200);

            // validar el vehiclo del cliente
            $vehicle = ClientVehicle::find($request->vehicle);
            if($vehicle === null) return response()->json(['status' => 470], 200);

            // crear la transaccion
            $transaction = new Transaction();

            $transaction->id_client = $client->id;
            $transaction->date_start = \Carbon\Carbon::now();
            $transaction->total = $space->rate;

            $transaction->save();

            // vehiculos del parqueo
            $details = new TransactionDetail();

            $details->id_transaction = $transaction->id;
            $details->id_vehicle = $vehicle->id;
            $details->rate = $space->rate;
            $details->parkinglot = $space->id;
            $details->save();

            // ocupar espacio
            $space->state = 1;
            $space->save();

            DB::commit();
            return response()->json(['status' => 200, 'space' => $space], 200);
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([],500);
        }
    }


    /*
     * desocupar estacionamiento
     * poner en estado libre
     * transacion completada
     * totalizar, guardar fechas
     * */
    public function breakFreeTransaction(Request $request)
    {
        DB::beginTransaction();
        try {

            // validar la zona de parqueo
            // liberar espacio
            $space = TypeVehicleDetail::find($request->parkinglot);
            if($space !== null) {
                $space->state = 0;
                $space->save();
            }

            // validar la transaccion
            $transaction = Transaction::find($request->idTransaction);
            if($transaction === null) return response()->json(['status' => 470], 200);

            // actualizar datos de la transaccion
            $transaction->date_end = Carbon::parse($request->date_end)->format('Y-m-d H:i:s');
            $transaction->total = $request->total;
            $transaction->time = $request->time;
            $transaction->state = 1;

            $transaction->save();

            DB::commit();
            return response()->json(['status' => 200], 200);
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([],500);
        }
    }

}

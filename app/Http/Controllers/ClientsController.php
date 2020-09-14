<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientVehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientsController extends Controller
{

    /*
     * cargar todos los clientes
     * */
    public function getAll()
    {
        $clientsData = Client::all();
        $clients = [];

        foreach ($clientsData as $client) {

            $vehicles = ClientVehicle::select('t.type', 't.rate', 'clients_vehicles.*')
                    ->join('types_vehicles as t', 't.id', '=', 'clients_vehicles.id_type')
                    ->where('id_client', $client->id)->get() ?? [];
            $client->vehicles = $vehicles;

            array_push($clients, $client);
        }


        return response()->json(['clients' => $clients], 200);
    }

    /*
     * crear cliente
     * */
    public function store(Request $request)
    {
        try {

            // validar que no existe el numero de identificacion
            $exist = Client::where('number', $request->number)->first();
            if($exist !== null) return response()->json(['status' => 460], 200);

            $client = new Client();

            $client->name = $request->name;
            $client->number = $request->number;

            $client->save();

            return response()->json(['status' => 200, 'client' => $client], 200);
        } catch(\Exception $e) {
            return response()->json([],500);
        }
    }

    /*
     * crear vehiculos para los clientes
     * */
    public function storeVehicle(Request $request)
    {
        try {

            // validar que el vehiclo a ingresar no exista ya, por lo menos con la mimsa placa, para el mismo cliente
            $valid = ClientVehicle::where('id_client', $request->idClient)->where('id_type', $request->type)->where('code', $request->code)->first();
            if($valid !== null) return response()->json(['status' => 460], 200);
            $vehicle = new ClientVehicle();

            $vehicle->id_client = $request->idClient;
            $vehicle->id_type = $request->type;
            $vehicle->code = $request->code;

            $vehicle->save();

            return response()->json(['status' => 200, 'vehicle' => $vehicle], 200);
        } catch(\Exception $e) {
            return response()->json([],500);
        }
    }

    /*
     * eliminar vehiculos de los clientes
     * */
    public function destroyVehicle(Request $request)
    {
        DB::beginTransaction();
        try {

            $vehicle = ClientVehicle::find($request->id);
            if(!$vehicle === null) return response()->json(['status' => 460], 200);

            try {
                $vehicle->delete();
                DB::commit();
                return response()->json(['status' => 200], 200);
            } catch (\Exception $e){
                DB::rollBack();
                return response()->json(['status' => 470], 200);
            }
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([],500);
        }
    }

    /*
     * eliminar clientes
     * */
    public function destroyClient(Request $request)
    {
        DB::beginTransaction();
        try {

            $client = Client::find($request->id);
            if(!$client === null) return response()->json(['status' => 460], 200);

            try {
                $client->delete();
                DB::commit();
                return response()->json(['status' => 200], 200);
            } catch (\Exception $e){
                DB::rollBack();
                return response()->json(['status' => 470], 200);
            }
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([],500);
        }
    }
}

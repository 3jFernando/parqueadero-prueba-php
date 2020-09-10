<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientVehicle;
use Illuminate\Http\Request;

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

            $vehicles = ClientVehicle::select('t.type', 't.rate', 'client_vehicles.*')
                    ->join('type_vehicles as t', 't.id', '=', 'client_vehicles.id_type')
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
            return response()->json(500);
        }
    }

    /*
     * crear vehiculos para los clientes
     * */
    public function storeVehicle(Request $request)
    {
        try {

            $vehicle = new ClientVehicle();

            $vehicle->id_client = $request->idClient;
            $vehicle->id_type = $request->type;
            $vehicle->code = $request->code;

            $vehicle->save();

            return response()->json(['status' => 200, 'vehicle' => $vehicle], 200);
        } catch(\Exception $e) {
            return response()->json(500);
        }
    }

    /*
     * eliminar vehiculos de los clientes
     * */
    public function destroyVehicle(Request $request)
    {
        try {

            $vehicle = ClientVehicle::find($request->id);
            if(!$vehicle === null) return response()->json(['status' => 460], 200);

            try {
                $vehicle->delete();
                return response()->json(['status' => 200], 200);
            } catch (\Exception $e){
                return response()->json(['status' => 470], 200);
            }
        } catch(\Exception $e) {
            return response()->json(500);
        }
    }

    /*
     * eliminar clientes
     * */
    public function destroyClient(Request $request)
    {
        try {

            $client = Client::find($request->id);
            if(!$client === null) return response()->json(['status' => 460], 200);

            try {
                $client->delete();
                return response()->json(['status' => 200], 200);
            } catch (\Exception $e){
                return response()->json(['status' => 470], 200);
            }
        } catch(\Exception $e) {
            return response()->json(500);
        }
    }
}

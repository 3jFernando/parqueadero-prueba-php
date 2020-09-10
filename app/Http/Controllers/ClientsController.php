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
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\TpeVehicle;

class TypeVehiclesController extends Controller
{
    /*
     * cargar todos los tipos de vehiculos
     * */
    public function getAll()
    {
        $types = TpeVehicle::all();
        return response()->json(['types' => $types], 200);
    }

    /*
     * crear tipos de vehiculos
     * */
    public function store(Request $request)
    {
        try {

            $type = new TpeVehicle();

            $type->type = $request->type;
            $type->cant = $request->cant;
            $type->rate = $request->rate;

            $type->save();

            return response()->json(['status' => 200, 'type' => $type], 200);
        } catch(\Exception $e) {
            return response()->json(500);
        }
    }

    /*
     * crear tipos de vehiculos
     * */
    public function destory(Request $request)
    {
        try {

            $type = TpeVehicle::find($request->id);
            if($type === null) return response()->json(['status' => 460], 200);

            $type->delete();

            return response()->json(['status' => 200, 'id' => $request->id], 200);
        } catch(\Exception $e) {
            return response()->json(500);
        }
    }
}

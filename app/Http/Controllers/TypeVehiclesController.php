<?php

namespace App\Http\Controllers;

use App\Models\TypeVehicleDetail;
use Illuminate\Http\Request;

use App\Models\TypeVehicle;

class TypeVehiclesController extends Controller
{
    /*
     * cargar todos los tipos de vehiculos
     * */
    public function getAll()
    {
        $typesData = TypeVehicle::all();
        $types = [];

        foreach ($typesData as $type) {

            $details = TypeVehicleDetail::where('id_type_vehicle', $type->id)->get() ?? [];
            $type->details = $details;

            array_push($types, $type);
        }


        return response()->json(['types' => $types], 200);
    }

    /*
     * crear tipos de vehiculos
     * */
    public function store(Request $request)
    {
        try {

            $type = new TypeVehicle();

            $type->type = $request->type;
            $type->cant = $request->cant;
            $type->rate = $request->rate;

            $type->save();

            // crear detalles
            for ($i = 1; $i <= $type->cant; $i++) {
                TypeVehicleDetail::insert([
                    'id_type_vehicle' => $type->id,
                    'code' => $i,
                    'state' => 0
                ]);
            }

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

            $type = TypeVehicle::find($request->id);
            if($type === null) return response()->json(['status' => 460], 200);

            // detalles
            $details = TypeVehicleDetail::where('id_type_vehicle', $type->id)->get();
            foreach ($details as $detail) $detail->delete();

            $type->delete();

            return response()->json(['status' => 200, 'id' => $request->id], 200);
        } catch(\Exception $e) {
            return response()->json(500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\TypeVehicle;
use App\Models\TypeVehicleDetail;
use Illuminate\Http\Request;

class ParkingLotController extends Controller
{
    /*
     * cambiar el estado de un espacio de uno de los parqueaderos
     * */
    public function changeStateSpaceToParkingLot(Request $request)
    {
        try {

            $space = TypeVehicleDetail::find($request->id);
            if($space === null) return response()->json(['status' => 460], 200);

            $space->state = ($space->state === 0) ? 1 : 0;
            $space->save();

            return response()->json(['status' => 200, 'space' => $space], 200);
        } catch(\Exception $e) {
            return response()->json(500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\TypeVehicleDetail;
use Illuminate\Http\Request;

use App\Models\TypeVehicle;
use Illuminate\Support\Facades\DB;

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

            // datos del tipo de vehiculo
            $detailsData = TypeVehicleDetail::where('id_type_vehicle', $type->id)->get() ?? [];
            $details = [];
            // si el estado del estacionamiento (espacio) es ocuapdo entonces se busca la transaccion actual
            foreach ($detailsData as $item) {

                // transacciones
                // detalles de la transaccion (veiculo)
                // cliente
                $transaction = Transaction::select('transactions.*', 'v.code', 'c.name', 'c.number', 'td.parkinglot', 'td.id as idtd')
                    ->join('clients as c', 'c.id', '=', 'transactions.id_client')
                    ->join('transactions_details as td', 'td.id_transaction', '=', 'transactions.id')
                    ->join('clients_vehicles as v', 'v.id', '=', 'td.id_vehicle')
                    ->where('td.parkinglot', $item->id)
                    ->where('transactions.state', 0)->first();
                $item->transaction = $transaction;

                array_push($details, $item);
            }

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
        DB::beginTransaction();
        try {

            if($request->editing) {
                $type = TypeVehicle::find($request->itemEditingID);
            } else {

                // validar que el tipo no exista
                $validTypeExist = TypeVehicle::where('type', $request->type)->first();
                if($validTypeExist !== null) return response()->json(['status' => 460], 200);

                $type = new TypeVehicle();

                $type->type = $request->type;
                $type->cant = $request->cant;

            }

            $type->rate = $request->rate;
            $type->save();

            if(!$request->editing) {
                // crear detalles
                for ($i = 1; $i <= $type->cant; $i++) {
                    TypeVehicleDetail::insert([
                        'id_type_vehicle' => $type->id,
                        'code' => $i,
                        'state' => 0
                    ]);
                }
            }

            DB::commit();
            return response()->json(['status' => 200, 'type' => $type], 200);
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([],500);
        }
    }

    /*
     * eliminar tipos de vehiculos
     * */
    public function destory(Request $request)
    {
        DB::beginTransaction();
        try {

            $type = TypeVehicle::find($request->id);
            if($type === null) return response()->json(['status' => 460], 200);

            // detalles
            $details = TypeVehicleDetail::where('id_type_vehicle', $type->id)->get();
            foreach ($details as $detail) $detail->delete();

            $type->delete();

            DB::commit();
            return response()->json(['status' => 200, 'id' => $request->id], 200);
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([],500);
        }
    }
}

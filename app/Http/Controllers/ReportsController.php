<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{

    public function mostUsedParking(Request $request)
    {

        $data = DB::table('transactions_details')->select(DB::raw('COUNT(transactions_details.id) as cant'), 'v.type')
            ->join('types_vehicles_details as t', 't.id', '=', 'transactions_details.parkinglot')
            ->join('types_vehicles as v', 'v.id', '=', 't.id_type_vehicle')
            ->join('transactions', 'transactions.id', '=', 'transactions_details.id_transaction')
            ->whereBetween(DB::raw('DATE(transactions.date_start)'), [$request->since, $request->until])
            ->groupBy('v.type')
            ->orderBy('cant', 'DESC')
            ->limit(1)
            ->get();

        return response()->json(['data' => $data], 200);
    }

    public function entryAndExitTransactions(Request $request)
    {
        $data = DB::table('transactions_details')->select('t.*', 'c.name', 'c.number','tv.type', 'cv.code')
            ->join('clients_vehicles as cv', 'cv.id', '=', 'transactions_details.id_vehicle')
            ->join('transactions as t', 't.id', '=', 'transactions_details.id_transaction')
            ->join('clients as c', 'c.id', '=', 't.id_client')
            ->join('types_vehicles_details as tvd', 'tvd.id', '=', 'transactions_details.parkinglot')
            ->join('types_vehicles as tv', 'tv.id', '=', 'tvd.id_type_vehicle')
            ->whereBetween(DB::raw('DATE(t.date_start)'), [$request->since, $request->until])
            ->orderBy('t.id', 'DESC')
            ->get();

        return response()->json(['data' => $data], 200);
    }

    public function numberOfVehiclesEntered(Request $request)
    {
        $data = DB::table('transactions_details')->select(DB::raw('COUNT(transactions_details.id) as cant'), 'v.type')
            ->join('types_vehicles_details as t', 't.id', '=', 'transactions_details.parkinglot')
            ->join('types_vehicles as v', 'v.id', '=', 't.id_type_vehicle')
            ->join('transactions', 'transactions.id', '=', 'transactions_details.id_transaction')
            ->whereBetween(DB::raw('DATE(transactions.date_start)'), [$request->since, $request->until])
            ->groupBy('v.type')
            ->orderBy('cant', 'DESC')
            ->get();

        return response()->json(['data' => $data], 200);
    }

    public function amountObtainedPerDay(Request $request)
    {
        $data = DB::table('transactions')->select(DB::raw('SUM(transactions.total) as total'))
            ->where('transactions.state', 1)
            ->whereBetween(DB::raw('DATE(transactions.date_start)'), [$request->since, $request->until])
            ->get();

        return response()->json(['data' => $data], 200);
    }

}

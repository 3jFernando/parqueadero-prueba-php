<?php

namespace Database\Seeders;

use App\Http\Controllers\TypeVehiclesController;
use Illuminate\Database\Seeder;
use Illuminate\Http\Request;

class TypeVehiclesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $types = [
            ['type' => 'automóviles', 'cant' => 10],
            ['type' => 'motos', 'cant' => 20],
            ['type' => 'bicicletas', 'cant' => 10]
        ];

        foreach ($types as $type) {

            $request = new Request();

            $request->type = $type['type'];
            $request->cant = $type['cant'];
            $request->rate = 0;

            (new TypeVehiclesController())->store($request);
        }

    }
}

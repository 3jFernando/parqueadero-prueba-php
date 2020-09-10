<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTypeVehicleDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('type_vehicle_details', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_type_vehicle');

            $table->string('code')->nullable();
            $table->integer('state')->default(0);

            $table->foreign('id_type_vehicle')->references('id')->on('type_vehicles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('type_vehicle_details');
    }
}

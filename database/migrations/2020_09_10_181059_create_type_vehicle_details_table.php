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
        Schema::create('types_vehicles_details', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_type_vehicle');

            $table->string('code')->nullable();
            $table->integer('state')->default(0);

            $table->foreign('id_type_vehicle')->references('id')->on('types_vehicles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('types_vehicles_details');
    }
}

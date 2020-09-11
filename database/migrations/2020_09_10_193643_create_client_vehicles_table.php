<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientVehiclesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clients_vehicles', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_client');
            $table->unsignedBigInteger('id_type');

            $table->string('code');

            $table->foreign('id_client')->references('id')->on('clients');
            $table->foreign('id_type')->references('id')->on('types_vehicles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clients_vehicles');
    }
}

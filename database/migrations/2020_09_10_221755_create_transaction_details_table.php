<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions_details', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_transaction');
            $table->unsignedBigInteger('id_vehicle');

            $table->float('rate', 24, 2)->default(0);
            $table->integer('parkinglot')->nullable();

            $table->foreign('id_transaction')->references('id')->on('transactions');
            $table->foreign('id_vehicle')->references('id')->on('clients_vehicles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions_details');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = "transactions_details";

    protected $fillable = [
        'id',
        'id_transaction',
        'id_vehicle',
        'rate'
    ];

    public function Transaction()
    {
        return $this->belongsTo(Transaction::class, 'id_transaction');
    }

    public function Vehicle()
    {
        return $this->belongsTo(ClientVehicle::class, 'id_vehicle');
    }

}

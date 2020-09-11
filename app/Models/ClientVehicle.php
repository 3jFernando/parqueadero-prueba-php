<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientVehicle extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = "clients_vehicles";

    protected $fillable = [
        'id',
        'id_client',
        'id_type',
        'code'
    ];

    public function Client()
    {
        return $this->belongsTo(Client::class, 'id_client');
    }

    public function TypeVehicle()
    {
        return $this->belongsTo(TypeVehicle::class, 'id_type');
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeVehicleDetail extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = "type_vehicle_details";

    protected $fillable = [
        'id',
        'id_type_vehicle',
        'code',
        'state'
    ];

    public function TypeVehicle()
    {
        return $this->belongsTo(TypeVehicle::class, 'id_type_vehicle');
    }

}

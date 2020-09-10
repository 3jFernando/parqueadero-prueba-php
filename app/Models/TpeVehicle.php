<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TpeVehicle extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = "type_vehicles";

    protected $fillable = [
      'id',
      'type',
      'cant',
      'rate'
    ];

}

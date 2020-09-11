<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeVehicle extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = "types_vehicles";

    protected $fillable = [
      'id',
      'type',
      'cant',
      'rate'
    ];

}

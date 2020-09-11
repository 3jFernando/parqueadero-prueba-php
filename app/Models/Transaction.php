<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = "transactions";

    protected $fillable = [
        'id',
        'id_client',
        'date_start',
        'date_end',
        'total',
        'time'
    ];

    public function Client()
    {
        return $this->belongsTo(Client::class, 'id_client');
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hari extends Model
{
    use HasFactory;

    protected $table = 'haris';
    public $timestamps = false;
    
    protected $fillable = [
        'nama_hari',
        'kode_hari',
    ];

    public function sessions()
    {
        return $this->hasMany(Session::class, 'id_hari');
    }
}
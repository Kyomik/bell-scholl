<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory;
    
    protected $table = 'users'; // Nama tabel
    public $incrementing = true;
    public $timestamps = false;
    
    protected $fillable = [
        'username',
        'password',
        'nama',
        'role'
    ];

    protected $hidden = [
        'password', // Agar password tidak ikut muncul saat data di-convert ke JSON/Array
    ];
}

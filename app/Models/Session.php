<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Session extends Model
{
    use HasFactory;

    protected $table = 'sessions';
    public $timestamps = false;
    
    protected $fillable = [
        'jam',
        'audio',
        'id_hari',
    ];
    
    public function getJamAttribute($value)
    {
        return Carbon::parse($value)->format('H:i');
    }

    public function hari()
    {
        return $this->belongsTo(Hari::class, 'id_hari');
    }

    public function getHariStringAttribute()
    {
        return $this->hari?->nama_hari;
    }

    public function getKodeHariAttribute()
    {
        return $this->hari?->kode_hari;
    }
}
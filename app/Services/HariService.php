<?php

namespace App\Services;

use App\Models\Hari;
use Illuminate\Support\Collection;

class HariService
{
    public function getAllKodeHari(): Collection
    {
        try {
            return Hari::pluck('kode_hari');
        } catch (\Exception $e) {
            return collect();
        }
    }
}
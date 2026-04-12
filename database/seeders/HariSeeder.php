<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hari;

class HariSeeder extends Seeder
{
    public function run()
    {
        $hari = [
            ['nama_hari' => 'Senin', 'kode_hari' => 'SEN'],
            ['nama_hari' => 'Selasa', 'kode_hari' => 'SEL'],
            ['nama_hari' => 'Rabu', 'kode_hari' => 'RAB'],
            ['nama_hari' => 'Kamis', 'kode_hari' => 'KAM'],
            ['nama_hari' => 'Jumat', 'kode_hari' => 'JUM'],
            ['nama_hari' => 'Sabtu', 'kode_hari' => 'SAB'],
            ['nama_hari' => 'Minggu', 'kode_hari' => 'MIN'],
        ];

        foreach ($hari as $h) {
            Hari::create($h);
        }
    }
}
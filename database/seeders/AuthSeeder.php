<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cukup satu kali create karena data profil & login jadi satu
        User::create([
            'username' => 'admin',
            'password' => Hash::make('123'),
            'nama'     => 'Administrator',
            'role'     => 'user', // Tambahkan role jika ada
        ]);

        $this->command->info('Admin user created successfully!');
    }
}
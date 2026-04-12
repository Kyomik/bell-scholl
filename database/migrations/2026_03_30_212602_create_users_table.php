<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // id auto-increment primary key
            $table->string('username')->unique(); // username unik
            $table->string('password');
            $table->string('nama');
            $table->enum('role', ['user'])->default('user'); // role
            // kalau timestamp mau pakai, bisa tambah:
            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
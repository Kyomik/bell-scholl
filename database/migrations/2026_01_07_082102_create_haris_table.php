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
        Schema::create('sessions', function (Blueprint $table) {
            $table->id();
            $table->time('jam');
            $table->unsignedBigInteger('id_hari');
            $table->string('audio');

            $table->foreign('id_hari')
                ->references('id')
                ->on('haris')
                ->cascadeOnDelete();

            $table->unique(['jam', 'id_hari']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};

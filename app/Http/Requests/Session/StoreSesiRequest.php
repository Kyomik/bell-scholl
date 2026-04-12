<?php

namespace App\Http\Requests\Session;

use Illuminate\Foundation\Http\FormRequest;

class StoreSesiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'time' => 'required|date_format:H:i',
            'audio'  => 'required|string|max:255',
            'days'   => 'required|array|min:1',
            'days.*' => 'required|string|exists:haris,kode_hari',
        ];
    }

    public function messages(): array
    {
        return [
            'time.required'    => 'Waktu alarm harus diisi.',
            'time.date_format' => 'Format waktu harus jam:menit (contoh: 07:30).',

            'audio.required'   => 'Suara bel harus dipilih.',
            'audio.string'     => 'Format pilihan suara tidak valid.',
            
            'days.required'    => 'Pilih minimal satu hari untuk alarm ini.',
            'days.array'       => 'Data hari harus berupa pilihan jamak.',
            'days.min'         => 'Pilih setidaknya satu hari.',
            
            'days.*.exists'    => 'Salah satu hari yang dipilih tidak terdaftar di sistem.',
            'days.*.string'    => 'Format kode hari harus berupa teks.',
        ];
    }
}
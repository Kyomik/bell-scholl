<?php

namespace App\Services;

use App\Models\TransaksiHari;
use App\Models\Session;
use App\Models\Hari;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SessionService
{
    public function getAllSessions()
    {
        $sessions = Session::with('hari')->latest('id')->get();

        // 🔹 group by jam + audio
        $grouped = $sessions->groupBy(fn($s) => $s->jam . '|' . $s->audio);

        $result = $grouped->map(function ($group) {
            $first = $group->first();

            return [
                'time' => $first->jam,
                'audio' => $first->audio,
                'days' => $group->map(fn($s) => $s->kode_hari)->unique()->values()->toArray(), // gabungkan & hapus duplikat
            ];
        })->values(); // reset key index

        return $result;
    }

    public function createSession(array $data)
    {
        DB::beginTransaction();

        try {
            // Ambil semua hari yang valid dari kode hari input
            $hariList = Hari::whereIn('kode_hari', $data['days'])->get();
            if ($hariList->isEmpty()) {
                throw new \InvalidArgumentException('Kode hari tidak valid.');
            }

            // 🔹 Cek duplikat dulu, kumpulkan semua hari conflict
            $conflicts = [];
            foreach ($hariList as $hari) {
                $exists = Session::where('jam', $data['time'])
                    ->where('id_hari', $hari->id)
                    ->exists();

                if ($exists) {
                    $conflicts[] = $hari->nama_hari;
                }
            }

            // Jika ada conflict, throw sekali dengan semua hari
            if (!empty($conflicts)) {
                throw ValidationException::withMessages([
                    'time' => ["Jam {$data['time']} sudah ada di hari: " . implode(', ', $conflicts)]
                ]);
            }

            // 🔹 Buat session per hari kalau tidak ada conflict
            $sessions = [];
            foreach ($hariList as $hari) {
                $sessions[] = Session::create([
                    'jam' => $data['time'],
                    'audio' => $data['audio'],
                    'id_hari' => $hari->id,
                ]);
            }

            DB::commit();

            $sessions = collect($sessions);

            return [
                'time' => $sessions[0]->jam,
                'audio' => $sessions[0]->audio,
                'days' => $sessions->map(fn($s) => $s->kode_hari)->toArray(),
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function validateAndGetHariIds(array $dayCodes): array
    {
        $validHariIds = Hari::whereIn('kode_hari', $dayCodes)->pluck('id')->toArray();
        
        if (count($validHariIds) !== count($dayCodes)) 
            throw new \InvalidArgumentException('Beberapa kode hari tidak ditemukan di database.');

        return $validHariIds;
    }
    
    public function updateSession(int $id, array $data)
    {
        DB::beginTransaction();

        try {
            $oldSession = Session::findOrFail($id);

            // hapus session lama
            $oldSession->delete();

            // buat ulang seperti create
            $newSessions = $this->createSession($data);

            DB::commit();

            return $newSessions;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    public function deleteSessionByTime(string $time)
    {
        $sessions = Session::where('jam', $time)->get();

        if ($sessions->isEmpty()) {
            throw new \InvalidArgumentException("Tidak ada session dengan jam $time.");
        }

        // Hapus semua row dengan jam itu
        Session::where('jam', $time)->delete();
    }

    public function deleteAllSession()
    {
        if (Session::count() === 0) {
            throw new \InvalidArgumentException('Data sudah kosong.');
        }

        Session::query()->delete();
    }
}
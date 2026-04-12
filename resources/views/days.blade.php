<div class="days-selection" id="days-selection" data-haris="{{ $haris }}">
    <span class="days-label">Hari Aktif:</span>
    <div class="days-grid">
        @forelse ($haris as $hari)
            <button type="button" class="day-btn weekday" data-day='{{ $hari }}'>{{ $hari }}</button>
        @empty
            <p>Belum ada Hari</p>
        @endforelse
    </div>
</div>

<div class="card-face card-back">
    <div class="card-header">
        <h2 class="card-title"><i class="fas fa-list"></i> Daftar Bell</h2>
        <button type="button" class="flip-btn" id="flip-to-setup">
            <i class="fas fa-cog"></i>
        </button>
    </div>
    
    <div class="alarm-list" id="alarm-list" data-alarms="{{ $sessions }}">
        <!-- Alarm items will be added here dynamically -->
    </div>
    
    <div class="control-buttons">
        <button class="btn btn-primary" id="sync-alarms">
            <i class="fas fa-sync-alt"></i> Sync
        </button>
        <button class="btn btn-secondary" id="clear-all">
            <i class="fas fa-trash"></i> Hapus Semua
        </button>
    </div>
</div>
<form class="card-face card-front" action="{{ route('session.store') }}" method="POST">
    @csrf
    <div class="card-header">
        <h2 class="card-title"><i class="far fa-clock"></i> Atur Bell</h2>
        <button type="button" class="flip-btn" id="flip-to-list">
            <i class="fas fa-list"></i>
        </button>
    </div>
    
    @include('times')
    
    @include('days')

    @include('audios')
    
    <div class="control-buttons">
        <button type="submit" class="btn btn-primary" id="add-alarm" disabled>
            <i class="fas fa-plus-circle"></i> Simpan
        </button>
        <button type="button" class="btn btn-secondary" id="reset-time">
            <i class="fas fa-redo"></i> Reset
        </button>
    </div>
</form>
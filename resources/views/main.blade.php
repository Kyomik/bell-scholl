@extends('layout')

@section('content')
<div class="container">
  <div class="card-container">
    <div class="card" id="main-card">
      @include('card-front')
      @include('card-back')
    </div>
  </div>
</div>
@endsection

@include('contact-spinner')
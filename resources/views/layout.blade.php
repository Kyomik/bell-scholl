<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="websocket-url" content="{{ config('services.nodejs.ws_url') }}">
    
    <title>@yield('title', 'Pengatur Jam Bell IoT')</title>
    
    @vite('resources/css/app.css')
    @stack('styles') {{-- 🔥 tambahan CSS per halaman --}}
</head>
<body>
    @yield('content')
    
    @vite('resources/js/app.js')
    @stack('scripts') {{-- 🔥 tambahan JS per halaman --}}
</body>
</html>
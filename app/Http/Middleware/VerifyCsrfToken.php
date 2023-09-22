<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     * '/gestioneventos'
     */

    protected $except = [
        'http://192.168.20.20:8000/gestioneventos'
    ];
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create()
    {
        return redirect()->intended(RouteServiceProvider::HOME);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $this->setDataSession($request);
        $request->session()->regenerate();
        return redirect()->intended(RouteServiceProvider::HOME);
    }

    public function setDataSession($request){
        if($request->remember){
            setcookie("password", $request->password, time()+60*60*24*365);
            setcookie("email", $request->email, time()+60*60*24*365);
        }else{
            setcookie("email", "", time()-1);
            setcookie("password", "", time()-1);
        }   
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}

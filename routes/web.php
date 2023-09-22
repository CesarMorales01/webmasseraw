<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\ShoppingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ProductController::class, 'index'])->name('index');
Route::get('/contact', [SessionController::class, 'contact'])->name('contact');
Route::get('/log/{email?}', [SessionController::class, 'login'])->name('gologin');
Route::get('/product/{id}', [ProductController::class, 'product'])->name('product.id');
Route::get('/product/search/{name}', [ProductController::class, 'searchProduct'])->name('product.search');
Route::get('/profile', [ProfileController::class, 'create'])->name('profile.create');
Route::get('/profile/checkemail/{email}', [ProfileController::class, 'checkemail']);
Route::post('/profile/store', [ProfileController::class, 'store'])->name('profile.store');
Route::get('/question/{id}', [QuestionController::class, 'questionsById']);
Route::post('/gestioneventos', [ShoppingController::class, 'gestionEventos']);

Route::middleware('auth')->group(function () {
   Route::post('/question', [QuestionController::class, 'store']);
   Route::resource('/shopping', ShoppingController::class)->except(['index', 'destroy', 'update']);
   Route::post('/shopping/registrar/compra', [ShoppingController::class, 'registrarcompra']);
   Route::get('/shopping/{codigo}/{cant}', [ShoppingController::class, 'actualizarCarrito']);
   Route::get('/shopping/eliminar/producto/{cod}', [ShoppingController::class, 'eliminar']);
   Route::get('/shopping/{ced}/{total}/{fecha}', [ShoppingController::class, 'getRefWompi']);
   Route::get('/checkpay', [ShoppingController::class, 'checkPay']);
   Route::get('/profile/{email}/{message?}', [ProfileController::class, 'edit'])->name('profile.edit');
   Route::get('/profile/check/{email}/{pass}', [ProfileController::class, 'checkpass']);
   Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
});

require __DIR__ . '/auth.php';

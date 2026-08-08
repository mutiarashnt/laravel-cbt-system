<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('login'));
});

test('user is redirected to user dashboard', function () {
    $user = User::factory()->create([
        'role' => 'user',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('user.dashboard'));
});

test('admin is redirected to admin dashboard', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $this->actingAs($admin);

    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('admin.dashboard'));
});

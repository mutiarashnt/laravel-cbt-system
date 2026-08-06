<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->integer('score')->default(10)->after('type');
        });

        Schema::table('answers', function (Blueprint $table) {
            $table->integer('score')->default(0)->after('is_correct');
        });

        Schema::table('participants', function (Blueprint $table) {
            $table->integer('score')->nullable()->after('status');
            $table->integer('max_score')->nullable()->after('score');
            $table->decimal('grade', 5, 2)->nullable()->after('max_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('score');
        });

        Schema::table('answers', function (Blueprint $table) {
            $table->dropColumn('score');
        });

        Schema::table('participants', function (Blueprint $table) {
            $table->dropColumn(['score', 'max_score', 'grade']);
        });
    }
};

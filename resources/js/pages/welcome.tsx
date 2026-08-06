import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, ShieldCheck, Zap, MonitorSmartphone, ArrowRight } from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Selamat Datang di CBT Online" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-primary selection:text-primary-foreground">

                {/* Navbar */}
                <header className="fixed inset-x-0 top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
                            <MonitorSmartphone className="h-6 w-6" />
                            <span>CBT<span className="text-gray-900 dark:text-white">Online</span></span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors dark:text-gray-200"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main>
                    <div className="relative isolate pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
                        {/* Background Gradients */}
                        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                        </div>

                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-3xl text-center">
                                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                                    Platform Evaluasi Digital yang <span className="text-primary">Modern & Cepat</span>
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                                    Sistem Ujian Berbasis Komputer (CBT) yang dirancang untuk memberikan pengalaman ujian yang lancar, aman, dan mudah digunakan, baik untuk institusi pendidikan maupun perusahaan.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
                                        >
                                            Buka Dashboard <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={register()}
                                                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
                                            >
                                                Mulai Sekarang <ArrowRight className="h-4 w-4" />
                                            </Link>
                                            <Link href={login()} className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary dark:text-gray-200 transition-colors">
                                                Sudah punya akun? <span aria-hidden="true">→</span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-wider">Keunggulan Kami</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                Semua yang Anda butuhkan untuk ujian
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                                CBT Online menyediakan fitur lengkap untuk memfasilitasi ujian yang efisien dan minim kendala teknis.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">

                                {/* Feature 1 */}
                                <div className="flex flex-col rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 transition-all hover:shadow-md hover:-translate-y-1">
                                    <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
                                        </div>
                                        Super Cepat & Responsif
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                                        <p className="flex-auto">Aplikasi dibangun dengan teknologi modern yang menjamin transisi antar soal seketika tanpa loading yang mengganggu konsentrasi peserta.</p>
                                    </dd>
                                </div>

                                {/* Feature 2 */}
                                <div className="flex flex-col rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 transition-all hover:shadow-md hover:-translate-y-1">
                                    <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                                        </div>
                                        Sistem Penilaian Otomatis
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                                        <p className="flex-auto">Peserta langsung dapat melihat nilai dan hasil pekerjaannya segera setelah menekan tombol submit ujian secara real-time.</p>
                                    </dd>
                                </div>

                                {/* Feature 3 */}
                                <div className="flex flex-col rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 transition-all hover:shadow-md hover:-translate-y-1">
                                    <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900 dark:text-white">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
                                        </div>
                                        Katalog Ujian Terstruktur
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                                        <p className="flex-auto">Tersedia bank soal yang dikategorikan sesuai mata pelajaran dan mudah diakses oleh peserta di dashboard interaktif.</p>
                                    </dd>
                                </div>

                            </dl>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-8">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold">
                            <MonitorSmartphone className="h-5 w-5" />
                            <span>CBT Online</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            &copy; {new Date().getFullYear()} CBT Online. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

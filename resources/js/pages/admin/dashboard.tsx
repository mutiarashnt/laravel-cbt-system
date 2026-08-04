import AdminLayout from '@/layouts/admin-layout';

export default function Dashboard() {
    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold">
                Dashboard Admin
            </h1>

            <p className="mt-2 text-gray-600">
                Selamat datang di panel admin.
            </p>
        </AdminLayout>
    );
}
import AdminLayout from '@/layouts/admin-layout';
import { Link, router } from '@inertiajs/react';

interface Choice {
    id: number;
    choice_text: string;
    is_correct: boolean;
}

interface Question {
    id: number;
    question: string;
    choices: Choice[];
}

interface Props {
    questions: Question[];
}

export default function Index({ questions }: Props) {

    function deleteQuestion(id:number){

        if(confirm('Yakin ingin menghapus soal ini?')){
            router.delete(`/admin/questions/${id}`);
        }

    }


    return (
        <AdminLayout>

            <div className="flex justify-between mb-6">

                <h1 className="text-2xl font-bold">
                    Bank Soal
                </h1>


                <Link
                    href="/admin/questions/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Tambah Soal
                </Link>

            </div>



            <div className="bg-white rounded shadow">

                <table className="w-full">

                    <thead>
                        <tr className="border-b">

                            <th className="p-3 text-left">
                                No
                            </th>

                            <th className="p-3 text-left">
                                Soal
                            </th>

                            <th className="p-3">
                                Pilihan
                            </th>

                            <th className="p-3">
                                Aksi
                            </th>

                        </tr>
                    </thead>


                    <tbody>

                    {questions.map((item,index)=>(

                        <tr 
                            key={item.id}
                            className="border-b"
                        >

                            <td className="p-3">
                                {index+1}
                            </td>


                            <td className="p-3">
                                {item.question}
                            </td>


                            <td className="p-3">

                                {item.choices.length}
                                {' '}
                                pilihan

                            </td>


                            <td className="p-3 space-x-2">


                                <Link
                                    href={`/admin/questions/${item.id}/edit`}
                                    className="text-blue-600"
                                >
                                    Edit
                                </Link>


                                <button
                                    onClick={()=>deleteQuestion(item.id)}
                                    className="text-red-600"
                                >
                                    Hapus
                                </button>


                            </td>


                        </tr>

                    ))}


                    </tbody>

                </table>


            </div>


        </AdminLayout>
    );
}
import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';


export default function Create() {

    const form = useForm({

        question: '',

        choices: [
            '',
            '',
            '',
            ''
        ],

        correct_answer: 0,

    });


    function submit(e: React.FormEvent) {

        e.preventDefault();

        form.post('/admin/questions');

    }


    return (

        <AdminLayout>

            <h1 className="text-2xl font-bold mb-6">
                Tambah Soal
            </h1>


            <form
                onSubmit={submit}
                className="space-y-4"
            >

                <textarea
                    className="w-full border rounded p-2"
                    placeholder="Masukkan pertanyaan"
                    value={form.data.question}
                    onChange={e =>
                        form.setData(
                            'question',
                            e.target.value
                        )
                    }
                />


                {form.data.choices.map((choice,index)=>(

                    <div key={index}>

                        <label>
                            Pilihan {index+1}
                        </label>

                        <input
                            className="w-full border rounded p-2"
                            value={choice}
                            onChange={e=>{

                                const choices=[
                                    ...form.data.choices
                                ];

                                choices[index]=e.target.value;

                                form.setData(
                                    'choices',
                                    choices
                                );

                            }}
                        />

                    </div>

                ))}


                <div>

                    <label>
                        Jawaban benar
                    </label>

                    <select
                        className="border rounded p-2"
                        value={form.data.correct_answer}
                        onChange={e =>
                            form.setData(
                                'correct_answer',
                                Number(e.target.value)
                            )
                        }
                    >

                        <option value={0}>
                            Pilihan 1
                        </option>

                        <option value={1}>
                            Pilihan 2
                        </option>

                        <option value={2}>
                            Pilihan 3
                        </option>

                        <option value={3}>
                            Pilihan 4
                        </option>

                    </select>

                </div>


                <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    disabled={form.processing}
                >
                    Simpan Soal
                </button>


            </form>

        </AdminLayout>

    );
}
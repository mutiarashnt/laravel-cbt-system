import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';


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

    question: Question;

}



export default function Edit({ question }: Props) {


    const { data, setData, put, processing, errors } = useForm({

        question: question.question,

        choices: question.choices.map(
            item => item.choice_text
        ),

        correct_answer:
            question.choices.findIndex(
                item => item.is_correct
            )

    });



    function submit(e: React.FormEvent) {

        e.preventDefault();


        put(`/admin/questions/${question.id}`);

    }



    return (

        <AdminLayout>


            <h1 className="text-2xl font-bold mb-6">
                Edit Soal
            </h1>



            <form
                onSubmit={submit}
                className="bg-white p-6 rounded shadow space-y-5"
            >


                <div>


                    <label className="block mb-2 font-medium">
                        Pertanyaan
                    </label>


                    <textarea

                        value={data.question}

                        onChange={
                            e => setData(
                                'question',
                                e.target.value
                            )
                        }

                        className="w-full border rounded p-3"

                    />


                </div>




                <div>


                    <label className="block mb-2 font-medium">
                        Pilihan Jawaban
                    </label>



                    {data.choices.map(
                        (choice, index) => (


                            <div
                                key={index}
                                className="flex items-center gap-3 mb-3"
                            >


                                <input

                                    type="radio"

                                    checked={
                                        data.correct_answer === index
                                    }

                                    onChange={() =>
                                        setData(
                                            'correct_answer',
                                            index
                                        )
                                    }

                                />



                                <input

                                    type="text"

                                    value={choice}

                                    onChange={
                                        e => {

                                            const newChoices = [
                                                ...data.choices
                                            ];

                                            newChoices[index]
                                                =
                                                e.target.value;


                                            setData(
                                                'choices',
                                                newChoices
                                            );

                                        }
                                    }

                                    className="border rounded p-2 flex-1"
                                />

                            </div>

                        ))}

                </div>

                <button

                    disabled={processing}

                    className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                    Update Soal
                </button>
            </form>
        </AdminLayout>
    );
}
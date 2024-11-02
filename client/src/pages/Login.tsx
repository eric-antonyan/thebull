import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import restaurant from '../assets/img/restaurant.jpg';
import { Admin } from '../api';

interface FormValues {
    username: string;
    password: string;
}

interface ServerResponse {
    message: string;
    success: boolean;
}

const validationSchema = Yup.object({
    username: Yup.string()
        .required('Пожалуйста, заполните поле')
        .min(4, 'Введите имя пользователя длиной более 4 символов')
        .max(10, 'Введите имя пользователя длиной менее 10 символов'),
    password: Yup.string()
        .required('Пожалуйста, заполните поле')
        .min(8, 'Введите пароль длиной более 6 символов')
        .max(16, 'Введите пароль длиной менее 16 символов'),
});

const Login: React.FC = () => {
    const [response, setResponse] = useState<ServerResponse | undefined>();
    const { innerHeight } = window;

    const handleSubmit = async (values: FormValues) => {
        const { username, password } = values;
        console.log(values);

        const admin = new Admin(username, password);    
        const response = await admin.check();
        setResponse(response);
    };

    return (
        <div className="bg-darker max-w-[450px] w-full flex flex-col" style={{ height: innerHeight }}>
            <div
                className="flex-[1.4] relative flex flex-col items-center justify-center"
                style={{ background: `url(${restaurant})`, backgroundRepeat: 'repeat', backgroundSize: 'cover' }}
            >
                <div className="w-full h-full absolute top-0 bottom-0 bg-gradient-to-t from-darker to-darker-alpha"></div>
                <h1 className="text-white relative text-2xl uppercase font-extrabold">авторизоваться</h1>
                <img src="https://thebull.ru/wp-content/uploads/2020/05/vod-400x110.png" className="relative w-[250px]" alt="" />
            </div>
            <div className="flex-1 p-5">
                <Formik<FormValues>
                    initialValues={{ username: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSubmit(values);
                        setSubmitting(false); // Reset submitting state after handling submission
                    }}
                >
                    {({ isValid, isSubmitting, setFieldTouched }) => (
                        <Form className="flex flex-col gap-4">
                            <div className='flex-1'>
                                <Field
                                    className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                                    placeholder="Введите имя пользователя"
                                    type="text"
                                    name="username"
                                    onBlur={() => {
                                        setFieldTouched('username', true); // Mark field as touched
                                        setResponse(undefined); // Reset response on blur
                                    }}
                                />
                                <ErrorMessage name="username" component="div" className="text-red-500 font-medium text-sm" />
                            </div>

                            <div className='flex-1'>
                                <Field
                                    className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                                    placeholder="Введите свой пароль"
                                    type="password"
                                    name="password"
                                    onBlur={() => {
                                        setFieldTouched('password', true);
                                        setResponse(undefined);
                                    }}
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 font-medium text-sm" />
                            </div>

                            {response && <p className={`${response.success ? "text-primary" : "text-red-500"} text-sm font-bold text-center`}>{response.message}</p>}

                            <button
                                className="bg-primary disabled:pointer-events-none disabled:bg-slate-700 p-[14px] text-white rounded-2xl"
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Aвторизоваться
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;

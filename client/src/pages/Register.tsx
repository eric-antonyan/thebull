import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import restaurant from '../assets/img/restaurant.jpg';
import { Admin } from '../api';
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import '../css/styles.css'
import { useCountries } from 'use-react-countries';
import { Request } from "../typings/Request";

interface ServerResponse {
    message: string;
    success: boolean;
}

const armenianPhoneRegex = /^374\s?\d{8}$/;
const russianPhoneRegex = /^7\s?\d{10}$/;


const validationSchema = Yup.object({
    fullName: Yup.string().required('Пожалуйста, заполните поле'),
    company: Yup.string().required('Пожалуйста, заполните поле'),
    phoneNumber: Yup.string()
        .test('phoneNumber', 'Пожалуйста, введите правильный номер телефона', function (value) {
            const { path, createError } = this;

            if (armenianPhoneRegex.test(value as string) || russianPhoneRegex.test(value as string)) {
                return true;
            }

            return createError({
                path,
                message: 'Пожалуйста, введите правильный номер телефона',
            });
        })
        .required('Номер телефона обязателен'),
    email: Yup.string().email("формат электронной почты неверен")
        .required('электронной почта обязателен'),
    country: Yup.string()
    .required("Страна обязателен"),
    city: Yup.string().required("Город обязателен"),
    address: Yup.string()
        .required('Адрес обязателен'),
    profession: Yup.string()
        .required("Профессия обязателен")
});


const Register: React.FC = () => {
    const [response, setResponse] = useState<ServerResponse | undefined>();
    const { innerHeight } = window;

    const handleSubmit = async (values: Request) => {
        const admin = new Admin();
        const response = await admin.register(values)

        setResponse(response)
    };

    return (
        <div className="bg-darker max-w-[450px] w-full flex flex-col" style={{ height: innerHeight }}>
            <div
                className="flex-[0.3] relative flex flex-col items-center justify-center"
                style={{ background: `url(${restaurant})`, backgroundRepeat: 'repeat', backgroundSize: 'cover' }}
            >
                <div className="w-full h-full absolute top-0 bottom-0 bg-gradient-to-t from-darker to-darker-alpha"></div>
                <h1 className="text-white relative text-2xl uppercase font-extrabold">Регистрация</h1>
            </div>
            <div className="flex-1 p-5">
                <Formik<Request>
                    initialValues={
                        {
                            fullName: '',
                            company: '',
                            email: '',
                            phoneNumber: '',
                            country: '',
                            address: ''
                        }
                    }
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSubmit(values);
                        setSubmitting(false);
                    }}
                >
                    {({ values, isValid, isSubmitting, setFieldTouched, setFieldValue }) => (
                        <Form className="flex flex-col gap-4">
                            <div className='flex-1'>
                                <Field
                                    className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                                    placeholder="Введите ФИО"
                                    type="text"
                                    name="fullName"
                                    onBlur={() => {
                                        setFieldTouched('fullName', true); // Mark field as touched
                                        setResponse(undefined); // Reset response on blur
                                    }}
                                />
                                <ErrorMessage name="fullName" component="div"
                                    className="text-red-500 font-medium text-sm" />
                            </div>

                            <div className='flex-1'>
                                <Field
                                    className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                                    placeholder="Название ресторана"
                                    type="text"
                                    name="company"
                                    onBlur={() => {
                                        setFieldTouched('company', true);
                                        setResponse(undefined);
                                    }}
                                />
                                <ErrorMessage name="company" component="div"
                                    className="text-red-500 font-medium text-sm" />
                            </div>

                            <div className='flex-1'>
                                <Field
                                    className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                                    placeholder="Введите email"
                                    type="email"
                                    name="email"
                                    onBlur={() => {
                                        setFieldTouched('email', true);
                                        setResponse(undefined);
                                    }}
                                />
                                <ErrorMessage name="email" component="div"
                                    className="text-red-500 font-medium text-sm" />
                            </div>

                            <div className='flex-1'>
                                <PhoneInput
                                    value={values.phoneNumber}
                                    onBlur={() => {
                                        setFieldTouched('phoneNumber', true);
                                        setResponse(undefined);
                                    }}
                                    placeholder='+374 00 000000'
                                    country={"am"}
                                    inputProps={{
                                        name: "phoneNumber"
                                    }}
                                    onlyCountries={['am', 'ru']}
                                    onChange={(value: string) => setFieldValue("phoneNumber", value)}
                                />
                                <ErrorMessage name="phoneNumber" component="div"
                                    className="text-red-500 font-medium text-sm" />
                            </div>

                            <div className='flex-1'>
                                <Field
                                    className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                                    placeholder="Страна"
                                    type="text"
                                    name="country"
                                    onBlur={() => {
                                        setFieldTouched('country', true);
                                        setResponse(undefined);
                                    }}
                                />
                                <ErrorMessage name="country" component="div"
                                    className="text-red-500 font-medium text-sm" />
                            </div>
                            <div className='flex-1'>
                                <Field
                                    className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                                    placeholder="Город"
                                    type="text"
                                    name="city"
                                    onBlur={() => {
                                        setFieldTouched('city', true);
                                        setResponse(undefined);
                                    }}
                                />
                                <ErrorMessage name="city" component="div"
                                    className="text-red-500 font-medium text-sm" />
                            </div>
                            <div className='flex-1'>
                                <Field
                                    className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                                    placeholder="Адрес ресторана"
                                    type="text"
                                    name="address"
                                    onBlur={() => {
                                        setFieldTouched('address', true);
                                        setResponse(undefined);
                                    }}
                                />
                                <ErrorMessage name="address" component="div"
                                    className="text-red-500 font-medium text-sm" />
                            </div>
                            <div className='flex-1'>
                                <Field
                                    className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                                    placeholder="Должность"
                                    type="text"
                                    name="profession"
                                    onBlur={() => {
                                        setFieldTouched('profession', true);
                                        setResponse(undefined);
                                    }}
                                />
                                <ErrorMessage name="profession" component="div"
                                    className="text-red-500 font-medium text-sm" />
                            </div>

                            {response &&
                                <p className={`${response.success ? "text-primary" : "text-red-500"} text-sm font-bold text-center`}>{response.message}</p>
                            }

                            <button
                                className="bg-primary disabled:pointer-events-none disabled:bg-slate-700 p-[14px] text-white rounded-2xl"
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Отправить запрос
                            </button>

                            <p className={"text-center"}>
                                <span className={"text-white"}>Уже есть аккаунт?</span> <Link className={"text-primary"}
                                    to={"/"}>Войти</Link>
                            </p>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Register;

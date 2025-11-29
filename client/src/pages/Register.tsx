import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import restaurant from '../assets/img/restaurant.jpg';
import { Admin } from '../api';
import { Link } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import '../css/styles.css';
import { Request } from "../typings/Request";
import { useHeight } from '../hooks/useHeght';

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

  email: Yup.string()
    .email("формат электронной почты неверен")
    .required('электронной почта обязателен'),

  country: Yup.string().required("Страна обязателен"),
  city: Yup.string().required("Город обязателен"),
  address: Yup.string().required('Адрес обязателен'),
  profession: Yup.string().required("Профессия обязателен"),

  // 🔥 NEW PASSWORD VALIDATION
  password: Yup.string()
    .required("Пароль обязателен")
    .min(6, "Минимум 6 символов")
    .max(64, "Максимум 64 символа"),

  confirmPassword: Yup.string()
    .required("Повторите пароль")
    .oneOf([Yup.ref("password")], "Пароли не совпадают"),
});

const Register: React.FC = () => {
  const [response, setResponse] = useState<ServerResponse | undefined>();
  const height = useHeight();

  const handleSubmit = async (values: any) => {

    const admin = new Admin();
    const response = await admin.register(values);

    setResponse(response);
  };

  return (
    <div className="bg-darker max-w-[450px] w-full flex flex-col" style={{ height: height }}>
      <div
        className="flex-[0.3] relative flex flex-col items-center justify-center"
        style={{
          background: `url(${restaurant})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="w-full h-full absolute top-0 bottom-0 bg-gradient-to-t from-darker to-darker-alpha"></div>
        <h1 className="text-white relative text-2xl uppercase font-extrabold">Регистрация</h1>
      </div>

      <div className="flex-1 p-5">
        <Formik
          initialValues={{
            fullName: '',
            company: '',
            email: '',
            phoneNumber: '',
            country: '',
            city: '',
            address: '',
            profession: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ values, isValid, isSubmitting, setFieldTouched, setFieldValue }) => (
            <Form className="flex flex-col gap-4">

              {/* Full Name */}
              <div>
                <Field
                  className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                  placeholder="Введите ФИО"
                  name="fullName"
                  onBlur={() => {
                    setFieldTouched('fullName', true);
                    setResponse(undefined);
                  }}
                />
                <ErrorMessage name="fullName" component="div" className="text-red-500 font-medium text-sm" />
              </div>

              {/* Company */}
              <div>
                <Field
                  className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                  placeholder="Название ресторана"
                  name="company"
                  onBlur={() => {
                    setFieldTouched('company', true);
                    setResponse(undefined);
                  }}
                />
                <ErrorMessage name="company" component="div" className="text-red-500 font-medium text-sm" />
              </div>

              {/* Email */}
              <div>
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
                <ErrorMessage name="email" component="div" className="text-red-500 font-medium text-sm" />
              </div>

              {/* Phone */}
              <div>
                <PhoneInput
                  value={values.phoneNumber}
                  onBlur={() => {
                    setFieldTouched('phoneNumber', true);
                    setResponse(undefined);
                  }}
                  placeholder='+374 00 000000'
                  country={"am"}
                  inputProps={{ name: "phoneNumber" }}
                  onlyCountries={['am', 'ru']}
                  onChange={(value: string) => setFieldValue("phoneNumber", value)}
                />
                <ErrorMessage name="phoneNumber" component="div" className="text-red-500 font-medium text-sm" />
              </div>

              {/* Country */}
              <div>
                <Field
                  className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                  placeholder="Страна"
                  name="country"
                  onBlur={() => {
                    setFieldTouched('country', true);
                    setResponse(undefined);
                  }}
                />
                <ErrorMessage name="country" component="div" className="text-red-500 font-medium text-sm" />
              </div>

              {/* City */}
              <div>
                <Field
                  className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                  placeholder="Город"
                  name="city"
                  onBlur={() => {
                    setFieldTouched('city', true);
                    setResponse(undefined);
                  }}
                />
                <ErrorMessage name="city" component="div" className="text-red-500 font-medium text-sm" />
              </div>

              {/* Address */}
              <div>
                <Field
                  className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                  placeholder="Адрес ресторана"
                  name="address"
                  onBlur={() => {
                    setFieldTouched('address', true);
                    setResponse(undefined);
                  }}
                />
                <ErrorMessage name="address" component="div" className="text-red-500 font-medium text-sm" />
              </div>

              {/* Profession */}
              <div>
                <Field
                  className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                  placeholder="Должность"
                  name="profession"
                  onBlur={() => {
                    setFieldTouched('profession', true);
                    setResponse(undefined);
                  }}
                />
                <ErrorMessage name="profession" component="div" className="text-red-500 font-medium text-sm" />
              </div>

              {/* 🔥 Password */}
              <div>
                <Field
                  type="password"
                  className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                  placeholder="Пароль"
                  name="password"
                  onBlur={() => {
                    setFieldTouched('password', true);
                    setResponse(undefined);
                  }}
                />
                <ErrorMessage name="password" component="div" className="text-red-500 font-medium text-sm" />
              </div>

              {/* 🔥 Confirm Password */}
              <div>
                <Field
                  type="password"
                  className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                  placeholder="Повторите пароль"
                  name="confirmPassword"
                  onBlur={() => {
                    setFieldTouched('confirmPassword', true);
                    setResponse(undefined);
                  }}
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 font-medium text-sm" />
              </div>

              {/* Response */}
              {response &&
                <p className={`${response.success ? "text-primary" : "text-red-500"} text-sm font-bold text-center`}>
                  {response.message}
                </p>
              }

              {/* Submit */}
              <button
                className="bg-primary disabled:pointer-events-none disabled:bg-slate-700 p-[14px] text-white rounded-2xl"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Отправить запрос
              </button>

              {/* Login link */}
              <p className="text-center">
                <span className="text-white">Уже есть аккаунт?</span>{" "}
                <Link className="text-primary" to="/">Войти</Link>
              </p>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;

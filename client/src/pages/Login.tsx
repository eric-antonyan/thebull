import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import restaurant from '../assets/img/restaurant.jpg';
import { Admin } from '../api';
import { Link, useNavigate } from "react-router-dom";

interface FormValues {
  phoneNumber: string;
  password: string;
}

interface ServerResponse {
  message: string;
  success: boolean;
}

const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .required('Пожалуйста, заполните поле'),
  password: Yup.string()
    .required('Введите пароль')
    .min(6, 'Минимум 6 символов')
    .max(64, 'Максимум 64 символа'),
});

const Login: React.FC = () => {
  const [response, setResponse] = useState<ServerResponse | undefined>();
  const { innerHeight } = window;
  const navigate = useNavigate();

  const handleSubmit = async (values: FormValues) => {
    const admin = new Admin(values.phoneNumber, values.password);
    const response = await admin.check();

    if (response.success) {
      navigate("/tasks");
    }

    setResponse(response);
  };

  return (
    <div
      className="bg-darker max-w-[450px] w-full flex flex-col"
      style={{ height: innerHeight }}
    >
      <div
        className="flex-[1.4] relative flex flex-col items-center justify-center"
        style={{
          background: `url(${restaurant})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="w-full h-full absolute top-0 bottom-0 bg-gradient-to-t from-darker to-darker-alpha" />
        <h1 className="text-white relative text-2xl uppercase font-extrabold">
          авторизоваться
        </h1>
        <img
          src="https://thebull.ru/wp-content/uploads/2020/05/vod-400x110.png"
          className="relative w-[250px]"
          alt=""
        />
      </div>

      <div className="flex-1 p-5">
        <Formik<FormValues>
          initialValues={{ phoneNumber: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ isValid, isSubmitting, setFieldTouched, setFieldValue, values }) => (
            <Form className="flex flex-col gap-4">

              {/* Phone input with + */}
              <div>
                <Field name="phoneNumber">
                  {({ field }: any) => (
                    <input
                      {...field}
                      className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                      placeholder="Введите номер телефона"
                      type="text"
                      value={
                        values.phoneNumber
                          ? values.phoneNumber.startsWith("+")
                            ? values.phoneNumber
                            : "+" + values.phoneNumber.replace(/^\+/, "")
                          : ""
                      }
                      onChange={(e) => {
                        let value = e.target.value.replace(/\s/g, "");

                        if (!value.startsWith("+")) {
                          value = "+" + value.replace(/^\+/, "");
                        }

                        // Разрешаем только + и цифры
                        value = value.replace(/[^\d+]/g, "");

                        setFieldValue("phoneNumber", value);
                        setResponse(undefined);
                      }}
                      onBlur={() => {
                        setFieldTouched('phoneNumber', true);
                        setResponse(undefined);
                      }}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 font-medium text-sm"
                />
              </div>

              {/* Password input */}
              <div>
                <Field
                  className="bg-primary-alpha w-full text-white placeholder:text-primary p-[14px] outline-none rounded-2xl"
                  placeholder="Введите пароль"
                  type="password"
                  name="password"
                  onBlur={() => {
                    setFieldTouched('password', true);
                    setResponse(undefined);
                  }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 font-medium text-sm"
                />
              </div>

              {/* Server response */}
              {response && (
                <p
                  className={`${response.success
                    ? "text-primary"
                    : "text-red-500"
                    } text-sm font-bold text-center`}
                >
                  {response.message}
                </p>
              )}

              {/* Submit */}
              <button
                className="bg-primary disabled:pointer-events-none disabled:bg-slate-700 p-[14px] text-white rounded-2xl"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Авторизоваться
              </button>

              {/* Register link */}
              <p className="text-center">
                <span className="text-white">Ещё нет аккаунта?</span>{" "}
                <Link className="text-primary" to={"/register"}>
                  Регистрация
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;

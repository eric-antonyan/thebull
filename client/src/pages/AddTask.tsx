import {ChangeEvent, useEffect, useState} from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup"; // For validation
import Layout from "../Layout";
import Ripple from "../components/Ripple/Ripple";
import { api } from "../api";
import { FaTrash } from "react-icons/fa6";
import { Radio, RadioGroup } from "@nextui-org/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {Request} from "../typings/Request"

const AddTask = () => {
    const [base64es, setBase64es] = useState<string[]>([]);
    const [status, setStatus] = useState(0);
    const navigate = useNavigate();
    const [auth, setAuth] = useState<Request>();

    useEffect(() => {
        const token = Cookies.get("jwt");

        if (!token) {
            navigate("/")
            return
        };

        const decrypedData = jwtDecode(token) as Request
        setAuth(decrypedData)

    }, [auth]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Название задачи обязательно"),
        description: Yup.string().required("Описание обязательно"),
        priority: Yup.string().required("Приоритет обязателен"),
    });

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        const { target } = e;
        console.log(base64es)

        if (target.files && target.files.length > 0) {
            const formData = new FormData();
            const imageFile = target.files[0];

            formData.append('file', imageFile);

            const response = await api.post('/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const newImageHash = response.data.hash;

            setBase64es((prev) => [...prev, newImageHash]);

            setFieldValue('images', (prevImages: string[] | undefined) => {
                const currentImages = Array.isArray(prevImages) ? prevImages : [];
                return [...currentImages, newImageHash]; // Return new array with new image hash
            });
        } else {
            console.error('No file selected');
        }
    };



    // Handle delete image
    const handleDelete = async (id: string, setFieldValue: (field: string, value: any) => void) => {
        const response = await api.delete(`uploads/${id}`);
        if (!response.data.error) {
            setBase64es((prev) => prev.filter((base64) => base64 !== id));
            setFieldValue('images', (prev: string[]) => prev.filter((img) => img !== id)); // Update Formik state
        }
    };

    return (
        <Layout back title={"Добавить новый"} context={"Добавить"}>
            <Formik
                initialValues={{
                    images: [],
                    title: "",
                    description: "",
                    priority: "0",
                    status: 0,
                    owner: auth?._id
                }}
                validationSchema={validationSchema}
                onSubmit={async (values: any) => {
                    (values).images = base64es;
                    values.priority = status.toString();
                    values.owner = auth?._id;
                    const response = await api.post("/tasks", values)

                    navigate("/tasks")
                }}
            >
            {({ setFieldValue }) => (
                    <Form className={"flex flex-col gap-3 w-full"}>
                        <Field name="title">
                            {({ field, meta }: any) => (
                                <div className={"w-full"}>
                                    <input
                                        {...field}
                                        className={"bg-black p-4 rounded-2xl outline-none text-white w-full"}
                                        placeholder={"Название задача"}
                                    />
                                    {meta.touched && meta.error && <div className="text-red-500">{meta.error}</div>}
                                </div>
                            )}
                        </Field>
                        <Field name="description">
                            {({ field, meta }: any) => (
                                <div className={"w-full"}>
                                    <input
                                        {...field}
                                        className={"bg-black p-4 rounded-2xl outline-none text-white w-full"}
                                        placeholder={"Описание"}
                                    />
                                    {meta.touched && meta.error && <div className="text-red-500">{meta.error}</div>}
                                </div>
                            )}
                        </Field>
                        <div className={"w-full grid gap-4 grid-cols-3"}>
                            {base64es.map((base64, i) => (
                                <div
                                    key={i}
                                    className={"relative w-full aspect-square rounded-3xl"}
                                    style={{
                                        background: `url(${`http://${window.location.hostname}:8000/api/uploads/${base64}`})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center"
                                    }}
                                >
                                    <div className={"w-full h-full rounded-3xl"} style={{ backdropFilter: "brightness(50%)" }}>
                                        <FaTrash
                                            onClick={() => handleDelete(base64, setFieldValue)}
                                            className={"text-red-700 absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 will-change-transform text-2xl top-1/2 left-1/2"}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <RadioGroup label="Статус" onValueChange={(value) => setStatus(Number(value))} value={String(status)} className={"w-full flex justify-between"} orientation="horizontal">
                            <Radio value={"0"}>
                                <span className={"text-white"}>низкая</span>
                            </Radio>
                            <Radio value={"1"}>
                                <span className={"text-white"}>средная</span>
                            </Radio>
                            <Radio value={"2"}>
                                <span className={"text-white"}>высокая</span>
                            </Radio>
                        </RadioGroup>

                        <Ripple className={"rounded-2xl"}>
                            <input
                                onChange={(e) => handleFileChange(e, setFieldValue)}
                                id={"file"}
                                type={"file"}
                                hidden
                                accept={"image/png,image/jpg,image/jpeg,image/webp"}
                            />
                            <button onClick={() => {
                                const fileInput = document.getElementById("file") as HTMLInputElement | null;
                                if (fileInput) {
                                    fileInput.click();
                                }
                            }} type={"button"} className={"text-white p-4"}>
                                Добавить фото
                            </button>
                        </Ripple>

                        <Ripple className={"w-full rounded-2xl"}>
                            <button type="submit" className={"bg-primary-alpha w-full text-primary p-4"}>Добавить</button>
                        </Ripple>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default AddTask;

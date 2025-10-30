import { ChangeEvent, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup"; // For validation
import Layout from "../Layout";
import Ripple from "../components/Ripple/Ripple";
import { api } from "../api";
import { FaTrash } from "react-icons/fa6";
import { Radio, RadioGroup } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { Taskable } from "../typings";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

const EditTask = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();
    const [base64es, setBase64es] = useState<string[]>([]);
    const [status, setStatus] = useState(0);
    const [formData, setFormData] = useState<Taskable>({
        __v: 0,
        _id: "",
        createdAt: "",
        updatedAt: "",
        title: "",
        description: "",
        images: [],
        priority: "0"
    });
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const token = Cookies.get("jwt");
        console.log(token)

        if (!token) {
            navigate("/")
            return
        };

        const decrypedData = jwtDecode(token)
        console.log(decrypedData)
        setAuth(true)

    }, [auth]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/tasks/${taskId}`);
                setFormData(response.data);
                setBase64es(response.data.images || []);
                setStatus(response.data.priority);
            } catch (error) {
                console.error("Error fetching task data:", error);
            }
        };

        fetchData();
    }, [taskId]);

    // Define the validation schema using Yup
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Название задачи обязательно"),
        description: Yup.string().required("Описание обязательно"),
        priority: Yup.string().required("Приоритет обязателен"),
    });

    // Handle file change
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        const { target } = e;

        if (target.files && target.files.length > 0) {
            const formData = new FormData();
            const imageFile = target.files[0];
            formData.append('file', imageFile);

            try {
                const response = await api.post('/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const newImageHash = response.data.hash;

                // Update base64es state
                setBase64es((prev) => [...prev, newImageHash]);

                // Update Formik state for images
                setFieldValue('images', (prevImages: string[] | undefined) => {
                    const currentImages = Array.isArray(prevImages) ? prevImages : [];
                    return [...currentImages, newImageHash];
                });
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        } else {
            console.error('No file selected');
        }
    };

    // Handle delete image
    const handleDelete = async (id: string, setFieldValue: (field: string, value: any) => void) => {
        const confirmDelete = window.confirm("Вы уверены, что хотите удалить это изображение?");
        if (confirmDelete) {
            try {
                const response = await api.delete(`uploads/${id}`);
                if (!response.data.error) {
                    setBase64es((prev) => prev.filter((base64) => base64 !== id));
                    setFieldValue('images', (prev: string[]) => prev.filter((img) => img !== id));
                }
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        }
    };

    return (
        <Layout back title={"Добавить новый"} context={"Редактировать"}>
            <Formik
                initialValues={formData}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    values.images = base64es;
                    values.priority = status.toString();
                    await api.patch(`/tasks/${taskId}`, values);
                    navigate("/tasks");
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

                        <RadioGroup
                            label="Статус"
                            value={String(status)} // Controlled value
                            onValueChange={(value) => setStatus(Number(value))}
                            className="w-full flex justify-between"
                            orientation="horizontal"
                        >
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
                            <button type="submit" className={"bg-primary-alpha w-full text-primary p-4"}>Сохранить</button>
                        </Ripple>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default EditTask;

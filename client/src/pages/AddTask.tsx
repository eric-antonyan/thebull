import { ChangeEvent, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Layout from "../Layout";
import Ripple from "../components/Ripple/Ripple";
import { api } from "../api";
import { FaTrash } from "react-icons/fa6";
import { Radio, RadioGroup } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Request } from "../typings/Request";
import { useTasks } from "../hooks/useTasks";
import { useDraftTask } from "../hooks/useDraftTask";

const AddTask = () => {
  const navigate = useNavigate();

  // 🔹 черновик (загружается из localStorage внутри useDraftTask)
  const { draft, updateDraft, clearDraft } = useDraftTask();

  // 🔹 локальное состояние для картинок и приоритета – инициализируем из черновика
  const [base64es, setBase64es] = useState<string[]>(draft.images ?? []);
  const [status, setStatus] = useState<number>(Number(draft.priority ?? "0"));

  const [auth, setAuth] = useState<Request>();
  const { createTask } = useTasks();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      navigate("/");
      return;
    }
    const decryptedData = jwtDecode(token) as Request;
    setAuth(decryptedData);
  }, [navigate]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Название задачи обязательно"),
    description: Yup.string().required("Описание обязательно"),
    priority: Yup.string().required("Приоритет обязателен"),
  });

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const { target } = e;

    if (target.files && target.files.length > 0) {
      const formData = new FormData();
      const imageFile = target.files[0];

      formData.append("file", imageFile);

      const response = await api.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newImageHash = response.data.hash;

      setBase64es((prev) => {
        const next = [...prev, newImageHash];

        // обновляем Formik
        setFieldValue("images", next);

        // сохраняем в черновик
        updateDraft({ images: next });

        return next;
      });
    } else {
      console.error("No file selected");
    }
  };

  const handleDelete = async (
    id: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const response = await api.delete(`uploads/${id}`);
    if (!response.data.error) {
      setBase64es((prev) => {
        const next = prev.filter((base64) => base64 !== id);

        setFieldValue("images", next);
        updateDraft({ images: next });

        return next;
      });
    }
  };

  return (
    <Layout back title={"Добавить новый"} context={"Добавить"}>
      <Formik
        initialValues={{
          images: base64es,                 // из черновика
          title: draft.title ?? "",         // из черновика
          description: draft.description ?? "",
          priority: draft.priority ?? "0",
          status: status,
          owner: auth?._id,
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const dto = {
            ...values,
            images: base64es,
            priority: status.toString(),
            owner: auth?.sub,
          };

          // 🔹 создаём задачу через react-query (кэш обновится)
          await createTask.mutateAsync(dto);

          // 🔹 удаляем черновик
          clearDraft();

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
                    className={
                      "bg-black p-4 rounded-2xl outline-none text-white w-full"
                    }
                    placeholder={"Название задача"}
                    onChange={(e) => {
                      field.onChange(e);
                      updateDraft({ title: e.target.value });
                    }}
                  />
                  {meta.touched && meta.error && (
                    <div className="text-red-500">{meta.error}</div>
                  )}
                </div>
              )}
            </Field>

            <Field name="description">
              {({ field, meta }: any) => (
                <div className={"w-full"}>
                  <input
                    {...field}
                    className={
                      "bg-black p-4 rounded-2xl outline-none text-white w-full"
                    }
                    placeholder={"Описание"}
                    onChange={(e) => {
                      field.onChange(e);
                      updateDraft({ description: e.target.value });
                    }}
                  />
                  {meta.touched && meta.error && (
                    <div className="text-red-500">{meta.error}</div>
                  )}
                </div>
              )}
            </Field>

            <div className={"w-full grid gap-4 grid-cols-3"}>
              {base64es.map((base64, i) => (
                <div
                  key={i}
                  className={"relative w-full aspect-square rounded-3xl"}
                  style={{
                    background: `url(${`http://exp.thebull.ru/api/uploads/${base64}`})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    className={"w-full h-full rounded-3xl"}
                    style={{ backdropFilter: "brightness(50%)" }}
                  >
                    <FaTrash
                      onClick={() => handleDelete(base64, setFieldValue)}
                      className={
                        "text-red-700 absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 will-change-transform text-2xl top-1/2 left-1/2"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <RadioGroup
              label="Статус"
              value={String(status)}
              onValueChange={(value) => {
                const num = Number(value);
                setStatus(num);
                setFieldValue("priority", value);
                updateDraft({ priority: value });
              }}
              className={"w-full flex justify-between"}
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
              <button
                onClick={() => {
                  const fileInput = document.getElementById(
                    "file"
                  ) as HTMLInputElement | null;
                  if (fileInput) {
                    fileInput.click();
                  }
                }}
                type={"button"}
                className={"text-white p-4"}
              >
                Добавить фото
              </button>
            </Ripple>

            <Ripple className={"w-full rounded-2xl"}>
              <button
                type="submit"
                className={"bg-primary-alpha w-full text-primary p-4"}
              >
                Добавить
              </button>
            </Ripple>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default AddTask;

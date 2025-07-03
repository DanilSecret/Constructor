"use client";

import {useState, useCallback, useEffect} from "react";
import {useForm} from "react-hook-form";
import {UploadFile} from "@/app/Api/Api";
import {useRouter} from "next/navigation";
import {useUserStore} from "@/store/store";
import {FormData} from "../models/models";
import Header from "@/app/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function FileUploadPage() {
    const {register, handleSubmit, reset, setValue, watch} = useForm<FormData>();
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const router = useRouter();

    const fileList = watch("file");
    const isAuth = useUserStore((state) => state.isAuth);
    const hydrated = useUserStore((state) => state.hydrated);

    const onSubmit = async (data: FormData) => {
        if (!data.file || data.file.length === 0) {
            setMessage("Пожалуйста, выберите файл");
            return;
        }
        setLoading(true);
        setMessage(null);

        const file = data.file[0];
        const result = await UploadFile(file);
        if (result.success) {
            setMessage(result.message || "Файл успешно загружен");
            reset();
        } else {
            setMessage(result.message || "Ошибка при загрузке файла");
        }
        setLoading(false);
    };


    const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragActive(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragActive(false);
    }, []);

    const onDrop = useCallback(
        (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            setIsDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                setValue("file", e.dataTransfer.files);
            }
        },
        [setValue]
    );

    useEffect(() => {
        if (!hydrated) return;

        if (!isAuth) {
            router.push('/sign_in/');
        }
    }, [isAuth, hydrated, router]);

    if (!hydrated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#F5F7FA] min-h-screen flex flex-col">
            <Header/>
            <div className="flex-1 flex flex-col justify-center items-center">
                <div className="flex-1 flex justify-center items-center px-4 md:px-0">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full max-w-lg p-9 rounded-lg shadow-md bg-[#FFFFFF] border border-[#D5D8DC] rounded-[10px] flex flex-col"
                    >
                        <h1 className="text-xl font-semibold text-center mb-4 text-[#34495E]">Загрузка файла</h1>

                        <div className="bg-[#EAF4FB] p-4 rounded-lg mb-4 border border-[#D6EAF8]">
                            <label
                                htmlFor="fileInput"
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                className={` cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-lg pt-2 pb-8 px-4 transition-colors duration-200
    ${
                                    isDragActive
                                        ? "border-blue-600 bg-blue-100"
                                        : "border-blue-500 bg-transparent hover:border-blue-400"
                                }`}
                            >
                                {fileList && fileList.length > 0 ? (
                                    <div className="flex flex-col items-center justify-center w-[300px]">
                                        <Image src="/upload.svg" alt="upload" width={150} height={150}/>
                                        <p className="text-blue-300 text-center break-words">{fileList[0].name}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center justify-center w-[300px]">
                                        <Image src="/upload.svg" alt="upload" width={150} height={150}/>
                                        <p className="text-blue-400">Перетащите файл сюда или кликните для выбора</p>
                                    </div>
                                )}
                                <input
                                    id="fileInput"
                                    type="file"
                                    {...register("file")}
                                    className="hidden"
                                    accept="*/*"
                                />
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#3498DB] text-white py-2 px-4 rounded-lg hover:bg-[#2F89C5] disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Загрузка..." : "Отправить файл"}
                        </button>

                        <Link
                            href="/шаблон.xlsx"
                            download
                            className="w-full mt-4 inline-block bg-[#3498DB] text-white py-2 px-4 rounded-lg text-center hover:bg-[#2F89C5]"
                        >
                            Скачать шаблон
                        </Link>


                        {message && <p className="mt-4 text-center text-black">{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

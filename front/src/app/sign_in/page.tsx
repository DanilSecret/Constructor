"use client";

import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {LoginFormData} from "../models/models";

import {useUserStore} from "@/store/store";
import AuthUser from "@/app/Api/Api";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Некорректный формат электронной почты')
        .required('Электронная почта обязательна'),
    password: Yup.string()
        .min(4, 'Пароль должен содержать минимум 4 символа')
        .required('Пароль обязателен'),
});


export default function Login_form() {
    const [message, setMessage] = useState<string | null>(null);
    const {setUserData, setIsAuth} = useUserStore();

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(validationSchema)
    })

    useEffect(()=>{
        setIsAuth(false)
        setUserData(null)
    }, [setIsAuth, setUserData])

    const onSubmit = async (data: LoginFormData) => {
        try {
            const {success, message, result} = await AuthUser(data.email, data.password);
            if (success) {

                setIsAuth(true)
                setUserData(result)
                window.location.href = '/';
            } else {
                setMessage(message || "Ошибка авторизации");
            }
        } catch (error) {
            setMessage(`${error}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-black flex flex-col">
            <div className="flex-1 flex justify-center items-center px-4 md:px-0">
                <form onSubmit={handleSubmit(onSubmit)}
                      className="w-full max-w-sm bg-white border border-[#D5D8DC] rounded-[10px] shadow-md overflow-hidden flex flex-col">
                    <div className="bg-[#2C3E50] py-3 px-6 text-center">
                        <h1 className="text-white text-xl">Авторизация</h1>
                    </div>
                    <div className="p-7 flex flex-col gap-12">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#34495E]">
                                Электронная почта
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="Электронная почта"
                                className="bg-white mt-2 block w-full px-3 py-2 border border-[#323538] rounded-[10px] shadow-sm focus:ring-blue-600 focus:border-blue-600 text-black"
                            />
                            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-[#34495E]">
                                Пароль
                            </label>
                            <input
                                type="password"
                                {...register("password")}
                                placeholder="Пароль"
                                className="bg-white mt-2 block w-full px-3 py-2 border border-[#323538] rounded-[10px] shadow-sm focus:ring-blue-600 focus:border-blue-600 text-black"
                            />
                            {errors.password && <p className="text-red-600">{errors.password.message}</p>}
                        </div>

                        <button type="submit"
                                className="w-full bg-[#3498DB] text-white py-2 px-4 rounded-lg">
                            Войти
                        </button>

                        {message && <p className="w-full text-center text-red-600 mt-2">{message}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
}
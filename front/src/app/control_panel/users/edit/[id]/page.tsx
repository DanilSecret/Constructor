"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/store/store";
import Header from "@/app/components/Header";
import { useForm } from "react-hook-form";
import {getUserByUUID, updateUserByUUID} from "@/app/Api/Api";

const roles = ["ADMIN", "DEANERY", "METHODIST"] as const;

const roleLabels: Record<typeof roles[number], string> = {
    ADMIN: "Администратор",
    DEANERY: "Декан",
    METHODIST: "Методист",
};

type FormData = {
    email: string;
    password?: string;
    role: typeof roles[number];
};

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();

    const isAuth = useUserStore(state => state.isAuth);
    const userData = useUserStore(state => state.userData);
    const hydrated = useUserStore(state => state.hydrated);

    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
    } = useForm<FormData>();

    useEffect(() => {
        if (!hydrated) return;

        if (!isAuth) {
            router.push("/sign_in");
            return;
        }

        if (!["ADMIN", "DEANERY"].includes(userData?.role || "")) {
            alert("Недостаточно прав для доступа.");
            router.push("/");
            return;
        }
        if (!params.id) {
            alert("Не указан ID пользователя");
            router.push("/control_panel/users");
            return;
        }

        async function fetchUser() {
            setLoading(true);
            console.log(params.id)

            const res = await getUserByUUID(params?.id as string);
            if (res.success) {
                reset({
                    email: res.data.email,
                    role: res.data.role,
                    password: "",
                });
            } else {
                alert("Ошибка при загрузке пользователя");
                router.push("/control_panel/users");
            }
            setLoading(false);
        }

        fetchUser();
    }, [hydrated, isAuth, userData, router, reset, params.id]);

    const onSubmit = async (data: FormData) => {
        setError("email", { message: "" });
        setError("password", { message: "" });
        setError("role", { message: "" });
        if (!data.email) {
            setError("email", { message: "Email обязателен" });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            setError("email", { message: "Неверный формат email" });
            return;
        }
        if (data.password && data.password.length > 0 && data.password.length < 4) {
            setError("password", { message: "Минимум 4 символа" });
            return;
        }
        if (!roles.includes(data.role)) {
            setError("role", { message: "Выберите корректную роль" });
            return;
        }
        const payload = {
            email: data.email,
            role: data.role,
            password: data.password && data.password.trim() !== "" ? data.password : null,
        };

        const res = await updateUserByUUID(params.id as string, payload.email, payload.password as string, payload.role);
        if (res.success) {
            router.push("/control_panel/users");
        } else {
            setError("email", { message: res.message || "Ошибка при обновлении пользователя" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] flex flex-col text-black">
            <Header/>

            <div className="flex-1 flex justify-center items-start px-6 py-20">
                <div
                    className="w-full max-w-3xl p-9 rounded-[10px] shadow-md bg-white border border-[#D5D8DC] flex flex-col mx-auto">

                    <h1 className="text-2xl font-bold text-[#34495E] mb-6">Редактирование пользователя</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block mb-1 font-medium text-[#34495E]">Email</label>
                            <input
                                type="email"
                                {...register("email")}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#3498DB] ${
                                    errors.email ? "border-red-500" : "border-[#D5D8DC]"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-[#34495E]">
                                Пароль (оставьте пустым, чтобы не менять)
                            </label>
                            <input
                                type="password"
                                {...register("password")}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#3498DB] ${
                                    errors.password ? "border-red-500" : "border-[#D5D8DC]"
                                }`}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-[#34495E]">Роль</label>
                            <select
                                {...register("role")}
                                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#3498DB] ${
                                    errors.role ? "border-red-500" : "border-[#D5D8DC]"
                                }`}
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Выберите роль
                                </option>
                                {roles.map((r) => (
                                    <option key={r} value={r}>
                                        {roleLabels[r]}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#3498DB] hover:bg-[#2F89C5] text-white px-6 py-3 rounded shadow disabled:opacity-50 transition"
                            >
                                Сохранить
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/control_panel/users")}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded shadow transition"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>

    );
}

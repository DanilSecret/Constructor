"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import Header from "@/app/components/Header";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {CreateUser} from "@/app/Api/Api";

const roles = ["ADMIN", "DEANERY", "METHODIST"] as const;

const roleLabels: Record<typeof roles[number], string> = {
    ADMIN: "Администратор",
    DEANERY: "Декан",
    METHODIST: "Методист",
};

type FormData = {
    email: string;
    password: string;
    role: typeof roles[number];
};

const schema = yup.object({
    email: yup.string().email("Неверный формат email").required("Email обязателен"),
    password: yup.string().min(4, "Минимум 4 символов").required("Пароль обязателен"),
    role: yup.string().oneOf(roles, "Выберите корректную роль").required("Роль обязательна"),
}).required();

export default function CreateUserPage() {
    const router = useRouter();
    const isAuth = useUserStore(state => state.isAuth);
    const userData = useUserStore(state => state.userData);
    const hydrated = useUserStore(state => state.hydrated);


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

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
    }, [hydrated, isAuth, userData, router]);

    const onSubmit = async (data: FormData) => {
        const res = await CreateUser(data.email,data.password,data.role);
        if (res.success) {
            router.push("/control_panel/users");
        } else {
            setError("email", { message: res.message || "Ошибка при создании пользователя" });
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-black">
            <Header />
            <div className="max-w-xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold text-[#34495E] mb-6">Добавление пользователя</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className={`w-full px-4 py-2 border rounded ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Пароль</label>
                        <input
                            type="password"
                            {...register("password")}
                            className={`w-full px-4 py-2 border rounded ${
                                errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.password && (
                            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Роль</label>
                        <select
                            {...register("role")}
                            className={`w-full px-4 py-2 border rounded ${
                                errors.role ? "border-red-500" : "border-gray-300"
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Создать пользователя
                    </button>
                </form>
            </div>
        </div>
    );
}

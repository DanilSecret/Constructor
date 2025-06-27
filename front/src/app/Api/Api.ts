"use client";

import axios, { AxiosError } from "axios";

export default async function AuthUser(email: string, password: string) {
    try {
        const response = await axios.post("http://localhost:8080/api/auth/login", { email, password }, { withCredentials: true, timeout: 10000 });
        const { result } = response.data;
        return { success: true, message: 'Успешный вход', result: result };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        let message = "Ошибка соединения с сервером";
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    message = error.response.data.message || "Неверный запрос";
                    break;
                case 401:
                    message = error.response.data.message || "Неверный email или пароль";
                    break;
                case 403:
                    message = "Доступ запрещён";
                    break;
                case 500:
                    message = "Ошибка сервера, попробуйте позже";
                    break;
                default:
                    message = error.response.data.message || `Ошибка: ${error.response.status}`;
            }
        } else if (error.code === "ECONNABORTED") {
            message = "Превышено время ожидания ответа от сервера";
        }
        console.error("Ошибка при авторизации:", error);
        return { success: false, message };
    }
}

export async function UploadFile(file: File): Promise<{ success: boolean; message?: string }> {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await axios.post("http://localhost:8080/api/user/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });
        return response.data;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.error("Ошибка при отправке:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message,
        };
    }
}

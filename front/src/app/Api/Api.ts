"use client";

import axios, { AxiosError } from "axios";

export default async function AuthUser(email: string, password: string) {
    try {
        const response = await axios.post("http://localhost:8080/api/v0.1/auth/login", { email, password });
        const { result, token } = response.data;
        localStorage.setItem('token', token);
        return { success: true, message: 'Успешный вход', result: result };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.error("Ошибка при авторизации:", error);
        const message = error.response?.data?.message || "Ошибка соединения с сервером";
        return { success: false, message };
    }
}

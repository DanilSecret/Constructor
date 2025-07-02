
import axios, { AxiosError } from "axios";
import {Columns} from "@/app/models/models";
import {handleAxiosError} from "@/app/Api/handleAxiosError";
import {Filter} from "@/store/filter_joins_store";

export default async function AuthUser(email: string, password: string) {
    try {
        const response = await axios.post("http://localhost:8080/api/auth/login", { email, password }, { withCredentials: true, timeout: 10000 });
        const result = response.data;
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

export async function logout() {
    await axios.delete("http://localhost:8080/api/user/logout", {
        withCredentials: true,
    });
}

export async function UploadFile(file: File): Promise<{ success: boolean; message?: string; response?:[] }> {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await axios.post("http://localhost:8080/api/user/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });
        return {
            success: true,
            response: response.data,
        };
    } catch (err) {
        return handleAxiosError(err, "отправке файла");
    }
}

export async function GetAllColumns(): Promise<{ success: boolean; message?: string; data?: Columns[]; }> {
    try {
        const response = await axios.get<Columns[]>("http://localhost:8080/api/user/getCols",{withCredentials: true,});

        return {
            success: true,
            data: response.data,
        };
    }catch (err) {
        return handleAxiosError(err, "получении колонок");
    }
}

export async function downloadExcel(userUUID:string, col: Columns[], filter: Filter[], joins: string[][]): Promise<Blob> {
    const response = await axios.post(
        "",
        { userUUID, col, filter, joins },
        { responseType: "blob" }
    );
    return response.data;
}

import axios, { AxiosError } from "axios";
import {Columns, StudentFull} from "@/app/models/models";
import {handleAxiosError} from "@/app/Api/handleAxiosError";
import {Filter} from "@/store/filter_joins_store";

export default async function AuthUser(email: string, password: string) {
    try {
        const response = await axios.post("http://localhost:8080/api/auth/login", { email, password }, { withCredentials: true, timeout: 10000 });
        const result = response.data;
        return { success: true, message: 'Успешный вход', result: result.user };
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
    await axios.delete("http://localhost:8080/api/auth/logout", {
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

export async function downloadExcel(userUUID:string, col: string[], filter: Filter[], joins: string[][]): Promise<Blob> {
    const response = await axios.post(
        "http://localhost:8080/api/user/download",
        { userUUID, col, filter, joins },
        { withCredentials: true, responseType: "blob" }
    );
    return response.data;
}

export async function ReportsHistory(uuid: string | undefined) {
    if (!uuid) {
        return {
            success: false,
            message: 'UUID пользователя не определён',
            data: [],
        };
    }
    try {
        const response = await axios.post(
            "http://localhost:8080/api/user/selfHistory",
            { uuid },
            { withCredentials: true }
        );
        return {
            success: true,
            data: response.data,
        };
    } catch (err) {
        return handleAxiosError(err, "получении истории");
    }
}

export async function ReportsFullHistory() {

    try {
        const response = await axios.get(
            "http://localhost:8080/api/user/allHistory",
            { withCredentials: true }
        );
        return {
            success: true,
            data: response.data,
            message: "Успешно",
        };
    } catch (err) {
        return handleAxiosError(err, "получении истории");
    }
}

export async function getAllUsers() {
    try {
        const response = await axios.get(
            "http://localhost:8080/api/admin/listUsers",
            { withCredentials: true }
        );
        return { success: true, data: response.data, message: "Успешно",};
    } catch (err) {
        return handleAxiosError(err, "получении пользователей")
    }
}

export async function getUserByUUID(uuid:string ) {
    try {
        const response = await axios.post(
            "http://localhost:8080/api/admin/getUser",
            { uuid },
            { withCredentials: true}
        );
        return { success: true, data: response.data, message: "Успешно",};
    } catch (err) {
        return handleAxiosError(err, "получении пользователей")
    }
}
export async function updateUserByUUID(uuid:string, email: string, password: string, role: string ) {
    try {
        const response = await axios.put(
            "http://localhost:8080/api/admin/update",
            { uuid, email, password, role },
            { withCredentials: true}
        );
        return { success: true, data: response.data, message: "Успешно",};
    } catch (err) {
        return handleAxiosError(err, "изменении пользователей")
    }
}

export async function CreateUser(email: string, password: string, role: string ) {
    try {
        const response = await axios.post(
            "http://localhost:8080/api/admin/register",
            { email, password, role },
            { withCredentials: true}
        );
        return { success: true, data: response.data, message: "Успешно",};
    } catch (err) {
        return handleAxiosError(err, "получении пользователей")
    }
}


export async function deleteUserByUUID(uuid: string) {
    try {
        const response = await axios.delete("http://localhost:8080/api/admin/delete", {
            data: { uuid },
            withCredentials: true,
        });
        return {
            success: true,
            data: response.data,
            message: "Успешно",
        };
    } catch (err) {
        return handleAxiosError(err, "удалении пользователя");
    }
}

export async function searchStudents( search: string ) {
    try {
        const response = await axios.post(
            `http://localhost:8080/api/user/listStudents`, { search },
            { withCredentials: true});
        return {
            success: true,
            result: response.data,
            message: "Успешно",
        };
    } catch (err) {
        return handleAxiosError(err, "удалении пользователя");
    }
}

export async function GetStudentById( uuid: string ) {
    try {
        const response = await axios.post(
            `http://localhost:8080/api/user/getStudent`, { uuid },
            { withCredentials: true});
        return {
            success: true,
            result: response.data,
            message: "Успешно",
        };
    } catch (err) {
        return handleAxiosError(err, "удалении пользователя");
    }
}

export async function updateStudentByUUID(student: StudentFull) {
    try {
        const response = await axios.put(
            "http://localhost:8080/api/user/update",
            { student },
            { withCredentials: true});
        return { success: true, result: response.data, message: "Успешно", };
    } catch (err) {
        return handleAxiosError(err, "изменении пользователя");
    }
}
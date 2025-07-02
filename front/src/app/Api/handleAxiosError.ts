import { AxiosError } from "axios";

export function handleAxiosError(err: unknown, context: string = "ошибке"): { success: false; message: string } {
    const error = err as AxiosError<{ message?: string }>;
    let message = `Ошибка при ${context}`;

    if (error.response) {
        switch (error.response.status) {
            case 400:
                message = error.response.data.message || error.message || "Неверный запрос";
                break;
            case 403:
                message = "Доступ запрещён";
                //window.location.href = "/sign_in/";
                break;
            case 500:
                message = "Ошибка сервера, попробуйте позже";
                break;
            default:
                message = error.response.data?.message || `Ошибка: ${error.response.status}`;
        }
    } else if (error.code === "ECONNABORTED") {
        message = "Превышено время ожидания ответа от сервера";
    } else if (error.message) {
        message = error.message;
    }
    console.error(`Ошибка при ${context}`, error);
    return { success: false, message: message };
}

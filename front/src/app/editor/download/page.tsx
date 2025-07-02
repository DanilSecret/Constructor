"use client";

import { useEffect, useState } from "react";
import {useFilterJoinStore} from "@/store/filter_joins_store";
import { useColumnsStore } from "@/store/columns_store";
import {useUserStore} from "@/store/store";
import {downloadExcel} from "@/app/Api/Api";

export default function WaitingPage() {
    const [loading, setLoading] = useState(true);
    const filter = useFilterJoinStore((state) => state.filters);
    const joins = useFilterJoinStore((state) => state.joins);
    const col = useColumnsStore((state) => state.selectedColumns);
    const userUUID = useUserStore((state) => state.userData?.uuid);
    // const isAuth = useUserStore((state) => state.isAuth);
    // const hydrated = useUserStore((state) => state.hydrated);
    // const hydratedFil = useFilterJoinStore((state) => state.hydrated);
    // const hydratedCol = useColumnsStore((state) => state.hydrated);

    useEffect(() => {

        const PostAndDownload = async () => {
            if (!userUUID) {
                console.error("UUID пользователя не найден");
                setLoading(false);
                return;
            }
            try {
                const columnNames = col.map((c) => c.name);

                const blob = await downloadExcel(userUUID, columnNames, filter, joins);

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "отчет.xlsx";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Ошибка при скачивании файла:", error);
            } finally {
                setLoading(false);
            }
        };

        PostAndDownload();
    }, [userUUID, col, filter, joins]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {loading ? (
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">Формируем ваш файл Excel...</p>
                </div>
            ) : (
                <p className="text-gray-600">Готово. Если файл не загрузился, проверьте настройки браузера.</p>
            )}
        </div>
    );
}

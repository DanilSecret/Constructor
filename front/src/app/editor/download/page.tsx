"use client";

import {useEffect, useRef, useState} from "react";
import {useFilterJoinStore} from "@/store/filter_joins_store";
import { useColumnsStore } from "@/store/columns_store";
import {useUserStore} from "@/store/store";
import {downloadExcel} from "@/app/Api/Api";
import Header from "@/app/components/Header";
import {useRouter} from "next/navigation";
import {handleAxiosError} from "@/app/Api/handleAxiosError";

export default function WaitingPage() {
    const [loading, setLoading] = useState(true);
    const filter = useFilterJoinStore((state) => state.filters);
    const joins = useFilterJoinStore((state) => state.joins);
    const col = useColumnsStore((state) => state.selectedColumns);
    const userUUID = useUserStore((state) => state.userData?.uuid);
    const isAuth = useUserStore((state) => state.isAuth);
    const hydrated = useUserStore((state) => state.hydrated);
    const hydratedFil = useFilterJoinStore((state) => state.hydrated);
    const hydratedCol = useColumnsStore((state) => state.hydrated);
    const router = useRouter();
    const hasRun = useRef(false);

    useEffect(() => {
        if (!hydrated || !hydratedFil || !hydratedCol) return;
        if (!isAuth) {
            router.push("/sign_in/");
            return;
        }
        if (hasRun.current) return; // 👈 блокировка повтора
        hasRun.current = true;

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
                handleAxiosError(error, "формировании отчета");
            } finally {
                setLoading(false);
            }
        };

        PostAndDownload();
    }, [userUUID, col, filter, joins, hydrated, hydratedCol, hydratedFil, isAuth, router]);
    return (
        <div>
            <Header/>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                {loading ? (
                    <div className="text-center">
                        <div
                            className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-lg font-medium text-gray-700">Формируем ваш файл Excel...</p>
                    </div>
                ) : (
                    <p className="text-gray-600">Готово. Если файл не загрузился, проверьте настройки браузера.</p>
                )}
            </div>
        </div>
    );
}

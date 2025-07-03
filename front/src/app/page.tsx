'use client'

import {useRouter} from 'next/navigation'
import {useEffect, useRef} from 'react'
import Header from "@/app/components/Header";
import {useUserStore} from "@/store/store";

export default function HomePage() {
    const router = useRouter()
    const sliderRef = useRef<HTMLDivElement>(null)
    const isAuth = useUserStore((state) => state.isAuth);
    const hydrated = useUserStore((state) => state.hydrated);

    const cards = [
        {
            title: '📁 Загрузка файла',
            description: 'Импортируйте Excel-файл с данными студентов.',
            button: 'Перейти к загрузке',
            route: '/upload',
        },
        {
            title: '🛠️ Выбор столбцов',
            description: 'Настройте нужные колонки и фильтры для отчёта.',
            button: 'Выбрать столбцы',
            route: '/columns',
        },
        {
            title: '📜 История отчётов',
            description: 'Посмотрите ранее сформированные и скачанные отчёты.',
            button: 'Открыть историю',
            route: '/history',
        },
        {
            title: '🔍 Поиск студента',
            description: 'Найдите студента по ФИО или другим параметрам.',
            button: 'Перейти к поиску',
            route: '/search',
        },
        {
            title: '📊 Панель управления',
            description: 'Управляйте пользователями и просматривайте историю запросов.',
            button: 'Открыть панель',
            route: '/control_panel',
        },
    ]

    const scrollSlider = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -300 : 300,
                behavior: 'smooth',
            })
        }
    }
    useEffect(() => {
        if (!hydrated) return;

        if (!isAuth) {
            router.push('/sign_in/');
        }
    }, [isAuth, hydrated, router]);

    if (!hydrated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div>
            <Header/>
            <main className="min-h-screen bg-[#F5F7FA] px-4 py-10 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-[#34495E] text-center mb-4">Система формирования отчётов</h1>
                <p className="text-[#34495E] text-center max-w-xl mb-10">
                    Здесь вы можете загрузить файл с данными, выбрать нужные колонки и получить готовый отчёт.
                </p>

                <div className="relative w-full max-w-3xl mx-auto mb-10">

                    <button
                        onClick={() => scrollSlider('left')}
                        className="absolute left-[-40px] top-1/2 -translate-y-1/2 shadow-md p-2 rounded-full bg-[#3498DB] hover:bg-[#2F89C5] z-10 cursor-pointer"
                    >
                        ◀
                    </button>
                    <button
                        onClick={() => scrollSlider('right')}
                        className="absolute right-[-40px] top-1/2 -translate-y-1/2 shadow-md p-2 rounded-full bg-[#3498DB] hover:bg-[#2F89C5] z-10 cursor-pointer"
                    >
                        ▶
                    </button>

                    <div className="overflow-hidden rounded-lg ">
                        <div
                            ref={sliderRef}
                            className="flex gap-2 overflow-x-auto scroll-smooth scrollbar-hide px-1 flex-nowrap pb-4"
                        >
                            {cards.map((card, idx) => (
                                <div
                                    key={idx}
                                    className="w-[249px] min-w-[249px] bg-white shadow-md rounded-xl p-4 flex-shrink-0 relative pb-14 border border-[#D5D8DC]"
                                >
                                    <h2 className="text-lg font-semibold text-[#34495E] mb-2">{card.title}</h2>
                                    <p className="text-[#34495E] mb-3 text-center">{card.description}</p>
                                    <button
                                        onClick={() => router.push(card.route)}
                                        className="bg-[#3498DB] hover:bg-[#2F89C5] text-white px-4 py-2 rounded-md transition absolute bottom-4 left-4 right-4 cursor-pointer"
                                    >
                                        {card.button}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full text-[#34495E] border border-[#D5D8DC]">
                    <h2 className="text-2xl font-bold mb-6">📘 Пошаговая инструкция</h2>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">🔹 Часть 1: Загрузка файла</h3>
                        <ol className="list-decimal list-inside space-y-3">
                            <li>Нажмите <strong>«Загрузка файла»</strong> на карточке выше.</li>
                            <li>Выберите Excel-файл <strong>(.xlsx)</strong> со студентами (1 лист, заголовки в первой
                                строке).
                            </li>
                            <li>Нажмите кнопку <strong>«Загрузить»</strong>. Убедитесь, что загрузка прошла успешно.
                            </li>
                        </ol>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">🔹 Часть 2: Создание отчёта</h3>
                        <ol className="list-decimal list-inside space-y-3">
                            <li>
                                После загрузки вы попадёте на страницу <strong>«Выбор столбцов»</strong>. Здесь
                                отображаются все поля из загруженного файла.
                            </li>
                            <li>
                                Отметьте галочками те столбцы, которые вы хотите включить в итоговый отчёт (например:
                                Фамилия, Имя, Отчество, Группа, Серия паспорта, Номер паспорта и т.д.).
                            </li>
                            <li>
                                🔍 <strong>Фильтры:</strong> Ниже вы можете добавить условия, чтобы отчёт включал только
                                нужные записи. Например:
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Только студенты из группы <strong>«ИТЕ-21»</strong></li>
                                    <li>Только курс = 2</li>
                                </ul>
                                Вы можете комбинировать несколько фильтров. Просто выберите нужный столбец, условие и
                                значение.
                            </li>
                            <li>
                                🔗 <strong>Соединения столбцов:</strong> Если вы хотите объединить информацию из
                                нескольких столбцов (например, Фамилия + Имя), нажмите кнопку <strong>«Добавить
                                соединение»</strong>:
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Укажите имя для нового столбца, например: <code>ФИО</code></li>
                                    <li>Выберите столбцы для объединения</li>
                                </ul>
                                В отчёт добавится новый столбец с объединёнными значениями.
                            </li>
                            <li>
                                После выбора столбцов, добавления фильтров и соединений нажмите <strong>«Сформировать
                                отчёт»</strong>.
                            </li>
                            <li>
                                Система сгенерирует Excel-файл и автоматически скачает его на ваш компьютер. Его также
                                можно будет найти в разделе <strong>«История отчётов»</strong>.
                            </li>
                        </ol>
                    </div>
                </div>
            </main>
        </div>
    )
}

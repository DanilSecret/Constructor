"use client";

import React, { useEffect, useState } from "react";
import {useParams, useRouter} from "next/navigation";
import { useUserStore } from "@/store/store";
import Header from "@/app/components/Header";
import { StudentFull } from "@/app/models/models";
import {GetStudentById, updateStudentByUUID} from "@/app/Api/Api";
import Link from "next/link";
import Image from "next/image";

export default function StudentEditPage() {
    const router = useRouter();
    const params = useParams();

    const isAuth = useUserStore((state) => state.isAuth);
    const hydrated = useUserStore((state) => state.hydrated);

    const [student, setStudent] = useState<StudentFull | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!hydrated) return;
        if (!isAuth) {
            router.push("/sign_in");
            return;
        }

        if (!params.id) {
            alert("UUID студента не указан");
            router.push("/search");
            return;
        }

        async function fetchStudent() {
            setLoading(true);
            const res = await GetStudentById(params.id as string);
            if (res.success && res.result) {
                setStudent(res.result);
            } else {
                alert("Ошибка загрузки данных студента");
                router.push("/search");
            }
            setLoading(false);
        }

        fetchStudent();
    }, [hydrated, isAuth, params.id, router]);

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        const { name, value, type } = event.target;

        const newValue =
            type === "checkbox"
                ? (event.target as HTMLInputElement).checked
                : value;

        setStudent((prev) =>
            prev ? { ...prev, [name]: newValue } : prev
        );
    }


    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!student) return;

        setSaving(true);
        const res = await updateStudentByUUID(student);
        if (res.success) {
            alert("Данные успешно сохранены");
            router.push("/search/");
        } else {
            alert("Ошибка при сохранении данных");
        }
        setSaving(false);
    }

    if (loading || !student) return <div>Загрузка данных...</div>;

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-black">
            <Header />
            <div className="flex-1 flex justify-center items-start px-6 py-20">
                <div className="w-full max-w-4xl p-9 rounded-[10px] shadow-md bg-white border border-[#D5D8DC] flex flex-col mx-auto relative">

                    <div className="w-full relative mb-8 flex items-center">
                        <div className="flex-none">
                            <Link href="/search" className="text-sm text-blue-600 hover:underline flex items-center">
                                <Image src="/Back.svg" alt="Назад" width={30} height={30} />
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-[#34495E] absolute left-1/2 transform -translate-x-1/2">
                            Редактирование студента
                        </h1>
                        <div className="absolute right-0 group cursor-help">
                            <Image src="/Question.svg" alt="Вопрос" width={30} height={30} />
                            <div className="absolute top-full right-0 mt-1 w-64 p-2 bg-gray-100 border rounded shadow text-sm text-black hidden group-hover:block z-10">
                                Здесь редактируются данные студента.<br />
                                Даты вводите в формате дд.мм.гггг.
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4 max-w-4xl">
                        {/* Фамилия */}
                        <div>
                        <label className="block font-semibold mb-1">Фамилия *</label>
                        <input
                            type="text"
                            name="surname"
                            value={student.surname}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Имя */}
                    <div>
                        <label className="block font-semibold mb-1">Имя *</label>
                        <input
                            type="text"
                            name="name"
                            value={student.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Отчество */}
                    <div>
                        <label className="block font-semibold mb-1">Отчество</label>
                        <input
                            type="text"
                            name="patronymic"
                            value={student.patronymic || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Пол */}
                    <div>
                        <label className="block font-semibold mb-1">Пол *</label>
                        <select
                            name="gender"
                            value={student.gender}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="">Выберите пол</option>
                            <option value="Мужской">Мужской</option>
                            <option value="Женский">Женский</option>
                        </select>
                    </div>

                    {/* Дата рождения */}
                    <div>
                        <label className="block font-semibold mb-1">Дата рождения *</label>
                        <input
                            type="text"
                            name="birthday"
                            value={student.birthday}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Номер телефона */}
                    <div>
                        <label className="block font-semibold mb-1">Номер телефона</label>
                        <input
                            type="text"
                            name="phone"
                            value={student.phone || ""}
                            onChange={handleChange}
                            placeholder="+7 (___) ___-__-__"
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Адрес прописки */}
                    <div>
                        <label className="block font-semibold mb-1">Адрес местожительства по прописке *</label>
                        <textarea
                            name="regAddr"
                            value={student.regAddr}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                            rows={2}
                        />
                    </div>

                    {/* Адрес фактический */}
                    <div>
                        <label className="block font-semibold mb-1">Адрес места жительства (фактический) *</label>
                        <textarea
                            name="actAddr"
                            value={student.actAddr}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                            rows={2}
                        />
                    </div>

                    {/* Серия паспорта */}
                    <div>
                        <label className="block font-semibold mb-1">Серия паспорта</label>
                        <input
                            type="text"
                            name="passportSerial"
                            value={student.passportSerial || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            maxLength={4}
                        />
                    </div>

                    {/* Номер паспорта */}
                    <div>
                        <label className="block font-semibold mb-1">Номер паспорта *</label>
                        <input
                            type="text"
                            name="passportNumber"
                            value={student.passportNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                            maxLength={6}
                        />
                    </div>

                    {/* Дата выдачи паспорта */}
                    <div>
                        <label className="block font-semibold mb-1">Дата выдачи паспорта *</label>
                        <input
                            type="text"
                            name="passportDate"
                            value={student.passportDate}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Кем выдан паспорт */}
                    <div>
                        <label className="block font-semibold mb-1">Кем выдан паспорт *</label>
                        <input
                            type="text"
                            name="passportSource"
                            value={student.passportSource}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* СНИЛС */}
                    <div>
                        <label className="block font-semibold mb-1">СНИЛС</label>
                        <input
                            type="text"
                            name="snils"
                            value={student.snils || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                            maxLength={11}
                        />
                    </div>

                    {/* Номер медицинского полиса */}
                    <div>
                        <label className="block font-semibold mb-1">Номер медицинского полиса</label>
                        <input
                            type="text"
                            name="medPolicy"
                            value={student.medPolicy || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Иностранный гражданин</label>
                        <select
                            name="foreigner"
                            value={student.foreigner}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value=""></option>
                            <option value="Да">Да</option>
                            <option value="Нет">Нет</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Особая квота (инвалид, сирота)</label>
                        <select
                            name="quota"
                            value={student.quota}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="">Выберите есть ли квота</option>
                            <option value="Да">Да</option>
                            <option value="Нет">Нет</option>
                        </select>
                    </div>

                    {/* Дата зачисления */}
                    <div>
                        <label className="block font-semibold mb-1">Дата зачисления *</label>
                        <input
                            type="text"
                            name="enrlDate"
                            value={student.enrlDate}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Дата приказа о зачислении */}
                    <div>
                        <label className="block font-semibold mb-1">Дата приказа о зачислении *</label>
                        <input
                            type="text"
                            name="enrlOrderDate"
                            value={student.enrlOrderDate}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Номер приказа о зачислении */}
                    <div>
                        <label className="block font-semibold mb-1">Номер приказа о зачислении *</label>
                        <input
                            type="text"
                            name="enrlOrderNumber"
                            value={student.enrlOrderNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Номер студенческого билета */}
                    <div>
                        <label className="block font-semibold mb-1">Номер студенческого билета *</label>
                        <input
                            type="text"
                            name="studId"
                            value={student.studId}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Дата выдачи студенческого билета */}
                    <div>
                        <label className="block font-semibold mb-1">Дата выдачи студенческого билета *</label>
                        <input
                            type="text"
                            name="studIdDate"
                            value={student.studIdDate}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Группа */}
                    <div>
                        <label className="block font-semibold mb-1">Группа</label>
                        <input
                            type="text"
                            name="group"
                            value={student.group || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Наименование уровня образования */}
                    <div>
                        <label className="block font-semibold mb-1">Наименование уровня образования *</label>
                        <input
                            type="text"
                            name="educationLevel"
                            value={student.educationLevel}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Источник финансирования */}
                    <div>
                        <label className="block font-semibold mb-1">Источник финансирования *</label>
                        <input
                            type="text"
                            name="fundSrc"
                            value={student.fundSrc}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Номер курса */}
                    <div>
                        <label className="block font-semibold mb-1">Номер курса *</label>
                        <input
                            type="text"
                            name="course"
                            value={student.course}
                            onChange={handleChange}
                            required

                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Форма обучения */}
                    <div>
                        <label className="block font-semibold mb-1">Форма обучения *</label>
                        <input
                            type="text"
                            name="studyForm"
                            value={student.studyForm}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Наименование направления */}
                    <div>
                        <label className="block font-semibold mb-1">Наименование направления *</label>
                        <input
                            type="text"
                            name="program"
                            value={student.program}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Код направления */}
                    <div>
                        <label className="block font-semibold mb-1">Код направления *</label>
                        <input
                            type="text"
                            name="programCode"
                            value={student.programCode}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Наименование образовательной программы (Профиль) */}
                    <div>
                        <label className="block font-semibold mb-1">Наименование образовательной программы (Профиль)
                            *</label>
                        <input
                            type="text"
                            name="profile"
                            value={student.profile}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Срок реализации образовательной программы (кол-во месяцев) */}
                    <div>
                        <label className="block font-semibold mb-1">Срок реализации образовательной программы (месяцев)
                            *</label>
                        <input
                            type="text"
                            name="duration"
                            value={student.duration}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Планируемая дата окончания обучения */}
                    <div>
                        <label className="block font-semibold mb-1">Планируемая дата окончания обучения *</label>
                        <input
                            type="text"
                            name="regEndDate"
                            value={student.regEndDate}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Дата завершения обучения или отчисления */}
                    <div>
                        <label className="block font-semibold mb-1">Дата завершения обучения или отчисления</label>
                        <input
                            type="text"
                            name="actEndDate"
                            value={student.actEndDate || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Дата приказа о завершении обучения или отчислении */}
                    <div>
                        <label className="block font-semibold mb-1">Дата приказа о завершении обучения или
                            отчислении</label>
                        <input
                            type="text"
                            name="orderEndDate"
                            value={student.orderEndDate || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Номер приказа о завершении обучения или отчислении */}
                    <div>
                        <label className="block font-semibold mb-1">Номер приказа о завершении обучения или
                            отчислении</label>
                        <input
                            type="text"
                            name="orderEndNumber"
                            value={student.orderEndNumber || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Дата начала академического отпуска */}
                    <div>
                        <label className="block font-semibold mb-1">Дата начала академического отпуска</label>
                        <input
                            type="text"
                            name="acadStartDate"
                            value={student.acadStartDate || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Дата окончания академического отпуска */}
                    <div>
                        <label className="block font-semibold mb-1">Дата окончания академического отпуска</label>
                        <input
                            type="text"
                            name="acadEndDate"
                            value={student.acadEndDate || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Дата приказа о предоставлении академического отпуска */}
                    <div>
                        <label className="block font-semibold mb-1">Дата приказа о предоставлении академического
                            отпуска</label>
                        <input
                            type="text"
                            name="orderAcadDate"
                            value={student.orderAcadDate || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Номер приказа о предоставлении академического отпуска */}
                    <div>
                        <label className="block font-semibold mb-1">Номер приказа о предоставлении академического
                            отпуска</label>
                        <input
                            type="text"
                            name="orderAcadNumber"
                            value={student.orderAcadNumber || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-[#3498DB] hover:bg-[#2F89C5] text-white px-6 py-3 rounded shadow disabled:opacity-50 transition"
                            >
                                {saving ? "Сохранение..." : "Сохранить"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

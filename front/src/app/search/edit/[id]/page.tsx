"use client";

import React, { useEffect, useState } from "react";
import {useParams, useRouter} from "next/navigation";
import { useUserStore } from "@/store/store";
import Header from "@/app/components/Header";
import { StudentFull } from "@/app/models/models";
import {GetStudentById, updateStudentByUUID} from "@/app/Api/Api";

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
            router.push("/control_panel/students");
            return;
        }

        async function fetchStudent() {
            setLoading(true);
            const res = await GetStudentById(params.id as string);
            if (res.success && res.result) {
                setStudent(res.result);
            } else {
                // alert("Ошибка загрузки данных студента");
                // router.push("");
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


    async function handleSave() {
        console.log(student)
        // e.preventDefault();
        // if (!student) return;
        //
        // setSaving(true);
        // const res = await updateStudentByUUID(student.uuid, student);
        // if (res.success) {
        //     alert("Данные успешно сохранены");
        //     router.push("/search/");
        // } else {
        //     alert("Ошибка при сохранении данных");
        // }
        // setSaving(false);
    }

    if (loading || !student) return <div>Загрузка данных...</div>;

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-black">
            <Header />
            <div className="max-w-screen-xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Редактирование студента</h1>

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

                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {saving ? "Сохранение..." : "Сохранить"}
                    </button>
                </form>
            </div>
        </div>
    );
}

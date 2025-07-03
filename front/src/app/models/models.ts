export interface LoginFormData {
    email: string;
    password: string;
}

export interface FormData{
    file: FileList;
}

export interface Columns{
    id: string;
    name: string;
}

export interface ReportEntry {
    email: string;
    col: string[];
    filter: Record<string, string>[];
    joins: string[][];
    date: string;
}
export interface User {
    uuid: string;
    email: string;
    role: string;
}

export interface Student {
    uuid: string;
    surname: string;
    name: string;
    patronymic: string;
    group: string;
}

export interface StudentFull {
    uuid: string;

    lastName: string;
    firstName: string;
    patronymic?: string;

    gender: "Мужской" | "Женский" | string;

    birthDate: string; // ISO-строка

    phoneNumber?: string;

    registrationAddress: string;
    residenceAddress: string;

    passportSeries?: string;
    passportNumber: string;
    passportIssueDate: string;
    passportIssuedBy: string;

    snils?: string;
    medicalPolicyNumber?: string;

    foreignCitizen: boolean;
    specialQuota: boolean;

    enrollmentDate: string;
    enrollmentOrderDate: string;
    enrollmentOrderNumber: string;

    studentCardNumber: string;
    studentCardIssueDate: string;

    group?: string;

    educationLevelName: string;
    fundingSource: string;

    courseNumber: number;
    studyForm: string;

    directionName: string;
    directionCode: string;

    educationalProgramName: string;
    programDurationMonths: number;

    plannedGraduationDate: string;

    graduationOrExpulsionDate?: string;
    graduationOrExpulsionOrderDate?: string;
    graduationOrExpulsionOrderNumber?: string;

    academicLeaveStartDate?: string;
    academicLeaveEndDate?: string;
    academicLeaveOrderDate?: string;
    academicLeaveOrderNumber?: string;
}



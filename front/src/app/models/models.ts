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
    surname: string;
    name: string;
    patronymic?: string;
    gender: string;
    birthday: string;
    phone?: string;
    regAddr: string;
    actAddr: string;
    passportSerial?: string;
    passportNumber: string;
    passportDate: string;
    passportSource: string;
    snils?: string;
    medPolicy?: string;
    foreigner: string;
    quota: string;
    enrlDate: string;
    enrlOrderDate: string;
    enrlOrderNumber: string;
    studId: string;
    studIdDate: string;
    group?: string;
    educationLevel: string;
    fundSrc: string;
    course: string;
    studyForm: string;
    program: string;
    programCode: string;
    profile: string;
    duration: string;
    regEndDate: string;
    actEndDate?: string;
    orderEndDate?: string;
    orderEndNumber?: string;
    acadStartDate?: string;
    acadEndDate?: string;
    orderAcadDate?: string;
    orderAcadNumber?: string;
}



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
};
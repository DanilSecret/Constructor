CREATE TABLE IF NOT EXISTS History
(
    uuid                    uuid                        NOT NULL,
    user_uuid               uuid                        NOT NULL,
    request                 jsonb                       NOT NULL,
    date                    timestamp with time zone    NOT NULL,
    CONSTRAINT "History_pkey"                           PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS Students
(
    uuid                    uuid                        NOT NULL,
    surname                 text                        NOT NULL,
    name                    text                        NOT NULL,
    patronymic              text,
    gender                  text                        NOT NULL,
    birthday                date                        NOT NULL,
    phone                   text,
    reg_addr                text                        NOT NULL,
    act_addr                text                        NOT NULL,
    passport_serial         text ,
    passport_number         text                        NOT NULL,
    passport_date           date                        NOT NULL,
    passport_source         text                        NOT NULL,
    snils                   text,
    med_policy              text,
    foreigner               boolean                     NOT NULL,
    quota                   boolean                     NOT NULL,
    enrl_date               date                        NOT NULL,
    enrl_order_date         date                        NOT NULL,
    enrl_order_number       text                        NOT NULL,
    stud_id                 text,
    stud_id_date            date,
    "group"                 text,
    education_level         text                        NOT NULL,
    fund_src                text                        NOT NULL,
    course                  smallint                    NOT NULL,
    study_form              text                        NOT NULL,
    program                 text                        NOT NULL,
    program_code            text                        NOT NULL,
    profile                 text                        NOT NULL,
    duration                integer                     NOT NULL,
    reg_end_date            date                        NOT NULL,
    act_end_date            date,
    order_end_date          date,
    order_end_number        text,
    acad_start_date         date,
    acad_end_date           date,
    order_acad_date         date,
    order_acad_number       text,
    CONSTRAINT "Students_pkey"                          PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS Users
(
    uuid                    uuid                        NOT NULL,
    email                   text                        NOT NULL,
    password                text                        NOT NULL,
    role                    text                        NOT NULL,
    CONSTRAINT "Users_pkey"                             PRIMARY KEY (uuid),
    CONSTRAINT email                                    UNIQUE (email)
        INCLUDE(email)
);

ALTER TABLE IF EXISTS History
    ADD CONSTRAINT "History_user_uuid_fkey"             FOREIGN KEY (user_uuid)
    REFERENCES Users (uuid) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
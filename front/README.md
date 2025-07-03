# Документация по проекту Constructor

<br> Локальное окружение: `http://localhost:8080`

---
Пример формирования адреса:

```http
GET http://localhost:8080/api/user/upload
```

Где: <br>
`localhost:8080` - адрес сервера <br>
`/api` - обращение к api <br>
`/user` - название роли или сервиса <br>
`/upload` - эндпоинт

---
# Пользователи
## Авторизация

---

### Вход

```http
POST http://localhost:8080/api/auth/login
```

#### Запрос:

```curl
curl --request POST \
  --url http://localhost:8080/api/auth/login \
  --header 'withCredentials: true' \
  --data '{
	"email": "test",
	"password":"test"
}'
```
где: <br>

| Параметр    | Значение           |
|-------------|--------------------|
| email       | Email пользователя |
| password    | Введенный пароль   |

### Ответ:

#### Успешный вход:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IHVzZXIiLCJpYXQiOjE3NDQwNDY2NzIsImV4cCI6MTc0NDEzMzA3Mn0.5o1l1kGDzOb10cPQNW-f4sBJHhwOVKXJ37ogK8G_ibI",
  "user": {
    "uuid": "5a86f10d-a94f-41f2-a192-8ec5d7c1b7c8",
    "email": "test user",
    "passport": "test",
    "role": "USER"
  }
}
```

```http
Status Code = 200 OK
```

#### Неверный запрос:
```json
{
  "error" : "Неверный запрос"
}
```
```http
Status Code = 400 Bad Request
```
#### Неверный email или пароль:
```json
{
  "error" : "Неверный email или пароль"
}
```
```http
Status Code = 401 Unauthorized
```
---
#### Доступ запрещён:
```json
{
  "error" : "Доступ запрещён"
}
```
```http
Status Code = 403 Forbidden
```
---

## Регистрация пользователя (в админ панели)

```http
POST http://localhost:8080/api/admin/register
```

#### Запрос:

```curl
curl --request POST \
  --url http://localhost:8080/api/admin/register \
  --header '' \
  --data '{
    "email": "test user",
    "password": "123"
}'
```

где: <br>

| Параметр  | Значение                                                   |
|-----------|------------------------------------------------------------|
| email     | Email пользователя (должен быть уникальным)                |
| password  | Пароль                                                     |
### Ответ:

---

#### Успешная регистрация:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NSIsImlhdCI6MTc0MzUyMTgyOCwiZXhwIjoxNzQzNjA4MjI4fQ.vXkDTsNhsrnXlRf_ei-eJK3q4X78YFcIZMzuyMUbCsY",
  "user": {
    "id": "5a86f10d-a94f-41f2-a192-8ec5d7c1b7c8",
    "email": "user",
    "role": "USER"
  }
}
```
```http
Status Code = 200 OK
```

---

#### Совпадающие данные:

```json
{
    "error": "Пользователь с таким email уже существует"
}
```
```http
Status Code = 400 Bad Request
```

---
## Выход из системы

```http
DELETE http://localhost:8080/api/user/logout
```
Удаляет JWT cookie, завершает сессию пользователя.
```curl
curl --request DELETE \
--url http://localhost:8080/api/user/logout \
--cookie "JSESSIONID=your_session_id"
```

# Работа с файлами

## Загрузка файла

```http
POST http://localhost:8080/api/user/upload
```
Запрос:
```curl
curl --request POST \
--url http://localhost:8080/api/user/upload \
--header 'Content-Type: multipart/form-data' \
--cookie "JSESSIONID=your_session_id" \
--form 'file=@"путь к файлу"'
```
## Получение всех колонок
```http
GET http://localhost:8080/api/user/getCols
```
Описание:
Возвращает список столбцов данных студентов (структура зависит от studentsService.getCols()).
```curl
curl --request GET \
  --url http://localhost:8080/api/user/getCols \
  --cookie "JSESSIONID=your_session_id"
```





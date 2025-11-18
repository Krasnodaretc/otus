# OTUS Homework Project

## Часть 1: Квадратное уравнение с TDD

Первая часть учебного проекта OTUS, посвященная разработке решателя квадратных уравнений с использованием принципов Test-Driven Development (TDD).

## Архитектура «Космический бой»

Материалы по микросервисной архитектуре игры находятся в каталоге `docs/`:

- Текстовое описание: `docs/architecture.md`
- Диаграммы:
  - Context: `docs/diagrams/context.mmd`
  - Container: `docs/diagrams/container.mmd`
  - Components: `docs/diagrams/components/`
  - Sequences: `docs/diagrams/sequences/`
- События: `docs/events.md`
- Эндпоинты: `docs/endpoints.md`

## Описание текущей части

Эта часть проекта реализует класс `QuadraticSolver` для нахождения корней квадратного уравнения вида ax² + bx + c = 0. 

Основная цель - изучение и применение методологии TDD, которая является важной частью концепции Time To Market в современной разработке.

### Возможности

- Нахождение корней квадратного уравнения
- Обработка всех случаев: без корней, один корень, два корня
- Валидация входных параметров
- Обработка специальных значений (NaN, Infinity)
- Точная работа с числами с плавающей точкой

## Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd otus

# Установить зависимости
pnpm install
```

## Использование

### Запуск демо

```bash
pnpm run dev
```

### Запуск тестов

```bash
# Запуск всех тестов
pnpm test

# Запуск тестов в режиме наблюдения
pnpm run test:watch

# Запуск тестов с покрытием
pnpm run test:coverage
```

### Сборка проекта

```bash
pnpm run build
```

## API

### QuadraticSolver.solve(a, b, c)

Решает квадратное уравнение ax² + bx + c = 0

**Параметры:**
- `a` (number) - коэффициент при x²
- `b` (number) - коэффициент при x
- `c` (number) - свободный член

**Возвращает:**
- `number[]` - массив корней уравнения

**Исключения:**
- Выбрасывает ошибку если `a` равен нулю или близок к нулю
- Выбрасывает ошибку при передаче NaN, Infinity или -Infinity

### Примеры использования

```typescript
import { QuadraticSolver } from './src/QuadraticSolver';

const solver = new QuadraticSolver();

// Уравнение без корней: x² + 1 = 0
const noRoots = solver.solve(1, 0, 1); // []

// Уравнение с двумя корнями: x² - 1 = 0
const twoRoots = solver.solve(1, 0, -1); // [1, -1]

// Уравнение с одним корнем: x² + 2x + 1 = 0
const oneRoot = solver.solve(1, 2, 1); // [-1]
```

## Структура проекта

```
├── src/
│   ├── QuadraticSolver.ts    # Основной класс
│   └── index.ts              # Демо и экспорты
├── tests/
│   └── QuadraticSolver.test.ts # Модульные тесты
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI
├── package.json              # Конфигурация проекта
├── tsconfig.json             # Конфигурация TypeScript
└── README.md                 # Документация
```

## Разработка с использованием TDD

Проект разработан с использованием принципов Test-Driven Development:

1. ✅ Тест для случая без корней (x² + 1 = 0)
2. ✅ Тест для случая с двумя корнями (x² - 1 = 0)
3. ✅ Тест для случая с одним корнем (x² + 2x + 1 = 0)
4. ✅ Тест для валидации коэффициента a ≠ 0
5. ✅ Тест для случая с дискриминантом близким к нулю
6. ✅ Тесты для специальных значений (NaN, Infinity)

## CI/CD

Проект настроен для автоматического тестирования через GitHub Actions:

- Запуск тестов на Node.js 18.x и 20.x
- Проверка компиляции TypeScript
- Генерация отчета о покрытии кода
- Загрузка результатов в Codecov
- CI срабатывает на push и pull request в любую ветку

## Будущие части проекта

Это первая часть учебного проекта. В следующих частях планируется расширение функциональности и изучение других аспектов современной разработки.

## Лицензия

ISC
 
---

Auth microservice and JWT integration
====================================

Overview
--------
This project includes:
- Game server (HTTP `/messages`, WS `/ws`)
- Auth service (HTTP `/battles`, `/token`)

Auth service issues HS256 JWT tokens for players participating in a battle. The game server validates tokens and enforces that the message `gameId` matches the token `gameId`.

Environment variables
---------------------
- Game server:
  - `PORT` (default: 3000)
  - `AUTH_SECRET` (shared HS256 secret, default: `dev-secret`)
  - `AUTH_URL` (base URL of Auth service, e.g., `http://localhost:4000`)
- Auth service:
  - `AUTH_PORT` (default: 4000)
  - `AUTH_SECRET` (shared HS256 secret, default: `dev-secret`)

Commands
--------
- Start game server:
  - `pnpm start:server`
- Start auth service:
  - `pnpm start:auth`
- Build:
  - `pnpm build`
- Tests:
  - `pnpm test`

Auth API
--------
- `POST /battles`:
  - Body: `{ "participants": ["user-1","user-2"] }`
  - Response: `{ "gameId": "uuid" }`
- `POST /token`:
  - Headers: `X-User-Id: user-1`
  - Body: `{ "gameId": "uuid" }`
  - Response: `{ "token": "jwt" }`

Game server API
---------------
- `POST /messages`:
  - Headers: `Authorization: Bearer <jwt>`
  - Body: `{ "gameId": "uuid", "objectId": "...", "operationId": "...", "args": {} }`
  - Response: `202 Accepted` if token is valid and `gameId` matches

# ТЗ и структура: HR Smart Links (умные ссылки для рекрутинга)

## 1. Краткое описание продукта

Платформа умных ссылок для HR-маркетинга. Один короткий линк направляет кандидата на лучшее следующее действие (релевантная вакансия/лендинг/опрос/календарь) по правилам: навыки/канал/гео/язык/устройство/время/лимиты/эксперименты. События кликов и результатов собираются для аналитики. Управление через Admin API, правила — через Rules API и DSL.

- Основной файл ТЗ: `src/diplom/requirements.md`
- Язык реализации: TypeScript (как в репо)
- Развёртывание: Docker Compose (локально/демо)
- Хранилище: MongoDB + Mongoose (ODM)

## 2. Роли

- Admin: управление тенантом/доступами
- Recruiter: кампании, ссылки, правила, вакансии
- Analyst: отчеты/экспорт
- Edge client: публичный доступ к редиректу по slug (API key)

## 3. Пользовательские сценарии

- Создать кампанию и “умный линк” с правилами: skill-match, geo-locale, device, time-window, A/B, capacity
- Автогенерация UTM, переопределение целей во время акций/инцидентов
- Интеграция: CRM/ATS webhook при клике/заявке; экспорт отчётов
- Без простоя: заменить/добавить поведение через DSL/плагины без изменения ядра

## 4. Доменная модель (основное)

- Campaign, SmartLink(slug), RuleSet, Rule, Condition, Action, Target, CandidateProfile, Vacancy, Experiment, Cap, Event, Plugin(Condition|Action), PipelineStage, ApiKey, Tenant (опц.)

## 5. Функциональные требования

- Создание/CRUD SmartLink, кампаний, вакансий, правил (DSL)
- Редирект 302/307 на действие по сработавшему правилу
- События: click, rule_matched, redirect, error, webhook_dispatched
- A/B/N сплит, приоритеты и капы; fallback
- Импорт/экспорт правил (JSON DSL)

## 6. Расширяемость без изменения кода

- DSL для описания правил (Interpreter)
- Горячие плагины условий/действий (dynamic import) + IoC-регистрация
- Middleware-пайплайн: normalizer → anti-fraud → rate-limit → evaluator → action → audit

## 7. API (суммарно)

- Edge Redirector
  - GET `/r/{slug}` → 302/307, `X-Trace-Id` и событие в шину
- Rules API
  - CRUD RuleSet/Rule; валидация/preview `POST /rules/preview`
- Admin API
  - CRUD Campaign/SmartLink/Vacancy, выдача API key, отчёты
- Analytics API
  - GET отчёты (сгруппированные метрики по ссылкам/кампаниям/каналам)

Пример ответа preview:

```json
{
  "matchedRuleId": "r-123",
  "explain": [
    {"condition": "skill:javascript", "result": true},
    {"condition": "geo:ru", "result": true}
  ],
  "action": {"type": "redirect", "url": "https://careers.example.com/jobs/fe-dev"}
}
```

## 8. DSL правил (JSON)

- Структура: `if` (all/any) из conditions → `then` actions → `else` fallback
- Conditions (базовые плагины): `skill`, `geo`, `locale`, `device`, `os`, `browser`, `timeWindow`, `abBucket`, `capacity`, `referrer`, `source`, `featureFlag`
- Actions: `redirect(url)`, `appendUtm`, `webhook(url, payload)`, `deeplink(schema)`

Пример:

```json
{
  "rules": [
    {
      "id": "r1",
      "if": {"all": [
        {"type": "skill", "hasAny": ["javascript", "react"]},
        {"type": "geo", "in": ["ru", "by", "kz"]},
        {"type": "timeWindow", "from": "09:00+03:00", "to": "21:00+03:00"}
      ]},
      "then": [
        {"type": "redirect", "url": "https://careers.example.com/jobs/fe-dev"},
        {"type": "appendUtm", "map": {"utm_campaign": "fe-autumn"}}
      ],
      "else": [
        {"type": "redirect", "url": "https://careers.example.com/jobs/all"}
      ]
    }
  ]
}
```

## 9. Архитектура и микросервисы

- Edge Redirector: HTTP вход, контекст (UA, IP→geo, cookies), пайплайн, редирект, события
- Rules Engine/API: DSL, валидатор, эвалюатор, реестр плагинов, превью
- Admin API: кампании, ссылки, вакансии, ключи, отчёты (читает из Analytics)
- Analytics/Event Collector: принимает события из шины, агрегирует и хранит
- Shortener/QR (опц.): генерация slug/QR

Инфраструктура (Compose): MongoDB, Redis, NATS (шина событий)

## 10. Паттерны/техники

- Chain of Responsibility (middleware), Strategy/Specification (conditions), Interpreter (DSL), Observer (events), Decorator/Proxy (кэш/метрики), State (A/B/rollout), CQRS + Outbox (опц.), Retry/Backoff, Circuit Breaker
- IoC/DI: контейнер из репозитория, явная регистрация зависимостей

## 11. НФТ/SLAs

- p95 редиректа: ≤ 30 ms при тёплом кэше, холодный ≤ 80 ms
- 1–2k rps локально; устойчивость к недоступности Rules/Analytics (cache, async fire-and-forget)
- Безопасность: API key/JWT, подпись линков, rate limiting, CORS, sanitization

## 12. Данные и интеграции

- MongoDB (Mongoose):
  - Коллекции: `campaigns`, `smart_links`, `rulesets`, `vacancies`, `api_keys`, `events` (TTL), `metrics_daily` (роллап)
  - Индексы: по `slug`, `campaignId`, `createdAt`, TTL для `events`
- Redis: кэш правил, капы/квоты, rate limit, feature flags
- NATS: события кликов/матчинга/редиректов/вебхуков
- Интеграции: CRM/ATS webhooks (подписные), IP→Geo провайдер (локальный mmdb)

## 13. Тест-стратегия (≥90%)

- Unit: DSL parser, evaluator, плагины, middleware, IoC wiring
- Контрактные: OpenAPI → API tests (Rules/Admin/Edge)
- Интеграционные: целевой пайплайн, события и агрегация (Mongo rollups)
- Покрытие: инструмент `c8`/Istanbul, порог 90% в CI-скриптах

## 14. Развёртывание (Docker Compose)

- Сервисы: `edge`, `rules-api`, `admin-api`, `analytics`, `nats`, `mongo`, `redis`
- Healthchecks, сети, переменные окружения, volume для данных

## 15. Риски и решения

- Спуфинг контекста (UA/geo) → многосигнальная эвристика + explain лог
- Пики трафика → кэш правил, async события, backpressure
- Конфликты правил → сортировка по приоритетам + `preview/explain`

## 16. Структура проекта (`src/diplom`)

- `edge/` — сервер редиректа (HTTP, пайплайн, контекст)
- `rules-engine/` — DSL, валидатор, эвалюатор, реестр плагинов
- `rules-api/` — CRUD RuleSet/preview
- `admin-api/` — CRUD кампаний/ссылок/вакансий/ключей, отчёты
- `analytics/` — коллектор событий и агрегатор
- `plugins/` — базовые плагины: conditions/actions
- `common/` — типы, IoC, конфиг, logger, http, sdk
- `db/` — `schemas` (Mongoose), `seeds`, скрипты индексов/TTL
- `tests/` — e2e/контракты (или колокация в модулях)

## 17. Что будет сделано на первом шаге

- Добавить `src/diplom/requirements.md` по этому ТЗ
- Скaffold сервисов и интерфейсов плагинов/DSL
- Compose-файл на корне репо для сервисов
- Базовые плагины условий/действий и unit-тесты с порогом 90%



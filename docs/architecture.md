# Архитектура микросервисов для игры «Космический бой»
# Архитектура проекта

## ООП-реализация и паттерны

- Rules Engine
  - Interpreter: `JsonDslParser` преобразует JSON DSL в модель.
  - Composite: `AllCondition`/`AnyCondition` c деревом условий.
  - Strategy/Specification: `Condition`/`Action` как стратегии матчей/действий.
  - Visitor (вариант через явные классы-обходчики): `RuleEvaluator` и сбор explain.
  - Abstract Factory/Registry: фабрики/реестр плагинов условий и действий.
  - Decorator/Proxy (потенциал): метрики/таймауты плагинов.

- Edge
  - Chain of Responsibility: `ContextNormalizer → RateLimitHandler → ResolveRuleHandler → AuditHandler`.
  - Facade: `RedirectFacade` собирает цепочку и координирует выполнение.
  - Strategy: провайдеры UA/Geo (позже — расширение).

- Rules/Admin API
  - Use Case/Application Layer: `CreateRuleSetHandler`, `UpdateRuleSetHandler`, `PreviewRulesHandler`, и для Admin сущностей.
  - Repository: интерфейсы и реализации на Mongoose.
  - DTO/Mapper: отделение транспорта от домена.

- Analytics
  - Observer/Dispatcher: `EventDispatcher` + обработчики.
  - Strategy: `DailyRollup` (агрегации), возможно `HourlyRollup`.
  - Repository: доступ к событиям и агрегатам.

- Общие
  - IoC/DI: зависимости через фабрики/реестры и тонкий контейнер.
  - Policies: `ApiKeyPolicy` (Specification) со `scopes`.
  - Observability: `withMeasurement` декоратор.

## Микросервисы
- Edge Redirector, Rules API, Admin API, Analytics — декомпозиция сохранена.
- Инфраструктура: MongoDB, Redis, NATS через Docker Compose.

## Тестирование
- Unit: ядро правил, плагины, пайплайн Edge, политики, наблюдаемость.
- Контрактные: OpenAPI для API.
- Интеграционные: рольапы/события, превью правил, редиректы.

## Обзор
Система разбита на независимые сервисы: аутентификация, профили, турниры, матчмейкинг, оркестрация боёв, симуляция/движок, рейтинги, уведомления, реплеи, планировщик, админ, шлюз. Коммуникации: синхронные REST/gRPC через API Gateway и асинхронные события через брокер (Kafka/NATS). Данные: PostgreSQL (OLTP), Redis (кэш/кворумы/очереди), S3-совместимое хранилище для реплеев, ClickHouse/BigQuery для аналитики.

## Сервисы и ответственность
- API Gateway/BFF: единая точка входа (REST+WebSocket), авторизация, rate limiting.
- Auth Service: регистрация, логин, JWT/refresh, OAuth2 (опционально).
- User/Profile Service: профиль игрока, связи с Агентом, настройки.
- Tournament Service: CRUD турниров, заявки, сетки, расписание, статусы.
- Matchmaking Service: очереди, правила подбора, бронирование слотов матчей.
- Battle Orchestrator: запуск/мониторинг боёв, управление воркерами/движком, сбор артефактов и логов, публикация событий.
- Game Engine Workers: исполнение боя в изоляции, валидация, запись реплея.
- Rating Service: расчёт рейтинга (Elo/Glicko), лидерборды, историчность.
- Notification Service: e-mail/push/websocket, шаблоны, планируемые рассылки.
- Replay Service: загрузка/хранение/выдача реплеев, индексация метаданных.
- Scheduler/Jobs Service: напоминания о старте, дедлайны, периодические задачи.
- Admin Service: модерация, ручные перезапуски, наблюдение.
- Observability Stack: логирование, метрики, трейсинг.

## Хранилища
- PostgreSQL: auth, users, tournaments, matches, applications, ratings.
- Redis: кэш профилей/токенов, очереди матчмейкинга, локи.
- Kafka/NATS: событийная шина.
- S3: реплеи, логи боёв, вложения.
- ClickHouse: аналитика событий/метрик, снапшоты лидербордов (опционально).

## Потоки (высокоуровневые)
- Заявка в турнир: UI → Gateway → Tournament; событие `tournament.application.submitted`; уведомление; принятие/отклонение → `tournament.application.decided`.
- Матчмейкинг: Tournament публикует слоты, Matchmaking формирует пары → `match.created`.
- Бой: Orchestrator резервирует матч, запускает воркера; завершение → `match.finished`, `battle.replay.available`.
- Рейтинг: Rating подписан на `match.finished`, пересчитывает очки → `rating.updated`.
- Уведомления: подписка на `application.decided`, `match.started|finished`, а также плановые напоминания из Scheduler.

## Узкие места и масштабирование
- Симуляции боёв (CPU/IO): изолированные воркеры, автоскейлинг по длине очереди/метрикам, лимиты ресурсов, приоритеты, backpressure.
- Пики уведомлений: batching, пулы провайдеров, rate limit, повторы и DLQ.
- Горячие турниры (блокировки): шардирование по tournamentId, оптимистичные транзакции, CQRS для чтений.
- Матчмейкинг: Redis структуры (streams/sorted sets), O(1) горячий путь, пересчёты в фоне.
- Лидерборды: инкрементальные апдейты, кэширование, read replicas.
- WebSocket: pub/sub-бэкенд, sticky sessions, горизонтальное масштабирование.
- Реплеи: холодное хранение, политики жизненного цикла, компрессия, CDN.
- События: идемпотентность, ключи дедупликации, DLQ, экспоненциальные ретраи, контрактное тестирование.

## Компоненты с частыми изменениями и OCP
- Формулы рейтинга: Strategy/Plugin, конфигурируемые параметры, версионирование.
- Правила турниров (сетка, тайминги, форматы): Policy/Strategy, версия правил в сущности турнира.
- Алгоритмы матчмейкинга: Strategy, feature flags/A-B.
- Каналы уведомлений и шаблоны: Adapter, шаблоны в БД, каналы как плагины.
- Протокол Агент ↔ Движок: версионирование контрактов, backwards-compatible адаптеры.
- Античит/валидации: цепочки правил, конфигурация без перекомпиляции.
- Формат реплеев: версия формата и adapters для чтения/записи.

## Безопасность и наблюдаемость
- Безопасность: JWT, ограниченные токены для Агентов, изоляция воркеров (cgroups/Firecracker), верификация артефактов.
- Наблюдаемость: централизованные логи, метрики SLI/SLO, трассировка, алерты.
- Данные: миграции, бэкапы, политики хранения.

## Ссылки на диаграммы и спецификации
- Context: `docs/diagrams/context.mmd`
- Container: `docs/diagrams/container.mmd`
- Components: `docs/diagrams/components/`
- Sequences: `docs/diagrams/sequences/`
- Events: `docs/events.md`
- Endpoints: `docs/endpoints.md`



## Core code and design patterns

### 1. Chain of Responsibility: Edge pipeline

- `src/diplom/edge/pipeline/Handler.ts`  
  Абстракция обработчика запроса (`Handler`, `BaseHandler`), реализующая шаблон Chain of Responsibility: каждый обработчик выполняет свою часть логики и передаёт управление дальше, если статус ответа не сигнализирует об ошибке.
- `src/diplom/edge/pipeline/ContextNormalizer.ts`  
  Обработчик, который нормализует контекст запроса (время, device и др.), подготавливая данные для дальнейших стадий пайплайна.
- `src/diplom/edge/pipeline/RateLimitHandler.ts`  
  Обработчик, реализующий rate limiting на Redis: считает запросы в окне времени и при превышении лимита выставляет статус 429, обрывая цепочку.
- `src/diplom/edge/pipeline/ResolveRuleHandler.ts`  
  Обработчик, который вызывает бизнес‑функцию `resolveRedirect`, интегрируя Edge с Rules Engine и определяя целевой редирект.
- `src/diplom/edge/pipeline/AuditHandler.ts`  
  Обработчик, публикующий события `click`, `rule_matched`, `redirect` в `EventBus`, реализуя связку с событийной архитектурой.
- `src/diplom/edge/PipelineFactory.ts`  
  Фабрика, которая собирает цепочку обработчиков в нужном порядке, инжектируя реализацию `EventBus` (консольная или NATS).
- `src/diplom/edge/RedirectFacade.ts`  
  Фасад над пайплайном Edge: предоставляет простой метод `handle(ctx)`, скрывая детали цепочки обработчиков.
- `src/diplom/edge/service.ts`  
  Функция `resolveRedirect` как ядро use‑case: загрузка SmartLink по slug, чтение RuleSet, вызов Rules Engine и выбор итогового действия (редирект/204/404).

### 2. Interpreter + Composite: JSON DSL for rules

- `src/diplom/rules-engine/types.ts`  
  Описание структуры DSL (`ConditionNode`, `ActionNode`, `RuleNode`, `RuleSetNode`) и типов результата (`EvaluationResult`, `ExplainEntry`), формализующее язык правил.
- `src/diplom/rules-engine/normalize.ts`  
  Нормализация JSON DSL в унифицированное дерево условий (`all` / `any` / leaf), подготавливающее структуру к обработке.
- `src/diplom/rules-engine/oop/Condition.ts`  
  Классы `AllCondition` и `AnyCondition` реализуют Composite над условиями, позволяя строить деревья правил; `PluginCondition` инкапсулирует вызов конкретного condition‑плагина и записывает explain.
- `src/diplom/rules-engine/oop/Parser.ts`  
  `JsonDslParser` — интерпретатор DSL: преобразует JSON‑описание RuleSet в объектную модель (`Rule`, `RuleSetOop`, дерево `Condition` + список `Action`).

### 3. Strategy + Plugin Registry: conditions and actions

- `src/diplom/rules-engine/types.ts`  
  Интерфейсы `ConditionPlugin` и `ActionPlugin` задают контракт стратегий для условий и действий: каждая реализация принимает контекст и параметры и возвращает результат матчинга или действие.
- `src/diplom/rules-engine/registry.ts`  
  Реестр плагинов (Registry/Abstract Factory): хранит зарегистрированные условия и действия, предоставляя `registerCondition`, `registerAction`, `getCondition`, `getAction`.
- `src/diplom/plugins/conditions/skill.ts`  
  Пример condition‑плагина: проверяет, содержит ли профиль кандидата хотя бы один из требуемых навыков (`hasAny`), инкапсулируя стратегию проверки навыков.
- `src/diplom/plugins/actions/redirect.ts`  
  Пример action‑плагина: строит действие `redirect` с URL, извлекая параметры из DSL и возвращая структурированный результат для Edge.
- `src/diplom/plugins/loader.ts`  
  Динамическая загрузка плагинов: определяет тип (condition/action), проверяет форму плагина и регистрирует его в реестре, позволяя расширять систему без изменения ядра.
- `src/diplom/plugins/register.ts`  
  Регистрация встроенных плагинов условий и действий при старте системы, формируя базовый набор стратегий для Rules Engine.

### 4. Evaluator and explain: rule evaluation core

- `src/diplom/rules-engine/oop/Rule.ts`  
  Классы `Rule` и `RuleSetOop`: инкапсулируют приоритет, корневое условие и списки действий, а также сортировку правил по приоритету.
- `src/diplom/rules-engine/oop/Evaluator.ts`  
  `RuleEvaluator` проходит по отсортированным правилам, оценивает дерево условий, накапливает explain‑лог и последовательно запускает actions для первой сработавшей ветки.
- `src/diplom/rules-engine/evaluator.ts`  
  Тонкая обёртка `evaluateRuleSet`, связывающая DSL‑узел RuleSet с OOP‑моделью и обеспечивающая единый вход для сервисов.

### 5. Event-driven architecture: EventBus and NATS

- `src/diplom/common/events.ts`  
  Интерфейс `EventBus`, консольная реализация для локальной разработки и фабрика `createNatsEventBus`, публикующая события в NATS с добавлением метаданных и таймстемпа.
- `src/diplom/common/nats.ts`  
  Подключение к NATS с ретраями и логированием: инкапсулирует устойчивое соединение к брокеру как инфраструктурную деталь.
- `src/diplom/edge/pipeline/AuditHandler.ts`  
  Обработчик пайплайна, который на каждый запрос генерирует доменные события (`click`, `rule_matched`, `redirect`) и отправляет их в `EventBus`, реализуя Observer поверх EventBus.
- `src/diplom/analytics/server.ts`  
  Сервис аналитики, подписывающийся на `events.*`, сохраняющий события в коллекцию `events` и агрегирующий метрики в `metrics_daily`, замыкая событийный контур.

### 6. IoC / Dependency Injection

- `src/diplom/common/ioc.ts`  
  Простой IoC‑контейнер с регистрацией singleton‑объектов и фабрик, позволяющий отделять конфигурацию зависимостей от использования и облегчать тестирование.



# Эндпоинты и авторизация

Все публичные REST-эндпоинты доступны через API Gateway. Аутентификация — Bearer JWT. Роли: `player`, `admin`. Вебсокеты — `/ws` с апгрейдом и валидацией JWT.

## Auth
- POST `/auth/register` — регистрация (анонимно)
- POST `/auth/login` — логин, выдача токенов (анонимно)
- POST `/auth/refresh` — обновление access токена (анонимно)
- POST `/auth/logout` — отзыв refresh токена (player)

Пример:
```http
POST /auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "secret" }
```
```json
{ "accessToken": "jwt", "refreshToken": "jwt" }
```

## Users
- GET `/users/me` (player)
- PATCH `/users/me` (player)
- GET `/users/{id}` (player)

## Tournaments
- GET `/tournaments` (player)
- POST `/tournaments` (player)
- GET `/tournaments/{id}` (player)
- POST `/tournaments/{id}/applications` (player)
- GET `/tournaments/{id}/applications` (admin/owner)
- POST `/tournaments/{id}/approve` (admin/owner)
- POST `/tournaments/{id}/reject` (admin/owner)
- GET `/tournaments/{id}/matches` (player)
- POST `/tournaments/{id}/publish-schedule` (admin/owner)

## Matchmaking
- POST `/matchmaking/enqueue` (player)
- DELETE `/matchmaking/enqueue` (player)
- GET `/matchmaking/status` (player)

## Matches
- GET `/matches/{id}` (player)
- POST `/matches/{id}/start` (admin/orchestrator)
- GET `/matches/{id}/replay` (player)

## Rating
- GET `/leaderboard` (player)
- GET `/leaderboard/{tournamentId}` (player)
- GET `/ratings/{userId}` (player)

## Notifications
- GET `/notifications` (player)
- POST `/notifications/test` (admin)

## Replays
- POST `/replays/upload` (orchestrator)
- GET `/replays/{id}` (player)

## Admin
- POST `/admin/matches/{id}/rerun` (admin)
- POST `/admin/tournaments/{id}/reseed` (admin)

## WebSocket
- `/ws` — события статусов матчей, напоминания, прогресс
```json
{ "type": "match.status", "matchId": "uuid", "status": "started" }
```



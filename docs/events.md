# Доменные события и топики

Событийная шина: Kafka/NATS. Все события идемпотентны, содержат ключи дедупликации и версию схемы.

## Общие поля события
```json
{
  "eventId": "uuid",
  "eventType": "string",
  "occurredAt": "2025-01-01T00:00:00Z",
  "version": 1,
  "source": "service-name",
  "traceId": "uuid",
  "payload": {}
}
```

## User
- Topic: `user.registered`, `user.email.verified`

```json
{
  "eventType": "user.registered",
  "payload": {
    "userId": "uuid",
    "email": "user@example.com"
  }
}
```

## Tournament
- Topic: `tournament.created`
- Topic: `tournament.application.submitted`
- Topic: `tournament.application.decided`

```json
{
  "eventType": "tournament.application.decided",
  "payload": {
    "tournamentId": "uuid",
    "applicationId": "uuid",
    "userId": "uuid",
    "decision": "approved"
  }
}
```

## Match
- Topic: `match.created`
- Topic: `match.reserved`
- Topic: `match.started`
- Topic: `match.finished`

```json
{
  "eventType": "match.finished",
  "payload": {
    "matchId": "uuid",
    "tournamentId": "uuid",
    "players": [
      { "userId": "uuid", "score": 1 },
      { "userId": "uuid", "score": 0 }
    ],
    "result": "player1_win",
    "durationMs": 120345
  }
}
```

## Battle/Replay
- Topic: `battle.replay.available`

```json
{
  "eventType": "battle.replay.available",
  "payload": {
    "matchId": "uuid",
    "replayId": "uuid",
    "location": "s3://bucket/path/to/replay"
  }
}
```

## Rating
- Topic: `rating.updated`

```json
{
  "eventType": "rating.updated",
  "payload": {
    "userId": "uuid",
    "ratingOld": 1500,
    "ratingNew": 1512,
    "matchId": "uuid",
    "tournamentId": "uuid",
    "method": "elo"
  }
}
```

## Notification
- Topic: `notification.requested` → `notification.sent`

```json
{
  "eventType": "notification.sent",
  "payload": {
    "channel": "email",
    "template": "tournament-invite",
    "recipient": "user@example.com",
    "status": "delivered",
    "ref": { "tournamentId": "uuid", "userId": "uuid" }
  }
}
```



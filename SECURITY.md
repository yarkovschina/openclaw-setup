# Security & Infrastructure Rules

> Документация для агентов и людей. Описывает как устроена безопасность,
> бэкапы, контроль версий и правила работы с кодом на этом сервере.
>
> **Последнее обновление:** 2026-02-22

---

## 1. Архитектура сервера

### 1.1 Проекты

| Проект | Путь | Назначение | GitHub |
|--------|------|-----------|--------|
| **openclaw** | `/home/ubuntu/openclaw` | AI-оркестратор: gateway, агенты, skills | — (локальный git) |
| **openclaw-secretary** | `/home/ubuntu/openclaw-secretary` | Telegram-бот секретарь (бронирование, календарь) | `Sholudchenko/cleshen_bot-secretary` |
| **rag-pipeline** | `/home/ubuntu/rag-pipeline` | ETL-пайплайн: фильтрация → группировка → суммаризация → эмбеддинги | `Sholudchenko/rag-pipeline` |
| **marketing-rag-bot** | `/home/ubuntu/marketing-rag-bot` | Telegram-бот маркетинга (копирайтер, таргетолог, lead) | `Sholudchenko/marketing-rag-bot` |
| **telegram-mcp** | `/home/ubuntu/telegram-mcp` | MCP-сервер для доступа к Telegram от имени пользователя | `Sholudchenko/telegram-mcp` |

### 1.2 Процессы

| Процесс | Порт | Управление |
|---------|------|-----------|
| `openclaw-gateway` | 18799 (loopback) | Запуск вручную / `openclaw run` |

### 1.3 Агенты

В `/home/ubuntu/openclaw/agents/` живут агенты:
- `slavy` — основной AI-ассистент
- `slavy-ops` — DevOps/SRE агент
- `slavy-secretary` — секретарь
- `cto` — технический архитектор
- `senior-codex` — кодер (OpenAI Codex)
- `senior-opus` — кодер (Anthropic Claude)
- `main` — агент маршрутизации

---

## 2. Секреты и credentials

### 2.1 Правила

1. **Секреты НИКОГДА не коммитятся в git.** Ни в каком виде.
2. Все `.env` файлы имеют permissions `600` (только владелец читает).
3. Каждый проект имеет `.env.example` с пустыми значениями — он коммитится, `.env` — нет.
4. `.gitignore` во всех проектах исключает: `.env`, `.env.*`, `credentials/`, `*.bak`.
5. Pre-commit hooks во всех репозиториях блокируют коммиты, содержащие паттерны API-ключей.

### 2.2 Где хранятся секреты

| Секрет | Файл | Кто использует |
|--------|------|----------------|
| OpenAI API Key | `openclaw/.env`, `rag-pipeline/.env`, `marketing-rag-bot/.env` | Gateway, RAG pipeline, Marketing bot |
| Telegram Bot Token (secretary) | `openclaw-secretary/.env` | Secretary bot |
| Telegram Bot Token (marketing) | `marketing-rag-bot/.env` | Marketing bot |
| Telegram API ID/Hash | `telegram-mcp/.env` | MCP server (user account) |
| Google OAuth | `~/.secrets/google/client_secret.json` | Calendar integration |
| GOG Calendar credentials | `openclaw-secretary/.env` | Calendar booking |
| LiteLLM API Key | `rag-pipeline/.env`, `marketing-rag-bot/.env` | Fallback LLM routing |
| Gateway auth token | `openclaw/openclaw.json` | Gateway API auth |
| WhatsApp credentials | `openclaw/credentials/` | WhatsApp integration |

### 2.3 Что делать при утечке

1. **Немедленно ротировать ключ** на стороне провайдера (OpenAI dashboard, BotFather, etc.)
2. Обновить `.env` файлы на сервере
3. Проверить git history на предмет утёкшего ключа: `git log -p --all -S 'LEAKED_KEY_PREFIX'`
4. Если ключ попал в git — использовать `git filter-branch` или `bfg` для удаления из истории

---

## 3. Контроль версий

### 3.1 Правила

1. **Все проекты под git.** Каждый проект имеет baseline-коммит.
2. **AI-агенты (Codex, Claude Code) работают в feature-ветках** (`codex/*`, `claude/*`), не напрямую в `main`.
3. **Перед запуском AI на проекте** — убедись что working tree чистый (`git status`). Если есть незакоммиченные изменения — `git stash` или коммит.
4. **Merge в main** — через PR (если на GitHub) или вручную после code review.
5. **Теги на значимые релизы:** `git tag v1.x.x` перед деплоем.

### 3.2 GitHub-репозитории

| Проект | Remote | Протокол |
|--------|--------|----------|
| openclaw-secretary | `git@github.com-openclaw-secretary:Sholudchenko/cleshen_bot-secretary.git` | SSH (выделенный ключ) |
| rag-pipeline | `https://github.com/Sholudchenko/rag-pipeline.git` | HTTPS (gh auth) |
| marketing-rag-bot | `https://github.com/Sholudchenko/marketing-rag-bot.git` | HTTPS (gh auth) |
| telegram-mcp | `https://github.com/Sholudchenko/telegram-mcp.git` | HTTPS (gh auth) |
| openclaw | — | Только локальный git |

### 3.3 CI/CD

`openclaw-secretary` имеет GitHub Actions (`.github/workflows/ci.yml`):
- Secrets scan — проверяет diff на паттерны API-ключей
- Shellcheck — линтит bash-скрипты

### 3.4 Pre-commit hooks

Скрипт: `/home/ubuntu/scripts/pre-commit-secrets`
Установлен в `.git/hooks/pre-commit` всех 5 репозиториев.

Блокирует коммиты, содержащие:
- `sk-` (OpenAI/Anthropic ключи)
- `AAEZ`, `AAGc`, `AAH[A-Z]` (Telegram bot tokens)
- `GOCSPX-` (Google OAuth secrets)
- `AIzaSy` (Google API keys)
- `ntn_` (Notion tokens)

Обход (только при полной уверенности): `git commit --no-verify`

---

## 4. Бэкапы

### 4.1 Автоматические бэкапы

| Параметр | Значение |
|----------|---------|
| Скрипт | `/home/ubuntu/scripts/backup.sh` |
| Расписание | Ежедневно 03:00 UTC (cron) |
| Хранилище | `/home/ubuntu/backups/` |
| Ротация | 7 дней (старые удаляются автоматически) |
| Размер | ~263MB (основной) + ~2.6MB (сессии) |

### 4.2 Что бэкапится

**Основной архив** (`backup-YYYYMMDD-HHMMSS.tar.gz`):
- `openclaw/openclaw.json` — главный конфиг
- `openclaw/credentials/` — WhatsApp ключи, токены
- `openclaw/memory/` — SQLite базы памяти агентов
- `openclaw/devices/` — пары устройств
- `openclaw/telegram/` — Telegram state
- `openclaw/cron/` — расписание задач
- `openclaw/workspace*/` — конфиги всех агентов (SOUL.md, AGENTS.md и т.д.)
- `openclaw-secretary/.env` — секреты секретаря
- `rag-pipeline/.env` + `rag-pipeline/chroma_data/` — RAG данные и эмбеддинги
- `marketing-rag-bot/.env` — секреты маркетинг-бота
- `telegram-mcp/.env` — секреты MCP
- `.openclaw-secretary/` — state секретаря (сессии, auth)
- `.secrets/` — Google OAuth credentials
- `exports/` — экспорты данных из Telegram

**Архив сессий** (`sessions-YYYYMMDD-HHMMSS.tar.gz`):
- Все `*.jsonl` файлы агентов
- `auth-profiles.json` файлы агентов

### 4.3 Что НЕ бэкапится (есть в git)

- Исходный код проектов (восстанавливается из git)
- `.venv/`, `node_modules/` (восстанавливаются через `pip install` / `npm install`)
- Логи (ротируются logrotate)

### 4.4 Восстановление

```bash
# Посмотреть доступные бэкапы
/home/ubuntu/scripts/restore.sh

# Восстановить конкретный бэкап (извлекает в ~/restore-DATE/ для ревью)
/home/ubuntu/scripts/restore.sh 20260222-030000

# Вручную скопировать нужные файлы обратно
cp ~/restore-DATE/openclaw/openclaw.json ~/openclaw/
```

**Важно:** restore.sh НЕ перезаписывает файлы автоматически. Он извлекает в отдельную директорию — ты сам решаешь что копировать обратно.

---

## 5. Мониторинг и аудит

### 5.1 Еженедельный аудит

| Параметр | Значение |
|----------|---------|
| Скрипт | `/home/ubuntu/scripts/audit.sh` |
| Расписание | Каждый понедельник, 10:00 UTC (cron) |
| Уведомления | Telegram (chat_id: 329069903, через бота-секретаря) |
| Лог | `/home/ubuntu/scripts/audit.log` |

**Что проверяет:**

| Проверка | Порог | Статус при нарушении |
|----------|-------|---------------------|
| `openclaw-gateway` процесс жив | — | ❌ CRITICAL |
| RAM gateway | < 1GB | ⚠️ WARNING |
| Диск | < 80% | ❌ CRITICAL |
| Размер backups/ | < 5GB | ⚠️ WARNING |
| gateway.log | < 50MB | ⚠️ WARNING |
| Свежесть бэкапа | < 26 часов | ❌ CRITICAL |
| Размер бэкапа | > 100MB | ⚠️ WARNING |
| Git drift (все репо) | clean | ⚠️ WARNING |
| .env tracked в git | нет | ❌ CRITICAL |
| .env permissions | 600 | ❌ CRITICAL |

### 5.2 Ротация логов

Файл: `/etc/logrotate.d/openclaw`
- `gateway.log` ротируется еженедельно
- Хранится 4 архива с компрессией
- `copytruncate` — не требует рестарта gateway

---

## 6. SSH и доступ

| Параметр | Значение |
|----------|---------|
| SSH порт | 2222 |
| Аутентификация | Только SSH-ключи (пароли отключены) |
| Основной ключ | `~/.ssh/id_ed25519` |
| GitHub (secretary) | `~/.ssh/github_openclaw_secretary` (отдельный deploy key) |
| Firewall | UFW (SSH 2222 + необходимые порты) |
| fail2ban | Активен |

---

## 7. Правила для AI-агентов

### 7.1 Общие правила

1. **Читай перед тем как менять.** Всегда `git status`, `git log`, прочитай файл перед редактированием.
2. **Не трогай секреты.** Не выводи, не логируй, не коммить API-ключи и токены.
3. **Работай в ветке.** Feature branch → PR/review → merge. Не коммить в `main` напрямую.
4. **Подтверждай деструктивные операции.** `rm`, `drop`, `restart`, `overwrite` — только после подтверждения человеком.
5. **Rollback plan.** Для любого рискованного изменения — сначала опиши как откатить.
6. **Не трогай чужие проекты.** Если задача про `rag-pipeline`, не меняй `openclaw`.

### 7.2 Перед началом работы

```bash
# 1. Проверь что working tree чистый
git status

# 2. Если есть незакоммиченные изменения — stash или commit
git stash  # или git add + git commit

# 3. Создай ветку
git checkout -b feature/описание-задачи

# 4. Работай в ветке

# 5. После завершения — commit, push, PR
```

### 7.3 Запрещено

- `git push --force` в `main`
- `rm -rf` без подтверждения
- Изменение `.env` файлов через git
- Коммит файлов из `credentials/`, `memory/`, `browser/`
- Перезапуск `openclaw-gateway` без причины
- Изменение `openclaw.json` без бэкапа

---

## 8. Структура файловой системы

```
/home/ubuntu/
├── openclaw/                    # Главный AI-оркестратор
│   ├── openclaw.json            # ⚠️  Главный конфиг (секреты внутри, не коммитится)
│   ├── .env                     # 🔒 OpenAI API key
│   ├── credentials/             # 🔒 WhatsApp, Telegram credentials
│   ├── memory/                  # 🔒 SQLite базы памяти
│   ├── agents/                  # Директории агентов (sessions, auth)
│   ├── workspace*/              # Конфиги агентов (SOUL.md, TOOLS.md)
│   ├── sandboxes/               # Skills (навыки агентов)
│   ├── cron/                    # Расписание задач
│   ├── canvas/                  # Web UI
│   ├── completions/             # Shell completions
│   └── logs/                    # Gateway логи
│
├── openclaw-secretary/          # Бот-секретарь
│   ├── config/                  # Конфиг (JSON с токенами)
│   ├── scripts/                 # Скрипты проверки
│   ├── systemd/                 # Service definition
│   ├── workspace/               # Identity файлы
│   ├── docs/                    # Документация
│   └── .github/workflows/       # CI pipeline
│
├── rag-pipeline/                # RAG ETL пайплайн
│   ├── pipeline/                # Шаги обработки (step1-step5)
│   ├── utils/                   # Утилиты (LLM client, text processing)
│   └── chroma_data/             # 🔒 ChromaDB эмбеддинги (не в git)
│
├── marketing-rag-bot/           # Маркетинг-бот
│   ├── prompts/                 # Промпты ролей (copywriter, targeting, lead)
│   └── bot.py, query_engine.py  # Основной код
│
├── telegram-mcp/                # MCP Telegram server
│   └── telegram_mcp.py          # Основной MCP сервер
│
├── scripts/                     # Ops-скрипты
│   ├── backup.sh                # Ежедневный бэкап
│   ├── restore.sh               # Восстановление из бэкапа
│   ├── audit.sh                 # Еженедельный аудит
│   └── pre-commit-secrets       # Pre-commit hook (шаблон)
│
├── backups/                     # Архивы бэкапов (7 дней)
├── exports/                     # Экспорты данных Telegram
├── .secrets/                    # 🔒 Централизованные секреты (Google OAuth)
├── .openclaw-secretary/         # 🔒 State секретаря (сессии, auth)
├── .telegram-mcp/               # 🔒 Telethon session data
└── .claude/                     # Claude Code конфиги
    └── settings.local.json      # Permissions allowlist
```

Легенда: 🔒 = содержит секреты/sensitive data, не коммитится, бэкапится отдельно.

---

## 9. Cron-расписание

```
0 3 * * *  /home/ubuntu/scripts/backup.sh   # Ежедневный бэкап 03:00 UTC
0 10 * * 1 /home/ubuntu/scripts/audit.sh    # Аудит по понедельникам 10:00 UTC
```

Расписание openclaw (внутренний cron gateway):
- 07:00 — Daily Schedule
- 08:00 — Morning Briefing (ежедневно) + Weekly Task Report (пн)
- 09:00 — Daily Task Digest (пн-пт)
- 11:00, 16:00 — Task Reminder Runner (пн-пт)

---

## 10. Контакты экстренной помощи

| Что | Команда |
|-----|---------|
| Посмотреть статус gateway | `ps aux \| grep openclaw-gateway` |
| Посмотреть логи gateway | `tail -100 ~/openclaw/logs/gateway.log` |
| Запустить бэкап вручную | `~/scripts/backup.sh` |
| Запустить аудит вручную | `~/scripts/audit.sh` |
| Восстановить из бэкапа | `~/scripts/restore.sh` |
| Проверить cron | `crontab -l` |
| Проверить permissions .env | `ls -la ~/openclaw/.env ~/rag-pipeline/.env` |
| Проверить git drift | `for d in openclaw openclaw-secretary rag-pipeline marketing-rag-bot telegram-mcp; do echo "==$d=="; git -C ~/$d status --short; done` |

# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.



### Calendar

- Default account: `sholudchenko@gmail.com`
- Default calendar: `primary`
- Timezone: `America/Sao_Paulo`
- Mode: quick (create/move without confirm; delete with confirm)
- Core commands:
  - `gog calendar list --account sholudchenko@gmail.com`
  - `gog calendar events primary --account sholudchenko@gmail.com --from <ISO> --to <ISO>`
  - `gog calendar create primary --account sholudchenko@gmail.com --summary "..." --from <ISO> --to <ISO>`
  - `gog calendar update primary <eventId> --account sholudchenko@gmail.com --from <ISO> --to <ISO>`

### Telegram Personal Send Route (yarskiy_assist)

When user asks to send a Telegram message to another person, do NOT use OpenClaw `message` tool.
Use `exec` with this command:

`/home/ubuntu/telegram-mcp/send_from_user.sh "<chat>" "<text>"`

Rules:
- This sends from personal Telethon session `yarskiy_assist`.
- Accept `<chat>` as `yarskiy`, `@yarskiy`, numeric id, or `https://t.me/...`.
- Use OpenClaw `message` tool only to reply back to the operator in current bot chat.

### Telegram Personal Commands (yarskiy_assist)

Use these via `exec` for external Telegram actions:

- Send:
  `/home/ubuntu/telegram-mcp/send_from_user.sh "<chat>" "<text>"`
- Join chat/channel:
  `/home/ubuntu/telegram-mcp/join_chat.sh "<@username_or_invite_link>"`
- Reply:
  `/home/ubuntu/telegram-mcp/reply_message.sh "<chat>" "<reply_to_message_id>" "<text>"`
- Forward:
  `/home/ubuntu/telegram-mcp/forward_message.sh "<from_chat>" "<message_id>" "<to_chat>"`
- Summarize last messages:
  `/home/ubuntu/telegram-mcp/summarize_chat.sh "<chat>" "<limit>"`
- Watch mentions + notify with gist and forward:
  `/home/ubuntu/telegram-mcp/watch_mentions.sh "<chat>" "<notify_chat>" "<limit>"`

Notes:
- `<chat>` can be `yarskiy`, `@yarskiy`, numeric id, `me`, or `https://t.me/...`.
- Keep OpenClaw `message` tool for operator replies in bot chat only.

# Heartbeat — Scheduled Tasks

## Morning Briefing
- **Schedule**: daily at 08:00 BRT (11:00 UTC)
- **Action**: Generate morning briefing with 5 blocks:
  1. Top 3 tasks for today (read from tasks.md)
  2. Business/money status (if data available, otherwise skip)
  3. Product/marketing status (any active experiments or deadlines)
  4. Energy reminder (suggest exercise type based on day of week)
  5. Risk of the day (one thing that could derail the day)
- **Format**: compact, under 200 words
- **Channel**: send to user's primary Telegram chat

## Evening Review
- **Schedule**: daily at 20:00 BRT (23:00 UTC)
- **Action**: Generate evening review with 3 blocks:
  1. What got done today
  2. What was missed or postponed
  3. Top priority for tomorrow morning
- **Format**: compact, under 150 words
- **Channel**: send to user's primary Telegram chat

## Weekly Planning Reminder
- **Schedule**: Sunday at 19:00 BRT (22:00 UTC)
- **Action**: Remind user to do weekly planning. Offer to help structure the week.
- **Format**: one short message + offer to start planning session

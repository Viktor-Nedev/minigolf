## Inspiration
I built Crazy Golf to capture the feel of classic arcade mini golf: quick rounds, playful physics, and the thrill of competing with friends in realtime—all inside the browser.

## What it does
The game lets me and up to three friends join a lobby, pick maps and rounds, and play synchronized turns with smooth physics. Missions, rewards, profile stats, cosmetic unlocks, and a continuous soundtrack sit on top of the core loop.

## How I built it
I used plain HTML/CSS/JS with a canvas renderer for the course and physics. Supabase Realtime powers lobbies and turn sync, while Supabase Database keeps scores and unlocks. Missions, rewards, and audio state live in lightweight JS modules so I can stay framework-free.

## Challenges I ran into
I had to keep multiplayer turns stutter-free while physics stayed local, respect browser autoplay limits for audio across devices, and design a flexible lobby flow (create/join, map selection, variable rounds) without a frontend framework.

## Accomplishments I'm proud of
I shipped jitter-free realtime turns for four players, a polished lobby/rewards/profile UX without heavy libraries, and a full audio system with music ducking and consistent SFX feedback.

## What I learned
I learned practical realtime patterns with Supabase channels and presence, how to balance client-side physics with an authoritative turn flow, and how much small UX touches—readiness states, responsive layouts—shape multiplayer feel.

## What's next for Crazy Golf
Next up: persistent tournaments and asynchronous challenges, more course themes and hazards with mobile-first tuning, and analytics-driven matchmaking plus anti-abandon safeguards to keep games flowing.

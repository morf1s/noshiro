# Noshiro

![Noshiro](https://cdn.discordapp.com/attachments/946217358542897182/1084700000744914954/1024px-Noshiro.png)
> Noshiro © Azur Lane

## Features:

✓ High quality bot and waifu       
✓ Easy to use  
✓ Full slash command       
✓ Stable _🙏_?          
✓ 💖 Very cute (Very Important)      


## Noshiro
It's our personal music bot for chllin in VC while listening to some music, it currenctly only has basic music commands but i'll add other feature such as filters or 24/7 cmd in the future.

## Self Host Instuctions
### Docker
Using docker, I recommend you to install docker on your server to make the setup more easier

- [Docker Installation Instructions](https://docs.docker.com/engine/install/)

After installing docker you need to rename the `application.examplee.yml` and `docker-compose.examplee.yml` files and remove the `.example` from the file name

After that you can edit the lavalink config `application.yml` if you want to
And for the bot config at `docker-compose.yml`
```
DISCORD_TOKEN: YOUR_BOT_TOKEN
OWNER_IDS: YOU_AND_YOUR_DISCORD_ID_MAYBE

// Optional, default to n.
DEFAULT_PREFIX: n.

// This part is optional if you not editing the lavalink config
LAVALINK_NODES: '[{"auth":"youshallnotpass","name":"Lava Docker","secure":false,"url":"lavalink:2333"}]'
```

Run the bot and lavalink server
```
docker compose up -d
```

And then the final step after your bot online to register the commands
```
<bot_prefix>ric
```

### Other

- Install Lavalink if you don't have one https://github.com/freyacodes/Lavalink
- Rename `.env.example` to `.env`
- Fill the required env 

```
DISCORD_TOKEN=YOUR_BOT_TOKEN
OWNER_IDS=YOU_AND_YOUR_DISCORD_ID_MAYBE

// Optional, default to n.
DEFAULT_PREFIX=

LAVALINK_NODES='[{"auth":"youshallnotpass","name":"Lava Local Server","secure":false,"url":"localhost:2333"}]'
```

Run The Bot
```
pnpm prod
// or
npm run prod
```

Final Step, register the commands
```
<bot_prefix>ric
```

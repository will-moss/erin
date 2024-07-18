# 1- Build Caddy modules
FROM caddy:2.8.4-builder AS builder

RUN xcaddy build \
    --with github.com/caddyserver/replace-response

# 2 - Set up Caddy and the frontend built beforehand
FROM caddy:2.8.4-alpine

# Install the modules
COPY --from=builder /usr/bin/caddy /usr/bin/caddy

# Set Caddy configuration
COPY docker/Caddyfile /etc/caddy/Caddyfile

# Install the React App
COPY ./build /srv

# Set default environment variables
ENV AUTH_ENABLED "true"
ENV AUTH_SECRET "\$2a\$14\$qRW8no8UDmSwIWM6KHwdRe1j/LMrxoP4NSM756RVodqeUq5HzG6t."
ENV PUBLIC_URL "https://localhost"
ENV APP_TITLE "Erin - TikTok feed for your own clips"

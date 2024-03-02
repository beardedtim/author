# Author

> Graph-Based Authorization Service

## Development

```sh
# Start Backing Services
#
docker compose up -d

# Install Node Deps
#
# you can also use npm or yarn
# but you'll need to figure that
# out yourself
pnpm install --frozen-lockfile

# Copy over env
#
# If you need to set custom values
# you should do that now
cp .env.example .env

# Migrate Database
#
pnpm migrate-db

# Sync Database and Types
#
./scripts/sync-database-types

# Start System
#
pnpm dev

# you should now be able to go reach localhost:5000
```

# Author

> Graph-Based Authorization Service

## Usage

```ts
const actor = await fetch("http://localhost:5000/api/v1/actors", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Tim Roberts",
  }),
})
  .then((x) => x.json())
  .then(({ data }) => data);

const resource = await fetch("http://localhost:5000/api/v1/resources", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Blog 1",
    description: "Some description",
  }),
})
  .then((x) => x.json())
  .then(({ data }) => data);

await fetch("https://localhost:5000/api/v1/relationships", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    actor: actor._id,
    resource: resource._id,
    relationship: RELATIONSHIPS.OWN,
  }),
});

// true
const canEditBlogPost = await fetch(
  `http://localhost:5000/api/v1/permissions/${actor._id}/${ACTIONS.EDIT}/${resource._id}`
)
  .then((x) => x.json())
  .then(({ data }) => data);
```

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

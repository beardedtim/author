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

## Examples

### Graph

### Graph State

Let's say that we have a graph with the given state

![graph image](./artifacts/Screenshot%20from%202024-03-02%2016-05-35.png)

We can ask it:

_**Do I have permission to delete ead0e788-648a-458e-b4b3-fb9e442694e9**_

![I can delete that resource](./artifacts/Screenshot%20from%202024-03-02%2016-07-16.png)

_**Do I have permission to delete a78a9d69-927c-49a8-904f-ea675227057b**_

![Since I have only reads, I cannot delete that](./artifacts/Screenshot%20from%202024-03-02%2016-08-26.png)

_**Do I have permission to read a78a9d69-927c-49a8-904f-ea675227057b**_

![I do, since I have that permission in the graph](./artifacts/Screenshot%20from%202024-03-02%2016-09-28.png)

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

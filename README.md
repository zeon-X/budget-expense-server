# Budget Expense Server

## Configuration

Create a local environment file before starting the API:

```bash
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to a MongoDB connection string. In deployed environments, provide the same variable through the platform's secret or environment-variable settings; it takes precedence over `.env`.

```env
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority"
PORT=3000
```

Then run:

```bash
npm run start:dev
```

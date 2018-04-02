# financial-api
A REST secure API exposing financial data

```
./setup.sh
npm run start
```

go to `localhost:8080`

**Exercise**
- store token in mongo
- create an endpoint to invalidate it
- check this token in a middleware on every protected endpoint
- test calls shouldn't work when the token has been invalidated
# Feelings Houses Backend - Render Deployment

## Environment Variables Required:

```
MONGO_URL=mongodb+srv://feelings_admin:6932659816Del@feelingshouses.jgubn0g.mongodb.net/feelings_houses?appName=FeelingsHouses
DB_NAME=feelings_houses
CORS_ORIGINS=*
```

## Build Command:
```
pip install -r requirements.txt
```

## Start Command:
```
uvicorn server:app --host 0.0.0.0 --port $PORT
```

## Health Check Path:
```
/api/
```

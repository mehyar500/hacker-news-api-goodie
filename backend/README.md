# Hacker News Analytics Dashboard

This README provides **comprehensive setup**, **run**, and **development** instructions for the **backend/** service. Follow each step carefully.

---

## 📁 Project Structure

```
hacker-news-api-goodie/
├── backend/
│   ├── analytics/
│   ├── hn_dashboard/
│   ├── docker-compose.yml
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
└── frontend/

```

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/mehyar500/hacker-news-api-goodie.git
   cd hacker-news-api-goodie/backend
   ```
2. **Create & activate virtual environment**
   ```bash
   python -m venv venv
   # macOS/Linux:
   source venv/bin/activate
   # Windows (Git Bash):
   source venv/Scripts/activate
   # Windows (CMD):
   venv\Scripts\activate.bat
   # Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   ```
3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and fill in SECRET_KEY, DATABASE_URL, REDIS_URL
   ```
5. **Start Docker services**
   ```bash
   docker-compose up -d
   ```
6. **Apply database migrations & run server**
   ```bash
   python manage.py migrate
   python manage.py runserver 8000
   ```
7. **Access API docs**
   - Swagger UI: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
   - OpenAPI schema: [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)

---

## 🐳 Docker Setup

`docker-compose.yml` defines:

- **PostgreSQL** (port 5432)
  - USER: `hn_user`
  - PASS: `hn_pass`
  - DB:   `hn_db`
- **Redis** (port 6379)

Start/stop:

```bash
# Start containers
docker-compose up -d
# View logs
docker-compose logs -f
# Stop & remove
docker-compose down
```

---

## 📦 Python Dependencies

All required packages are listed in `requirements.txt`. Key libraries:

- **Django** & **Django REST Framework**
- **drf-spectacular** for OpenAPI schema
- **channels** & **channels-redis** for WebSockets
- **django-redis** for caching
- **pydantic** for type-safe models
- **pytest** & **pytest-django** for testing

To update dependencies:

```bash
pip install <package>
pip freeze > requirements.txt
```

---

## ⚙️ Environment Variables

See `.env.example` for required variables:

```ini
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://hn_user:hn_pass@localhost:5432/hn_db
REDIS_URL=redis://localhost:6379/1
```

- **.env** is **gitignored**. Never commit secrets.

---

## 🔧 Django Configuration

1. **Database** in `settings.py`:
   ```python
   import dj_database_url
   DATABASES = {
       'default': dj_database_url.parse(os.getenv('DATABASE_URL'), conn_max_age=600)
   }
   ```
2. **Caching**:
   ```python
   CACHES = {
       'default': {
           'BACKEND': 'django_redis.cache.RedisCache',
           'LOCATION': os.getenv('REDIS_URL'),
           'OPTIONS': {'CLIENT_CLASS': 'django_redis.client.DefaultClient'}
       }
   }
   ```
3. **Channels**:
   ```python
   INSTALLED_APPS += ['channels']
   ASGI_APPLICATION = 'hn_dashboard.asgi.application'
   CHANNEL_LAYERS = {
       'default': {
           'BACKEND': 'channels_redis.core.RedisChannelLayer',
           'CONFIG': {'hosts': [os.getenv('REDIS_URL')]}  
       }
   }
   ```

---

## 📋 Available Endpoints

| Endpoint            | Description                                     |
| ------------------- | ----------------------------------------------- |
| `/api/stories/`     | Raw top 50 stories data                         |
| `/api/insights/`    | Aggregated keyword frequencies & top domains    |
| `/api/trending/`    | Top 10 trending words from story titles         |
| `/api/correlation/` | List of (score, comments) pairs for correlation |
| `/api/schema/`      | OpenAPI schema (JSON)                           |
| `/api/docs/`        | Interactive Swagger UI                          |

---

## 🧪 Testing

Run unit tests with pytest:

```bash
pytest
```

Tests cover:

- Service functions (`fetch_top_stories`, trending, correlation)
- API endpoints

---

## 🤖 CI/CD

GitHub Actions workflow at `.github/workflows/backend-ci.yml` runs on **push** and **pull\_request**, spinning up Postgres & Redis, installing dependencies, migrating, and running tests.

---

## 🚀 Next Steps

- Integrate frontend with these APIs
- Add Celery for background fetching
- Deploy to production (Heroku, AWS ECS, etc.)
- Secure SECRET\_KEY and set `DEBUG=False`

---

Happy coding! 🎉


FROM python:3.12-slim

WORKDIR /app
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1

# System deps (none beyond base for v0)
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Project files
COPY apps/calc-engine/pyproject.toml ./apps/calc-engine/
COPY apps/calc-engine/app ./apps/calc-engine/app
COPY apps/calc-engine/tests ./apps/calc-engine/tests

WORKDIR /app/apps/calc-engine

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -e ".[dev]"

EXPOSE 8001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]

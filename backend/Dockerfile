# Python 3.11 고정 — pinned pydantic 2.5.2 / psycopg2 등은 3.13 휠/빌드 비호환.
# CI(backend-test)도 3.11 을 사용하므로 동일 런타임으로 정렬한다.
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential pkg-config libssl-dev libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r /app/requirements.txt

COPY . /app

EXPOSE 8000

CMD ["chalice", "local", "--host", "0.0.0.0", "--port", "8000"]
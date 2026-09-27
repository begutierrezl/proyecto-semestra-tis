FROM python:3.13.15-slim-bookworm

ENV PYTHONONTWRITEBYTECODE=1 \ 
PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y curl

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY requirement.txt .
RUN uv pip install -r requirement.txt --system

COPY . .
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

EXPOSE 8000

CMD ["./entrypoint.sh"]
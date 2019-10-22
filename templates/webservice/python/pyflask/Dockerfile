FROM python:3.7-slim-buster

# caching trick, requirements becomes a cached layer, optimized when file doesn't change
COPY requirements.txt /
RUN pip install -r /requirements.txt

COPY . /app
WORKDIR /app

ENTRYPOINT ["python"]
CMD ["microservice.py"]
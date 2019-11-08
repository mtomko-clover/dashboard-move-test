FROM python:3.7-slim-buster

# caching trick, requirements becomes a cached layer, optimized when file doesn't change
COPY script/requirements.txt /
RUN pip install -r /requirements.txt

COPY ./script /app
WORKDIR /app

# ENTRYPOINT [ "/bin/bash" ]
ENTRYPOINT ["python3"]
CMD ["dav.py"]

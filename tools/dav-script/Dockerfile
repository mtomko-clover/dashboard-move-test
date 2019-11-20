# Want a slim base, but only ubuntu latest successfully connects to prod mysql with --ssl-cipher=DHE-RSA-AES256-SHA
# No doubt some simple library missing, but spent too much time expiramenting, moving on for now. Should be able to 
# rebase this image on something else that will work, if we can just figure out the missing requirement
FROM ubuntu:latest

#FROM python:3.7-slim-buster
#FROM python:3.8.0-buster
#FROM centos:8

RUN apt update 
RUN apt install -y python3 \
     python3-pip 
     # pycodestyle \
     # pyflakes \
     # pylint



# caching trick, requirements becomes a cached layer, optimized when file doesn't change
COPY script/requirements.txt /
RUN pip3 install -r /requirements.txt

COPY ./script /app
WORKDIR /app

# RUN pycodestyle .
# RUN pyflakes .
# RUN pylint .

# ENTRYPOINT [ "/bin/bash" ]
ENTRYPOINT ["python3"]
CMD ["dav.py"]

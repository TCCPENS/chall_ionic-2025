FROM python:3.12.9

RUN apt update
RUN apt install -y zlib1g-dev udev libnss3 ca-certificates
RUN apt install -y chromium

RUN rm -rf /tmp/* /var/lib/apt/lists/* /usr/share/man

RUN pip install --break-system-packages --no-cache-dir selenium flask chromedriver-autoinstaller

RUN mkdir -p /home/bot/data/

WORKDIR /app

COPY . .

RUN echo "IONIC{REDACTED}" > flag.txt

RUN python3 -c "import chromedriver_autoinstaller; chromedriver_autoinstaller.install()"

CMD python3 server.py
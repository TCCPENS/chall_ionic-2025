FROM ubuntu:20.04 AS builder

RUN apt-get update && apt-get install -y gcc libssl-dev

WORKDIR /app

COPY vuln.c .

RUN gcc vuln.c -o vuln -no-pie -fno-stack-protector -lssl -lcrypto

FROM ubuntu:20.04
RUN apt-get update && apt-get install -y socat

WORKDIR /opt/chall
RUN useradd -m player

COPY --from=builder /app/vuln .

COPY flag_part1.txt .
RUN chown player:player flag_part1.txt && mv flag_part1.txt /home/player/flag.txt

USER player

EXPOSE 9999

CMD ["socat", "TCP4-LISTEN:9999,fork,reuseaddr", "EXEC:./vuln"] 
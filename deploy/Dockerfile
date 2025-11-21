FROM ubuntu:24.04

RUN apt-get update && \
    apt-get install -y socat && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m -d /home/ctf -s /bin/bash ctf && \
    mkdir -p /home/ctf/challenge

WORKDIR /home/ctf/challenge

COPY chall /home/ctf/challenge/chall
COPY flag.txt /flag.txt

RUN chmod 555 /home/ctf/challenge/chall && \
    chmod 444 /flag.txt && \
    chown root:root /home/ctf/challenge/chall /flag.txt && \
    chown root:root /home/ctf/challenge && \
    chmod 555 /home/ctf/challenge

RUN chmod 555 /home/ctf

RUN mkdir -p /tmp/ctf && \
    chown ctf:ctf /tmp/ctf && \
    chmod 1777 /tmp/ctf

USER ctf

EXPOSE 9999

# Resource limits and security options will be set via docker-compose
CMD ["socat", "-T60", "TCP-LISTEN:9999,reuseaddr,fork", "EXEC:'./chall',pty,stderr,setsid,sigint,sane"]

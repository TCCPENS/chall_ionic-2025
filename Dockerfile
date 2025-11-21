
FROM i386/ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive


RUN apt-get update && \
    apt-get install -y build-essential socat && \
    rm -rf /var/lib/apt/lists/*


RUN useradd --create-home --shell /bin/bash ctf
WORKDIR /home/ctf


COPY vuln.c .


RUN echo "SAW!" > canary.txt && \
    echo "IONIC{AK53S_K3_M41NFR4M3_SAW_D1D4P4TK4N}" > flag.txt

RUN gcc -m32 -fno-stack-protector -no-pie -o vuln vuln.c

RUN chown -R root:ctf /home/ctf && \
    chmod 755 /home/ctf/vuln && \
    chmod 444 /home/ctf/canary.txt && \
    chmod 444 /home/ctf/flag.txt

USER ctf
EXPOSE 9999
CMD ["socat", "TCP4-LISTEN:9999,fork,reuseaddr", "EXEC:./vuln"]


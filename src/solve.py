from pwn import *

# context.log_level = "debug"
p = process(["python", "chall.py"])

ALPHABET = [chr(x) for x in range(33, 127)]
A2I = {c: i for i, c in enumerate(ALPHABET)}
M = len(ALPHABET)


def decrypt(ciphertext: str, key: str) -> str:
    P = list(key)
    out = []
    for i, ch in enumerate(ciphertext):
        if ch in ALPHABET:
            j = P.index(ch)
            idx = (j - (i % M)) % M
            out.append(ALPHABET[idx])
        else:
            out.append(ch)
    return "".join(out)


p.sendline(b"!" * 94)
p.recvuntil(b">>")

key = p.recvline().strip()
log.info(f"{key=}")

while True:
    if b">>" in (out := p.recvline()):
        log.success(out.decode())
        break
    p.recvuntil(b"??? ")
    enc = p.recvline().strip()
    log.info(f"{enc=}")

    dec = decrypt(enc.decode(), key.decode())
    log.info(f"{dec=}")
    p.sendlineafter(b"??? > ", dec)

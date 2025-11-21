from pwn import *
import randcrack

context.log_level = "debug"

p = process(["python", "chall.py"])


rc = randcrack.RandCrack()


def generate_token(r: int, n: int, c: int, e: int, KEY: bytes):
    MASK32 = 0xFFFFFFFF

    r &= MASK32
    n &= MASK32
    c &= MASK32
    e &= MASK32
    x = (r ^ 0x9E3779B1) & MASK32

    t = (n ^ 0x85EBCA6B) & MASK32
    t = ((t << 7) | (t >> (32 - 7))) & MASK32
    x = (x + t) & MASK32

    u = (c * 0xC2B2AE35) & MASK32
    u = ((u << 13) | (u >> (32 - 13))) & MASK32
    x ^= u
    x = (x + e) & MASK32

    x ^= x >> 16
    x = (x * 0x7FEB352D) & MASK32
    x ^= x >> 15
    x = (x * 0x846CA68B) & MASK32
    x ^= x >> 16
    x &= MASK32

    km = 0
    for i, b in enumerate(KEY[:32]):
        km = (km + ((b ^ i) * 0x045D9F3B)) & MASK32
        sh = (i % 31) + 1
        km = ((km << sh) | (km >> (32 - sh))) & MASK32

    x ^= km
    x ^= km

    return x & MASK32


code = ""
coupon_id = ""
name = "yellow_submarine"

for i in range(156):  # 624 / 4
    p.recvuntil(b"Select option: ")
    p.sendline(b"1")
    p.sendline(name.encode())

    p.recvuntil(b"Secret Key : ")
    r, n, c, e = p.recvline().strip().decode().split(".")
    r, n, c, e = int(r), int(n), int(c), int(e)
    rc.submit(r)
    rc.submit(n)
    rc.submit(c)
    rc.submit(e)

    p.recvuntil("Your Code : ")
    code = p.recvline().strip()
    code = code.decode()

    log.info(f"got #{i + 1}: {r}.{n}.{c}.{e}, {code}")
    coupon_id = generate_token(r, n, c, e, b"DUMMY")

    p.recvuntil(b"Press Enter to continue...")
    p.sendline(b"")

cipher = bytes.fromhex(code)

r = rc.predict_getrandbits(32)
n = rc.predict_getrandbits(32)
c = rc.predict_getrandbits(32)
e = rc.predict_getrandbits(32)

pred = generate_token(r, n, c, e, b"DUMMY")
log.success(f"predicted winning id = {pred}")


prev = f"{name}|{hex(coupon_id)}".encode()
payload = f"{name}|{hex(pred)}".encode()
c1 = cipher[: len(payload)]

delta = xor(prev, payload)
c1_ = xor(delta, c1)
cipher = c1_ + cipher[len(payload) :]


p.recvuntil(b"Select option: ")
p.sendline(b"2")
p.sendline(cipher.hex().encode())

p.interactive()

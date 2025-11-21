encrypted_data = [
  0x44, 0x12, 0x1c, 0x2d, 0x1d, 0x53, 0x34, 0x17, 0x52, 0x0, 
  0x2d, 0x1d, 0xb, 0x58, 0x2f, 0xa, 0x47, 0xb, 0x48, 0x1e
]

key = "patrick"

decrypted_text = ""

for i, byte in enumerate(encrypted_data):
    key_char = key[i % len(key)]
    decrypted_char = chr(byte ^ ord(key_char))
    decrypted_text += decrypted_char

print(f"Kunci: {key}")
print(f"Hasil Dekripsi: {decrypted_text}")

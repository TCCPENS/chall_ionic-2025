#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/bio.h>
#include <openssl/evp.h>
#include <openssl/buffer.h>

char *base64_encode(const unsigned char *input, int length) {
    BIO *bio, *b64;
    BUF_MEM *bufferPtr;

    b64 = BIO_new(BIO_f_base64());
    bio = BIO_new(BIO_s_mem());
    bio = BIO_push(b64, bio);

    BIO_set_flags(bio, BIO_FLAGS_BASE64_NO_NL);
    BIO_write(bio, input, length);
    BIO_flush(bio);

    BIO_get_mem_ptr(bio, &bufferPtr);
    char *buff = (char *)malloc(bufferPtr->length + 1);
    memcpy(buff, bufferPtr->data, bufferPtr->length);
    buff[bufferPtr->length] = 0;

    BIO_free_all(bio);

    return buff;
}

const unsigned char bendera_xatau[] = {
  0x44, 0x12, 0x1c, 0x2d, 0x1d, 0x53, 0x34, 0x17, 0x52, 0x0, 
  0x2d, 0x1d, 0xb, 0x58, 0x2f, 0xa, 0x47, 0xb, 0x48, 0x1e
};

void just_a_function() {
    
    const char* target_hash = "6c84cbd30cf9350a990bad2bcc1bec5f";
    char hint[] = "mungkin anda bisa memecahkan sesuatu dengan batu?";
    
}


void setup() {
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stdin, NULL, _IONBF, 0);
}

int main() {
    char buf[72];
    char addr_str[32];
    char *encoded_addr;

    setup();


    sprintf(addr_str, "%p", puts);

    encoded_addr = base64_encode((const unsigned char *)addr_str, strlen(addr_str));

    printf("hanya sebuah huruf acak: %s\n", encoded_addr);

    free(encoded_addr);

    printf("Masukkan Sesuatu:\n> ");

    gets(buf);

    printf("Sesuatu diterima.\n");
    
    return 0;
}

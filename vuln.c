#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>

#define BUFSIZE 64
#define CANARY_SIZE 4

char global_canary[CANARY_SIZE];

void grant_administrator_access() {
    char flag[64];
    FILE *f = fopen("flag.txt", "r");
    if (f == NULL) {
        printf("ERROR: File Kunci Mainframe Tidak Ditemukan.\n");
        exit(0);
    }
    fgets(flag, 64, f);
    puts(flag);
    fflush(stdout);
}

void read_canary_bypass_code() {
    FILE *f = fopen("canary.txt", "r");
    if (f == NULL) {
        printf("ERROR: Modul Keamanan Canary Fail.\n");
        exit(1);
    }
    fread(global_canary, 1, CANARY_SIZE, f);
    fclose(f);
}

void diagnostic_port() {
    char diagnostic_input[64];
    char canary_copy[CANARY_SIZE];
    memcpy(canary_copy, global_canary, CANARY_SIZE);

    printf("Masukkan data diagnostik: ");
    fflush(stdout);
    fgets(diagnostic_input, sizeof(diagnostic_input), stdin);
    diagnostic_input[strcspn(diagnostic_input, "\n")] = 0;

    printf("Output Diagnostik: ");
    printf(diagnostic_input);
    printf("\n");
    fflush(stdout);
}

void main_command_port() {
    struct {
        char buf[BUFSIZE];
        char canary_on_stack[CANARY_SIZE];
    } locals;
    
    memcpy(locals.canary_on_stack, global_canary, CANARY_SIZE);

    printf("Masukkan sesuatu (maks 200 byte):\n> ");
    fflush(stdout);
    read(0, locals.buf, 200);

    if (memcmp(locals.canary_on_stack, global_canary, CANARY_SIZE) != 0) {
        printf("\n!!! ALARM: TERDETEKSI HENGKER !!!\n");
        exit(1);
    }
    printf("\nInput diterima. Menjalankan perintah...\n");
    fflush(stdout);
}

int main(int argc, char **argv) {
    setvbuf(stdout, NULL, _IONBF, 0);
    gid_t gid = getegid();
    setresgid(gid, gid, gid);
    
    read_canary_bypass_code();

    int choice = 0;
    char choice_buf[16];

    while(1) {
        printf("\n--- Terminal Akses Pintu SAW 04.01 ---\n");
        printf("1. Input Perintah Utama\n");
        printf("2. Port Diagnostik\n");
        printf("3. Putuskan Koneksi\n");
        printf("> ");
        fflush(stdout);
        
        if (fgets(choice_buf, sizeof(choice_buf), stdin) == NULL) {
            break; 
        }
        choice = atoi(choice_buf);

        switch(choice) {
            case 1:
                main_command_port();
                break;
            case 2:
                diagnostic_port();
                break;
            case 3:
                exit(0);
            default:
                printf("Perintah tidak dikenali.\n");
                break;
        }
    }
    return 0;
}

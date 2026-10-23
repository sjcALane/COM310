#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/mman.h>

#define SIZE 4096

int main(void) {
    const char *name = "/OS";
    const char *message = "Hello World!";

    int shm = shm_open(name, O_CREAT | O_RDWR, 0666);   /* create the shared memory object */
    if (shm == -1) {
        perror("shm_open failed");
        return 1;
    }

    if (ftruncate(shm, SIZE) == -1) {                    /* give it a size */
        perror("ftruncate failed");
        return 1;
    }

    char *ptr = mmap(NULL, SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, shm, 0);
    if (ptr == MAP_FAILED) {                             /* map it into this process's memory */
        perror("mmap failed");
        return 1;
    }

    snprintf(ptr, SIZE, "%s", message);                  /* an ordinary memory write */
    printf("Producer: wrote \"%s\" to %s\n", message, name);
    return 0;
}

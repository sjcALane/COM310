#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/mman.h>

#define SIZE 4096

int main(void) {
    const char *name = "/OS";

    int shm = shm_open(name, O_RDONLY, 0666);            /* open the existing object */
    if (shm == -1) {
        perror("shm_open failed (run shm_producer first)");
        return 1;
    }

    char *ptr = mmap(NULL, SIZE, PROT_READ, MAP_SHARED, shm, 0);
    if (ptr == MAP_FAILED) {
        perror("mmap failed");
        return 1;
    }

    printf("Consumer: read \"%s\" from %s\n", ptr, name); /* an ordinary memory read */

    shm_unlink(name);                                    /* remove the shared memory object */
    return 0;
}

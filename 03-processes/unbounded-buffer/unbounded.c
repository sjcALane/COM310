#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdatomic.h>
#include <sys/mman.h>
#include <sys/wait.h>

#define ITEMS 4
#define MAX 100          /* real memory isn't infinite, so this is just big enough to never fill */

struct shared {
    int buffer[MAX];
    atomic_int in;       /* next free spot. atomic makes each process see the other's updates */
    atomic_int out;      /* next item to take */
};

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);    /* print right away, so fork doesn't copy unprinted text */

    struct shared *s = mmap(NULL, sizeof *s, PROT_READ | PROT_WRITE,
                            MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    if (s == MAP_FAILED) {
        perror("mmap failed");
        return 1;
    }
    s->in = 0;
    s->out = 0;

    pid_t forkreturn = fork();
    if (forkreturn < 0) {
        perror("fork failed");
        return 1;
    }

    if (forkreturn == 0) {                          /* child: the consumer */
        for (int i = 0; i < ITEMS; i++) {
            if (s->in == s->out) {
                printf("Consumer: buffer empty, waiting\n");
            }
            while (s->in == s->out) { }             /* busy wait until there's an item */
            int item = s->buffer[s->out];
            printf("Consumer: took item %d\n", item);
            s->out = s->out + 1;
            usleep(700000);                         /* the consumer is slow */
        }
        exit(0);
    }

    usleep(200000);                                 /* parent: the producer, starting a little late */
    for (int item = 1; item <= ITEMS; item++) {
        s->buffer[s->in] = item;                    /* never checks for full */
        printf("Producer: added item %d\n", item);
        s->in = s->in + 1;
        usleep(100000);
    }
    wait(NULL);
    munmap(s, sizeof *s);
    return 0;
}

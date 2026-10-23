#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdatomic.h>
#include <sys/mman.h>
#include <sys/wait.h>

#define BUFFER_SIZE 4    /* 4 slots, but it holds at most 3 items */
#define ITEMS 5

struct shared {
    int buffer[BUFFER_SIZE];
    atomic_int in;       /* next free slot. atomic makes each process see the other's updates */
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
        usleep(200000);                             /* starts a little late */
        for (int i = 0; i < ITEMS; i++) {
            if (s->in == s->out) {
                printf("Consumer: buffer empty, waiting\n");
            }
            while (s->in == s->out) { }             /* busy wait until there's an item */
            int item = s->buffer[s->out];
            printf("Consumer: took item %d\n", item);
            s->out = (s->out + 1) % BUFFER_SIZE;
            usleep(700000);                         /* the consumer is slow */
        }
        exit(0);
    }

    for (int item = 1; item <= ITEMS; item++) {     /* parent: the producer */
        if ((s->in + 1) % BUFFER_SIZE == s->out) {
            printf("Producer: buffer full, waiting\n");
        }
        while ((s->in + 1) % BUFFER_SIZE == s->out) { }   /* busy wait until there's room */
        s->buffer[s->in] = item;
        printf("Producer: added item %d\n", item);
        s->in = (s->in + 1) % BUFFER_SIZE;
    }
    wait(NULL);
    munmap(s, sizeof *s);
    return 0;
}

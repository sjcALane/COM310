#include <stdio.h>
#include <unistd.h>

int main(void) {
    char myid[16];
    snprintf(myid, sizeof(myid), "%d", getpid());

    printf("I am process %s and I'm about to run ps\n", myid);
    fflush(stdout);

    execlp("ps", "ps", "-o", "pid,comm", "-p", myid, NULL);

    printf("This line never prints\n");
    return 0;
}

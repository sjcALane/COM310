#include <stdio.h>
#include <unistd.h>

int main(void) {
    fork();
    fork();
    printf("hello from PID %d\n", getpid());
    return 0;
}

#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    fork();
    fork();
    printf("hello from process %d, my parent is %d\n", getpid(), getppid());

    while (wait(NULL) > 0) { }   /* wait for any children so getppid() stays correct */
    return 0;
}

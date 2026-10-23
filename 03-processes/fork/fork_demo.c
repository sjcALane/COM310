#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int x = 10;
    printf("Before fork: I am PID %d\n", getpid());

    fflush(stdout);
    pid_t forkreturn = fork();

    if (forkreturn < 0) {
        perror("fork failed");
        exit(1);
    } else if (forkreturn == 0) {
        x = x + 5;
        printf("Child:  PID %d, parent is %d, x = %d\n", getpid(), getppid(), x);
        exit(0);
    } else {
        wait(NULL);
        printf("Parent: PID %d, my child was %d, x = %d\n", getpid(), forkreturn, x);
    }
    return 0;
}

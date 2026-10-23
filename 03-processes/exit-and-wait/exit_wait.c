#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t forkreturn = fork();

    if (forkreturn < 0) {
        perror("fork failed");
        exit(1);
    } else if (forkreturn == 0) {
        printf("Child: exiting with code 7\n");
        exit(7);
    } else {
        int status;
        wait(&status);
        if (WIFEXITED(status)) {
            printf("Parent: got exit code %d\n", WEXITSTATUS(status));
        }
    }
    return 0;
}

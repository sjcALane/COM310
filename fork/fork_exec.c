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
        execlp("/bin/ls", "ls", NULL);
        perror("exec failed");
        exit(1);
    } else {
        wait(NULL);
        printf("Child complete\n");
    }
    return 0;
}

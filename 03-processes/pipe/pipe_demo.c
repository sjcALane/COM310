#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

#define BUFFER_SIZE 25

int main(void) {
    char write_msg[BUFFER_SIZE] = "Greetings";
    char read_msg[BUFFER_SIZE];
    int fd[2];                       /* fd[0] is the read end, fd[1] is the write end */

    if (pipe(fd) == -1) {
        perror("pipe failed");
        return 1;
    }

    pid_t forkreturn = fork();
    if (forkreturn < 0) {
        perror("fork failed");
        return 1;
    }

    if (forkreturn > 0) {            /* parent: writes */
        close(fd[0]);
        if (write(fd[1], write_msg, strlen(write_msg) + 1) == -1) {
            perror("write failed");
        }
        close(fd[1]);
        wait(NULL);
    } else {                         /* child: reads */
        close(fd[1]);
        ssize_t n = read(fd[0], read_msg, BUFFER_SIZE);
        if (n > 0) {
            printf("Child read: %s\n", read_msg);
        }
        close(fd[0]);
    }
    return 0;
}

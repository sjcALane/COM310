#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

#define MAX_LINE 256
#define MAX_ARGS 32

int main(void) {
    char line[MAX_LINE];
    char *args[MAX_ARGS];

    while (1) {
        printf("mysh> ");
        fflush(stdout);

        if (fgets(line, sizeof(line), stdin) == NULL) {
            break;                              /* Ctrl+D also ends the shell */
        }
        line[strcspn(line, "\n")] = '\0';       /* remove the newline */

        int n = 0;                              /* split the line into words */
        char *word = strtok(line, " ");
        while (word != NULL && n < MAX_ARGS - 1) {
            args[n++] = word;
            word = strtok(NULL, " ");
        }
        args[n] = NULL;

        if (n == 0) {
            continue;                           /* empty line, ask again */
        }
        if (strcmp(args[0], "exit") == 0) {
            break;
        }

        pid_t forkreturn = fork();
        if (forkreturn < 0) {
            perror("fork failed");
        } else if (forkreturn == 0) {
            execvp(args[0], args);
            perror("exec failed");              /* only runs if exec fails */
            exit(1);
        } else {
            wait(NULL);
        }
    }
    return 0;
}

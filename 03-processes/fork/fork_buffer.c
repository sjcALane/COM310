#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    printf("hello ");
    fork();
    printf("world\n");
    wait(NULL);
    return 0;
}

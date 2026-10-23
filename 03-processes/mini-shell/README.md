# A tiny shell

Open the [walkthrough](https://sjcalane.github.io/COM310/03-processes/mini-shell/) to trace a shell running one command.

| File | What it shows |
|---|---|
| `mini_shell.c` | A working shell. It reads a command, forks, runs the command in the child with exec(), and waits. Type exit to quit. |

Try it:

```
gcc -Wall -o mini_shell mini_shell.c
./mini_shell
mysh> ls -l
mysh> date
mysh> exit
```

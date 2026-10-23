# Tracing fork()

Open the [walkthrough](https://sjcalane.github.io/COM310/03-processes/fork/) to trace a parent and child process line by line.

| File | What it shows |
|---|---|
| `fork_demo.c` | The child changes x, and the parent's x stays the same. |

To watch the system calls happen:

```
strace -f -e trace=clone,wait4,write,exit_group ./fork_demo
```

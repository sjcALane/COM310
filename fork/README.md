# fork()

Open the [step-through walkthrough](https://sjcalane.github.io/COM310/fork/) to trace a parent and child process line by line.

| File | What it shows |
|---|---|
| `fork_demo.c` | The program from the walkthrough. The child changes x, and the parent's x stays the same. |
| `fork_exec.c` | The child replaces itself with `ls` using exec. |
| `fork_count.c` | Two forks in a row make four processes. |
| `fork_buffer.c` | Output still sitting in the print buffer gets copied into the child. |

To watch the system calls happen:

```
strace -f -e trace=clone,wait4,write,exit_group ./fork_demo
```

# The print buffer and fork()

Open the [walkthrough](https://sjcalane.github.io/COM310/03-processes/fork-buffer/) to see why text can print twice after a fork.

| File | What it shows |
|---|---|
| `fork_buffer.c` | "hello " is still in the print buffer when fork() copies it, so "hello world" prints twice. |

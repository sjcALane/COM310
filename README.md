# COM310 Operating Systems

Demos for COM310 Operating Systems. Each demo has a walkthrough you can open in a browser and C code you can compile and run on Linux.

## Chapter 3: Processes

### Creating processes

- **Tracing fork()**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/fork/) and [code](03-processes/fork/)
- **Two forks, four processes**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/fork-twice/) and [code](03-processes/fork-twice/)
- **The print buffer and fork()**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/fork-buffer/) and [code](03-processes/fork-buffer/)
- **exit() and wait()**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/exit-and-wait/) and [code](03-processes/exit-and-wait/)
- **exec() replaces the program**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/exec-replace/) and [code](03-processes/exec-replace/)
- **fork() then exec()**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/exec/) and [code](03-processes/exec/)
- **A tiny shell**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/mini-shell/) and [code](03-processes/mini-shell/)

### Interprocess communication

- **Shared memory**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/shared-memory/) and [code](03-processes/shared-memory/)
- **Producer and consumer with an unbounded buffer**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/unbounded-buffer/) and [code](03-processes/unbounded-buffer/)
- **Producer and consumer with a bounded buffer**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/bounded-buffer/) and [code](03-processes/bounded-buffer/)
- **Message passing with a pipe**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/pipe/) and [code](03-processes/pipe/)

## Running the C code

```
gcc -Wall -o fork_demo fork_demo.c
./fork_demo
```

If gcc isn't installed on Linux Mint, run `sudo apt install build-essential` first.

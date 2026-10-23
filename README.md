# COM310 Operating Systems

Demos for COM310 Operating Systems. Each demo has a walkthrough you can open in a browser and C code you can compile and run on Linux.

## Chapter 3: Processes

- **Tracing fork()**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/fork/) and [code](03-processes/fork/)
- **Two forks, four processes**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/fork-twice/) and [code](03-processes/fork-twice/)
- **The print buffer and fork()**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/fork-buffer/) and [code](03-processes/fork-buffer/)
- **exit() and wait()**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/exit-and-wait/) and [code](03-processes/exit-and-wait/)
- **exec() replaces the program**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/exec-replace/) and [code](03-processes/exec-replace/)
- **fork() then exec()**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/exec/) and [code](03-processes/exec/)
- **A tiny shell**: [walkthrough](https://sjcalane.github.io/COM310/03-processes/mini-shell/) and [code](03-processes/mini-shell/)

## Running the C code

```
gcc -Wall -o fork_demo fork_demo.c
./fork_demo
```

If gcc isn't installed on Linux Mint, run `sudo apt install build-essential` first.

# Producer and consumer with an unbounded buffer

Open the [walkthrough](https://sjcalane.github.io/COM310/03-processes/unbounded-buffer/) to see a producer that never has to wait.

| File | What it shows |
|---|---|
| `unbounded.c` | A fast producer and a slow consumer share a buffer through shared memory. Items pile up, and only the consumer ever waits. |

Real memory is finite, so the buffer here is just an array big enough that it never fills during the demo.

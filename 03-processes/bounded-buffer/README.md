# Producer and consumer with a bounded buffer

Open the [walkthrough](https://sjcalane.github.io/COM310/03-processes/bounded-buffer/) to see the producer wait when the buffer is full.

| File | What it shows |
|---|---|
| `bounded.c` | The same producer and consumer with a 4-slot buffer. The buffer holds at most 3 items, so the producer has to wait for the consumer. |

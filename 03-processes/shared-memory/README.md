# Shared memory

Open the [walkthrough](https://sjcalane.github.io/COM310/03-processes/shared-memory/) to follow a message from one program to another through POSIX shared memory.

| File | What it shows |
|---|---|
| `shm_producer.c` | Creates a shared memory object named /OS and writes "Hello World!" into it. |
| `shm_consumer.c` | Opens /OS, reads the message, and removes /OS. |

Run them as two separate programs:

```
gcc -Wall -o shm_producer shm_producer.c
gcc -Wall -o shm_consumer shm_consumer.c
./shm_producer
ls /dev/shm
./shm_consumer
```

On Linux, `ls /dev/shm` shows the shared memory object while it exists. If gcc says it can't find shm_open, add `-lrt` to the end of the gcc command.

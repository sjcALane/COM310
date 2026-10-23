# COM310 demo repo

Interactive walkthroughs and C examples for COM310 Operating Systems (Silberschatz, Galvin & Gagne, Operating System Concepts, 10th ed.). GitHub Pages serves the repo from `main` at https://sjcalane.github.io/COM310/. Students use the site, so everything published has to read like the instructor wrote it.

## Layout

```
README.md                     site home page, one section per chapter that has demos
_config.yml                   keeps CLAUDE.md off the site
assets/demo.css               shared look for every demo page
assets/stepper.js             shared step-through engine
_template/                    starting point for a new demo (not published)
NN-chapter-slug/README.md     chapter page, one line per demo
NN-chapter-slug/demo-name/    one demo: index.html, README.md, C files
```

Chapter folders use the textbook chapter number, two digits, so they sort in order. Create a chapter folder only when it gets its first demo.

01-introduction, 02-os-structures, 03-processes, 04-threads, 05-cpu-scheduling, 06-synchronization-tools, 07-synchronization-examples, 08-deadlocks, 09-main-memory, 10-virtual-memory, 11-mass-storage, 12-io-systems, 13-file-system-interface, 14-file-system-implementation, 15-file-system-internals, 16-security, 17-protection, 18-virtual-machines, 19-networks-distributed, 20-linux, 21-windows

Demo folders are lowercase with hyphens (`fork`, `round-robin`). C files use underscores (`fork_demo.c`).

## Adding a demo

1. Copy `_template/` to `NN-chapter-slug/demo-name/`. Fill in the `Stepper({...})` config, the title, the breadcrumb, and the file links.
2. Write the C files. Compile each with `gcc -Wall` and run it on Linux before committing. Every file must compile with no warnings.
3. Fill in the demo's README table.
4. Add one line to the chapter README. Create the chapter README if it's new.
5. Add the demo to the home README under its chapter heading, keeping chapters in number order.
6. Push, wait for the Pages build, and check that the walkthrough URL returns 200.

## Style

- Plain black and white. Use the shared CSS and JS, and don't add per-page styling.
- Plain language, short sentences. No author name, department, or school on pages.
- Use variable names that say what they hold. Use `forkreturn`, never `pid`, for the value fork() returns.
- Changing `assets/` affects every demo, so open every demo page after a change to it.

# COM310 demo repo

Interactive walkthroughs, animations, and C examples for COM310 Operating Systems (Silberschatz, Galvin & Gagne, Operating System Concepts, 10th ed.). GitHub Pages serves the repo from `main` at https://sjcalane.github.io/COM310/. Students use the site, so everything published has to read like the instructor wrote it.

## Layout

```
README.md                     site home page, one section per chapter that has demos
_config.yml                   keeps CLAUDE.md off the site
assets/demo.css               shared look for every demo page
assets/demo.js                Stepper (click-through), Player (animation clips), keyboard handling
assets/buffer-sim.js          producer-consumer simulator, loaded only by the buffer pages
_template/                    starting point for a new demo page, with every block type (not published)
_anim/                        Manim sources for the animations (not published)
  osviz.py                    shared animation style: white background, black lines, IBM Plex
  render.sh                   renders one scene into numbered clips inside a demo folder
NN-chapter-slug/README.md     chapter page, one line per demo
NN-chapter-slug/demo-name/    one demo: index.html, README.md, C files, and clips/ if it has an animation
```

Chapter folders use the textbook chapter number, two digits, so they sort in order. Create a chapter folder only when it gets its first demo.

01-introduction, 02-os-structures, 03-processes, 04-threads, 05-cpu-scheduling, 06-synchronization-tools, 07-synchronization-examples, 08-deadlocks, 09-main-memory, 10-virtual-memory, 11-mass-storage, 12-io-systems, 13-file-system-interface, 14-file-system-implementation, 15-file-system-internals, 16-security, 17-protection, 18-virtual-machines, 19-networks-distributed, 20-linux, 21-windows

Demo folders are lowercase with hyphens (`fork`, `round-robin`). C files use underscores (`fork_demo.c`).

## Choosing how to show an idea

Not every demo gets the same treatment. Pick the blocks that fit the idea, usually one or two per page, in this order on the page: Watch, Try it, Timeline, then Trace or Program.

| Block | Use it when | Examples |
|---|---|---|
| Watch (Manim animation) | The idea is something moving or changing shape: copying, replacing, mapping, flowing, branching | fork copying a process, exec swapping memory, the fork tree doubling, shared memory mappings, data through a pipe |
| Try it (interactive simulation) | Students learn by changing a setting and seeing what happens | producer and consumer speeds and buffer size; later, scheduling algorithms and quantum size, page replacement with different frame counts |
| Timeline (static SVG) | The point is when things happen relative to each other | zombie window in exit/wait, a shell spawning children over time |
| Trace (click-through) | The point is which line runs and what each variable holds at each step | most C programs |
| Program (static code and output) | The page has an animation and no trace, but students still need the code | fork-twice, exec-replace |

A trace earns its place only if stepping line by line teaches something. If the code is three lines, show it as a Program block instead.

## Adding a demo

1. Copy `_template/index.html` to `NN-chapter-slug/demo-name/`. Keep the blocks you need and delete the rest. Fill in the title, breadcrumb, file links, and the `Player({...})` and `Stepper({...})` configs.
2. Write the C files. Compile each with `gcc -Wall -Wextra` and run it on Linux before committing. Every file must compile with no warnings.
3. For an animation, write `_anim/<name>.py` using `osviz.py`. Start every clip with `self.next_section("name")` and end it with `hold(self)`. Render with `_anim/render.sh <name>.py <SceneName> NN-chapter-slug/demo-name`, which writes `clips/01.mp4` and `clips/01.webm` and so on. Manim needs `pip install manim` (in a virtual environment) and the IBM Plex fonts. Look at the last frame of every clip before publishing, since overlaps and off-screen text only show up there.
4. Fill in the demo's README table.
5. Add one line to the chapter README, in teaching order, under the right topic heading (for example "Creating processes" or "Interprocess communication"). Create the chapter README if it's new.
6. Add the same line to the home README under its chapter and topic headings, keeping chapters in number order. The chapter README uses `##` for topics, and the home README uses `###`.
7. Push, wait for the Pages build, and check that the page and its clips return 200.

## Style

- Plain black and white, in the pages and in the animations. Use the shared CSS and JS, and don't add per-page styling.
- Plain language, short sentences. No author name, department, or school on pages.
- Animation captions live on the page, not inside the video, so the video stays clean and the captions stay editable.
- Use variable names that say what they hold. Use `forkreturn`, never `pid`, for the value fork() returns.
- Keep pseudocode lines under about 44 characters, or the code box cuts them off on a projector.
- Output shown on a page must match what the real C program prints. When two processes print, make the order repeatable (sleeps, printing before publishing a change) and run the program several times, including pinned to one CPU with `taskset -c 0`, before trusting it.
- Changing `assets/` affects every demo, so open every demo page after a change to it.

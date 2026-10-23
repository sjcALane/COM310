from osviz import *


class ExecReplaceScene(Scene):
    def construct(self):
        self.next_section("before")
        proc = process("Process 1000", ["code: exec_replace", "variables", "heap", "stack"], width=4.6)
        proc.move_to(LEFT * 2.2)
        self.play(FadeIn(proc, shift=UP * 0.2), run_time=1.2)
        hold(self)

        self.next_section("wipe")
        rows = proc[2]
        self.play(LaggedStart(*[FadeOut(r, shift=DOWN * 0.3) for r in rows], lag_ratio=0.2), run_time=1.4)
        self.play(Circumscribe(proc[1], color=INK, buff=0.1), run_time=1)
        hold(self)

        self.next_section("load-ps")
        disk = process("ps on disk", ["code: ps", "variables", "heap", "stack"], width=3.6, size=20, title_size=24)
        disk.move_to(RIGHT * 4.3)
        disk[0].set_stroke(MID)
        self.play(FadeIn(disk), run_time=0.8)
        new_rows = memory(["code: ps", "variables", "heap", "stack"], width=4.2, size=24)
        new_rows.move_to(rows)
        self.play(LaggedStart(*[TransformFromCopy(disk[2][i], new_rows[i]) for i in range(4)], lag_ratio=0.2), run_time=1.8)
        hold(self)

        self.next_section("no-way-back")
        gone = code('print "This line never prints"', size=22, color=MID).next_to(proc, DOWN, buff=0.5)
        strike = Line(gone.get_left(), gone.get_right(), color=INK, stroke_width=3)
        self.play(FadeIn(gone), run_time=0.6)
        self.play(Create(strike), run_time=0.6)
        hold(self, 1)

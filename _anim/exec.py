from osviz import *


class ExecScene(Scene):
    def construct(self):
        self.next_section("parent")
        parent = process("Process 1000", ["code: fork_exec", "variables", "stack"], width=4.2)
        parent.move_to(UP * 0.9)
        self.play(FadeIn(parent, shift=UP * 0.2), run_time=1.1)
        hold(self)

        self.next_section("fork")
        self.play(parent.animate.move_to(LEFT * 3.4 + UP * 0.9), run_time=0.9)
        child = parent.copy()
        self.play(child.animate.move_to(RIGHT * 3.4 + UP * 0.9), run_time=1.3)
        self.play(Transform(child[1], txt("Process 1001", size=28, weight=BOLD).move_to(child[1])), run_time=0.8)
        hold(self)

        self.next_section("exec")
        wait_lab = txt("waiting in wait()", size=24, color=MID).next_to(parent, DOWN, buff=0.3)
        self.play(*dim(parent), FadeIn(wait_lab), run_time=0.8)
        exec_lab = code('exec("ls")', size=26).next_to(child, UP, buff=0.25)
        self.play(FadeIn(exec_lab), run_time=0.5)
        for i, name in enumerate(["code: ls", "variables", "stack"]):
            cell = child[2][i]
            self.play(cell[0].animate.set_fill(SOFT, opacity=1),
                      Transform(cell[1], code(name, size=24).move_to(cell[1])), run_time=0.45)
        hold(self)

        self.next_section("ls-runs")
        term = box(9.5, 1.3).move_to(DOWN * 2.6)
        term_lab = txt("screen", size=20, color=MID).next_to(term, UP, buff=0.08).align_to(term, LEFT)
        out1 = code("fork_exec  fork_exec.c", size=24).move_to(term).align_to(term, LEFT).shift(RIGHT * 0.4 + UP * 0.22)
        self.play(FadeIn(term), FadeIn(term_lab), run_time=0.5)
        self.play(TransformFromCopy(child[2][0][1], out1), run_time=1)
        done = txt("exited", size=24, color=MID).next_to(child, DOWN, buff=0.3)
        self.play(*dim(child), FadeOut(exec_lab), FadeIn(done), run_time=0.9)
        hold(self)

        self.next_section("parent-wakes")
        self.play(FadeOut(child), FadeOut(done), FadeOut(wait_lab), *dim(parent, INK), run_time=0.9)
        out2 = code("Child complete", size=24).next_to(out1, DOWN, buff=0.12).align_to(out1, LEFT)
        self.play(Write(out2), run_time=0.8)
        hold(self, 1)

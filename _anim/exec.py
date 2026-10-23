from osviz import *

# Trace steps: 1 parent | 2 fork | 4 exec | 6 child exits | 7 parent wakes


class ExecScene(Scene):
    def construct(self):
        self.next_section("step1-parent")
        parent = process("Process 1000", ["code: fork_exec", "variables", "stack"], width=4.2)
        parent.move_to(UP * 0.6)
        self.play(FadeIn(parent, shift=UP * 0.2), run_time=1.1)
        hold(self)

        self.next_section("step2-fork")
        self.play(parent.animate.move_to(LEFT * 3.4 + UP * 0.6), run_time=0.8)
        child = parent.copy()
        self.play(child.animate.move_to(RIGHT * 3.4 + UP * 0.6), run_time=1.2)
        self.play(Transform(child[1], txt("Process 1001", size=28, weight=BOLD).move_to(child[1])), run_time=0.6)
        fr_p = code("forkreturn = 1001").next_to(parent, DOWN, buff=0.4)
        fr_c = code("forkreturn = 0").next_to(child, DOWN, buff=0.4)
        self.play(Write(fr_p), Write(fr_c), run_time=0.9)
        hold(self)

        self.next_section("step4-exec")
        wait_lab = txt("waiting in wait()", size=24, color=MID).next_to(fr_p, DOWN, buff=0.25)
        self.play(*dim(parent), FadeIn(wait_lab), run_time=0.8)
        exec_lab = code('exec("ls")', size=26).next_to(child, UP, buff=0.25)
        self.play(FadeIn(exec_lab), run_time=0.5)
        for i, name in enumerate(["code: ls", "variables", "stack"]):
            cell = child[2][i]
            self.play(cell[0].animate.set_fill(SOFT, opacity=1),
                      Transform(cell[1], code(name, size=24).move_to(cell[1])), run_time=0.45)
        hold(self)

        self.next_section("step6-child-exits")
        exited = txt("exited", size=24, color=MID).next_to(fr_c, DOWN, buff=0.25)
        waking = txt("waking up", size=24, color=MID).move_to(wait_lab)
        self.play(*dim(child), FadeOut(exec_lab), FadeIn(exited), Transform(wait_lab, waking), run_time=1)
        hold(self)

        self.next_section("step7-parent-wakes")
        self.play(FadeOut(child), FadeOut(fr_c), FadeOut(exited), FadeOut(wait_lab), *dim(parent, INK), run_time=1)
        hold(self, 1)

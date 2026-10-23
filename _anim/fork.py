from osviz import *

# One section per trace step that changes the picture.
# Trace steps: 1 one process | 3 fork | 5 child sets x | 7 child exits | 8 parent prints


class ForkScene(Scene):
    def construct(self):
        self.next_section("step1-one-process")
        parent = process("Process 1000", ["code", "x = 10", "stack"])
        self.play(FadeIn(parent, shift=UP * 0.2), run_time=1.2)
        hold(self)

        self.next_section("step3-fork")
        self.play(parent.animate.move_to(LEFT * 3.3 + UP * 0.4), run_time=0.9)
        child = parent.copy()
        label = code("fork()", size=30).move_to(UP * 2.9)
        arrow = Arrow(LEFT * 1.3 + UP * 2.4, RIGHT * 1.3 + UP * 2.4, color=INK, stroke_width=4, buff=0)
        self.play(FadeIn(label), GrowArrow(arrow), child.animate.move_to(RIGHT * 3.3 + UP * 0.4), run_time=1.4)
        self.play(Transform(child[1], txt("Process 1001", size=28, weight=BOLD).move_to(child[1])), run_time=0.6)
        fr_p = code("forkreturn = 1001").next_to(parent, DOWN, buff=0.4)
        fr_c = code("forkreturn = 0").next_to(child, DOWN, buff=0.4)
        self.play(Write(fr_p), Write(fr_c), run_time=1)
        hold(self)

        self.next_section("step5-child-sets-x")
        wait_lab = txt("waiting in wait()", size=24, color=MID).next_to(fr_p, DOWN, buff=0.25)
        self.play(*dim(parent), FadeIn(wait_lab), run_time=0.8)
        cell = child[2][1]
        self.play(cell[0].animate.set_fill(SOFT, opacity=1),
                  Transform(cell[1], code("x = 15", size=24).move_to(cell[1])), run_time=1)
        hold(self)

        self.next_section("step7-child-exits")
        exited = txt("exited", size=24, color=MID).next_to(fr_c, DOWN, buff=0.25)
        waking = txt("waking up", size=24, color=MID).move_to(wait_lab)
        self.play(*dim(child), FadeIn(exited), Transform(wait_lab, waking), run_time=1)
        hold(self)

        self.next_section("step8-parent-prints")
        self.play(FadeOut(child), FadeOut(fr_c), FadeOut(exited), FadeOut(wait_lab), FadeOut(arrow), FadeOut(label),
                  *dim(parent, INK), run_time=1)
        self.play(Circumscribe(parent[2][1], color=INK, buff=0.08), run_time=1.2)
        hold(self, 1)

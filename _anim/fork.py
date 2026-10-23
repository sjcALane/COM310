from osviz import *


class ForkScene(Scene):
    def construct(self):
        self.next_section("one-process")
        parent = process("Process 1000", ["code", "x = 10", "stack"])
        self.play(FadeIn(parent, shift=UP * 0.2), run_time=1.2)
        hold(self)

        self.next_section("copy")
        self.play(parent.animate.move_to(LEFT * 3.3), run_time=1)
        child = parent.copy()
        label = code("fork()", size=30).move_to(UP * 2.6)
        arrow = Arrow(LEFT * 1.3 + UP * 2.1, RIGHT * 1.3 + UP * 2.1, color=INK, stroke_width=4, buff=0)
        self.play(FadeIn(label), GrowArrow(arrow), child.animate.move_to(RIGHT * 3.3), run_time=1.6)
        new_title = txt("Process 1001", size=28, weight=BOLD).move_to(child[1])
        self.play(Transform(child[1], new_title), run_time=0.8)
        hold(self)

        self.next_section("return-values")
        fr_p = code("forkreturn = 1001").next_to(parent, DOWN, buff=0.45)
        fr_c = code("forkreturn = 0").next_to(child, DOWN, buff=0.45)
        self.play(Write(fr_p), Write(fr_c), run_time=1.2)
        hold(self)

        self.next_section("separate-memory")
        cell = child[2][1]
        self.play(cell[0].animate.set_fill(SOFT, opacity=1),
                  Transform(cell[1], code("x = 15", size=24).move_to(cell[1])), run_time=1)
        self.play(Circumscribe(parent[2][1], color=INK, buff=0.08), run_time=1.2)
        hold(self, 1)

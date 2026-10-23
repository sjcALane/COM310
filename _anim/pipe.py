from osviz import *


def fd_table(title, x):
    head = txt(title, size=28, weight=BOLD)
    rows = memory(["fd[0]  read", "fd[1]  write"], width=3.2, row_h=0.65, size=22)
    head.move_to([x, 2.9, 0])
    rows.next_to(head, DOWN, buff=0.3)
    frame = box(3.8, head.height + rows.height + 0.8).move_to(VGroup(head, rows))
    return VGroup(frame, head, rows)


class PipeScene(Scene):
    def construct(self):
        kernel = DashedVMobject(Rectangle(width=13, height=2.6, color=MID, stroke_width=2), num_dashes=60).move_to(DOWN * 2.3)
        klab = txt("kernel", size=22, color=MID).next_to(kernel, UP, buff=0.05).align_to(kernel, LEFT).shift(RIGHT * 0.15)
        tube = Rectangle(width=4.0, height=0.9, color=INK, stroke_width=4).move_to(DOWN * 2.1)
        wend = txt("write end", size=20).next_to(tube.get_corner(DL), DOWN, buff=0.15)
        rend = txt("read end", size=20).next_to(tube.get_corner(DR), DOWN, buff=0.15)
        flow = Arrow(LEFT * 0.9 + DOWN * 2.95, RIGHT * 0.9 + DOWN * 2.95, color=MID, stroke_width=2, buff=0, tip_length=0.18)

        def wire(row, end_point, side, color=INK):
            start = row[0].get_right() if side == "right" else row[0].get_left()
            return Line(start, end_point, color=color, stroke_width=4)

        W, R = tube.get_left(), tube.get_right()

        self.next_section("pipe")
        parent = fd_table("Parent", -4.3)
        self.play(FadeIn(parent), FadeIn(kernel), FadeIn(klab), run_time=0.8)
        self.play(Create(tube), FadeIn(wend), FadeIn(rend), GrowArrow(flow), run_time=1)
        p_read = wire(parent[2][0], R, "right")
        p_write = wire(parent[2][1], W, "right")
        self.play(Create(p_read), Create(p_write), run_time=1)
        hold(self)

        self.next_section("fork")
        child = fd_table("Child", 4.3)
        self.play(TransformFromCopy(parent, child), run_time=1.2)
        c_read = wire(child[2][0], R, "left")
        c_write = wire(child[2][1], W, "left")
        self.play(Create(c_read), Create(c_write), run_time=1)
        hold(self)

        self.next_section("close-unused")
        def closed(row):
            return AnimationGroup(row[1].animate.set_color(MID), row[0].animate.set_stroke(MID))
        self.play(FadeOut(p_read), FadeOut(c_write), closed(parent[2][0]), closed(child[2][1]), run_time=1.2)
        hold(self)

        self.next_section("write")
        msg = code('"Greetings"', size=24).next_to(parent[2][1], DOWN, buff=0.2)
        self.play(FadeIn(msg), run_time=0.4)
        self.play(msg.animate.move_to(tube.get_center() + LEFT * 0.6), run_time=1.4)
        hold(self)

        self.next_section("read")
        self.play(msg.animate.move_to(tube.get_center() + RIGHT * 0.6), run_time=0.8)
        got = code('message = "Greetings"', size=20).next_to(child, DOWN, buff=0.3)
        got.shift(RIGHT * (2.9 - got.get_left()[0]))
        self.play(Transform(msg, got), run_time=1.2)
        hold(self)

        self.next_section("end-of-file")
        self.play(FadeOut(p_write), closed(parent[2][1]), run_time=0.9)
        eof = txt("no write ends left", size=22).move_to(DOWN * 3.1)
        self.play(FadeOut(flow), FadeIn(eof), run_time=0.6)
        ret = VGroup(code("read() returns 0,", size=20), code("end of file", size=20)).arrange(DOWN, aligned_edge=LEFT, buff=0.1)
        ret.next_to(got, DOWN, buff=0.15).align_to(got, LEFT)
        self.play(Write(ret), run_time=0.9)
        hold(self, 1)

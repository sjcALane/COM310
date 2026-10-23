from osviz import *

# One section per trace step (8).


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
        W, R = tube.get_left(), tube.get_right()

        def wire(row, end_point, side):
            start = row[0].get_right() if side == "right" else row[0].get_left()
            return Line(start, end_point, color=INK, stroke_width=4)

        def closed(row, name):
            # outline first, label second, so the label is drawn on top of the white box
            return AnimationGroup(row[0].animate.set_stroke(MID),
                                  Transform(row[1], code(name + "  closed", size=22, color=MID).move_to(row[1])))

        def status(s, anchor):
            t = txt(s, size=22, color=MID).next_to(anchor, DOWN, buff=0.3)
            return t.shift(RIGHT * (2.9 - t.get_left()[0])) if anchor is child_ref[0] else t

        child_ref = [None]

        self.next_section("step1-pipe")
        parent = fd_table("Parent", -4.3)
        self.play(FadeIn(parent), FadeIn(kernel), FadeIn(klab), run_time=0.8)
        self.play(Create(tube), FadeIn(wend), FadeIn(rend), GrowArrow(flow), run_time=1)
        p_read, p_write = wire(parent[2][0], R, "right"), wire(parent[2][1], W, "right")
        self.play(Create(p_read), Create(p_write), run_time=1)
        hold(self)

        self.next_section("step2-fork")
        child = fd_table("Child", 4.3)
        child_ref[0] = child
        self.play(TransformFromCopy(parent, child), run_time=1.2)
        c_read, c_write = wire(child[2][0], R, "left"), wire(child[2][1], W, "left")
        self.play(Create(c_read), Create(c_write), run_time=1)
        hold(self)

        self.next_section("step3-close-unused")
        self.play(FadeOut(p_read), FadeOut(c_write), closed(parent[2][0], "fd[0]"), closed(child[2][1], "fd[1]"), run_time=1.2)
        hold(self)

        self.next_section("step4-child-waits")
        c_stat = status("waiting in read()", child)
        self.play(FadeIn(c_stat), Indicate(tube, color=INK, scale_factor=1.04), run_time=1)
        hold(self)

        self.next_section("step5-write")
        msg = code('"Greetings"', size=24).next_to(parent[2][1], DOWN, buff=0.2)
        self.play(FadeIn(msg), run_time=0.4)
        self.play(msg.animate.move_to(tube.get_center() + LEFT * 0.6), run_time=1.3)
        self.play(Transform(c_stat, status("waking up", child)), run_time=0.5)
        hold(self)

        self.next_section("step6-read")
        self.play(msg.animate.move_to(tube.get_center() + RIGHT * 0.6), run_time=0.7)
        got = code('message = "Greetings"', size=20).next_to(child, DOWN, buff=0.3)
        got.shift(RIGHT * (2.9 - got.get_left()[0]))
        self.play(FadeOut(c_stat), Transform(msg, got), run_time=1.1)
        hold(self)

        self.next_section("step7-close-write-end")
        self.play(FadeOut(p_write), closed(parent[2][1], "fd[1]"), run_time=0.9)
        eof = txt("no write ends left", size=22).move_to(DOWN * 3.1)
        self.play(FadeOut(flow), FadeIn(eof), run_time=0.6)
        ret = VGroup(code("next read() returns 0,", size=20), code("end of file", size=20)).arrange(DOWN, aligned_edge=LEFT, buff=0.1)
        ret.next_to(got, DOWN, buff=0.15).align_to(got, LEFT)
        self.play(Write(ret), run_time=0.9)
        hold(self)

        self.next_section("step8-child-exits")
        p_stat = txt("wait() returns", size=22, color=MID).next_to(parent, DOWN, buff=0.3)
        self.play(FadeOut(c_read), closed(child[2][0], "fd[0]"), run_time=0.8)
        self.play(*dim(child), FadeIn(p_stat), run_time=0.8)
        hold(self, 1)

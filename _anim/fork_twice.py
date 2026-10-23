from osviz import *

X0, T1, T2, T3, XEND = -6.0, -3.6, -0.6, 2.4, 5.4
ORDER = [1000, 1004, 1002, 1006, 1001, 1005, 1003, 1007]


def Y(pid):
    return 2.45 - ORDER.index(pid) * 0.72


def lane(pid, x_from, x_to, dashed=False):
    p0, p1 = np.array([x_from, Y(pid), 0]), np.array([x_to, Y(pid), 0])
    return DashedLine(p0, p1, color=MID, stroke_width=4, dash_length=0.12) if dashed else Line(p0, p1, color=INK, stroke_width=5)


def branch(parent, child, t, dashed=False):
    a = np.array([t, Y(parent), 0])
    b = np.array([t + 0.6, Y(child), 0])
    curve = CubicBezier(a, a + RIGHT * 0.35, b + LEFT * 0.35, b, color=MID if dashed else INK, stroke_width=4 if dashed else 5)
    return DashedVMobject(curve, num_dashes=8) if dashed else curve


def tag(pid, x, dashed=False):
    return code(str(pid), size=22, color=MID if dashed else INK).move_to([x + 0.45, Y(pid) + 0.24, 0])


def marker(t, name, dashed=False):
    line = DashedLine([t, 2.85, 0], [t, -2.85, 0], color=MID, stroke_width=2, dash_length=0.1)
    lab = code(name, size=22, color=MID if dashed else INK).move_to([t, -3.25, 0])
    return VGroup(line, lab)


def count(s, a, b, dashed=False):
    return txt(s, size=26, color=MID if dashed else INK).move_to([(a + b) / 2, 3.4, 0])


class ForkTwiceScene(Scene):
    def construct(self):
        axis = Arrow([X0, -3.8, 0], [XEND, -3.8, 0], color=MID, stroke_width=2, buff=0, tip_length=0.2)
        axis_lab = txt("time", size=22, color=MID).next_to(axis, RIGHT, buff=0.1)

        self.next_section("one")
        l1000 = lane(1000, X0, T1)
        c1 = count("1 process", X0, T1)
        self.play(FadeIn(axis), FadeIn(axis_lab), Create(l1000), FadeIn(tag(1000, X0)), FadeIn(c1), run_time=1.4)
        hold(self)

        self.next_section("fork-1")
        m1 = marker(T1, "fork()")
        b = branch(1000, 1001, T1)
        c2 = count("2 processes", T1, T2)
        self.play(FadeIn(m1), run_time=0.5)
        self.play(Create(b), FadeIn(tag(1001, T1 + 0.6)), run_time=0.9)
        self.play(Create(lane(1000, T1, T2)), Create(lane(1001, T1 + 0.6, T2)), FadeIn(c2), run_time=1)
        hold(self)

        self.next_section("fork-2")
        m2 = marker(T2, "fork()")
        c4 = count("4 processes", T2, XEND)
        self.play(FadeIn(m2), run_time=0.5)
        self.play(Create(branch(1000, 1002, T2)), Create(branch(1001, 1003, T2)),
                  FadeIn(tag(1002, T2 + 0.6)), FadeIn(tag(1003, T2 + 0.6)), run_time=0.9)
        self.play(*[Create(lane(p, T2 if p in (1000, 1001) else T2 + 0.6, XEND)) for p in (1000, 1001, 1002, 1003)],
                  FadeIn(c4), run_time=1.2)
        dots = VGroup(*[Dot([XEND, Y(p), 0], color=INK, radius=0.09) for p in (1000, 1001, 1002, 1003)])
        hellos = VGroup(*[code("hello", size=20).next_to(d, RIGHT, buff=0.12) for d in dots])
        self.play(FadeIn(dots), FadeIn(hellos), run_time=0.8)
        hold(self)

        self.next_section("fork-3")
        m3 = marker(T3, "a 3rd fork()?", dashed=True)
        c4b = count("4 processes", T2, T3)
        c8 = count("8 processes", T3, XEND, dashed=True)
        self.play(FadeIn(m3), Transform(c4, c4b), run_time=0.8)
        pairs = [(1000, 1004), (1001, 1005), (1002, 1006), (1003, 1007)]
        self.play(*[Create(branch(a, b, T3, dashed=True)) for a, b in pairs],
                  *[FadeIn(tag(b, T3 + 0.6, dashed=True)) for a, b in pairs], run_time=1)
        self.play(*[Create(lane(b, T3 + 0.6, XEND, dashed=True)) for a, b in pairs], FadeIn(c8), run_time=1)
        hold(self, 1)

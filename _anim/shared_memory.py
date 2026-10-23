from osviz import *

PX, MX, CX = -4.7, 0.0, 4.7
SLOT_H, FRAME_H = 0.8, 0.56


def space(title, x, rows):
    head = txt(title, size=26, weight=BOLD).move_to([x, 3.0, 0])
    cells = memory(rows, width=3.0, row_h=SLOT_H, size=22)
    cells.move_to([x, 0.2, 0])
    return VGroup(head, cells)


class SharedMemoryScene(Scene):
    def construct(self):
        self.next_section("apart")
        prod = space("Producer", PX, ["code", "variables", "(unused)", "stack"])
        cons = space("Consumer", CX, ["code", "variables", "(unused)", "stack"])
        phys_head = txt("Physical memory", size=26, weight=BOLD).move_to([MX, 3.0, 0])
        frames = memory(["", "", "", "", "", "", ""], width=2.6, row_h=FRAME_H, size=20)
        frames.move_to([MX, 0.2, 0])
        for f in frames:
            f[0].set_fill(WHITE, opacity=1)
        pmap = {0: 0, 1: 1, 3: 2}
        cmap = {0: 4, 1: 5, 3: 6}

        def link(slot, frame, side, strong=False):
            a = slot[0].get_right() if side == "p" else slot[0].get_left()
            b = frame[0].get_left() if side == "p" else frame[0].get_right()
            return Line(a, b, color=INK if strong else MID, stroke_width=5 if strong else 2)

        plinks = VGroup(*[link(prod[1][s], frames[f], "p") for s, f in pmap.items()])
        clinks = VGroup(*[link(cons[1][s], frames[f], "c") for s, f in cmap.items()])
        for i in list(pmap.values()) + list(cmap.values()):
            frames[i][0].set_fill(SOFT, opacity=1)
        self.play(FadeIn(prod), FadeIn(cons), FadeIn(phys_head), FadeIn(frames), run_time=1)
        self.play(Create(plinks), Create(clinks), run_time=1.2)
        hold(self)

        self.next_section("create-and-map")
        osf = frames[3]
        oslab = code("/OS", size=22).move_to(osf[0])
        self.play(osf[0].animate.set_stroke(width=5), FadeIn(oslab), run_time=0.7)
        pslot = prod[1][2]
        self.play(Transform(pslot[1], code("/OS (ptr)", size=22).move_to(pslot[1])), run_time=0.6)
        plink_os = link(pslot, osf, "p", strong=True)
        self.play(Create(plink_os), run_time=0.8)
        hold(self)

        self.next_section("write")
        msg = code("Hello World!", size=20).move_to(pslot[0]).shift(DOWN * 0.85)
        self.play(FadeIn(msg), run_time=0.5)
        target = code("/OS: Hello World!", size=17).move_to(osf[0])
        self.play(FadeOut(oslab), Transform(msg, target), run_time=1.2)
        hold(self)

        self.next_section("consumer-maps")
        cslot = cons[1][2]
        self.play(Transform(cslot[1], code("/OS (ptr)", size=22).move_to(cslot[1])), run_time=0.6)
        clink_os = link(cslot, osf, "c", strong=True)
        self.play(Create(clink_os), run_time=0.8)
        hold(self)

        self.next_section("read")
        read = code('reads "Hello World!"', size=20).next_to(cons[1], DOWN, buff=0.35)
        self.play(Circumscribe(osf, color=INK, buff=0.06), run_time=0.9)
        self.play(TransformFromCopy(msg, read), run_time=1)
        hold(self)

        self.next_section("unlink")
        self.play(FadeOut(plink_os), FadeOut(clink_os), FadeOut(msg),
                  osf[0].animate.set_stroke(width=2).set_fill(WHITE, opacity=1),
                  Transform(pslot[1], code("(unused)", size=22).move_to(pslot[1])),
                  Transform(cslot[1], code("(unused)", size=22).move_to(cslot[1])), run_time=1.2)
        hold(self, 1)

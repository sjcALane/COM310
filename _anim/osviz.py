"""Shared look for COM310 animations: white background, black lines, IBM Plex type."""
from manim import *

config.background_color = WHITE
config.pixel_width = 1280
config.pixel_height = 720
config.frame_rate = 30

INK = BLACK
SOFT = "#D9D9D9"     # light gray fill
MID = "#8A8A8A"      # gray for things that are fading or inactive
SANS = "IBM Plex Sans"
MONO = "IBM Plex Mono"


def txt(s, size=30, color=INK, weight=NORMAL):
    return Text(s, font=SANS, font_size=size, color=color, weight=weight)


def code(s, size=26, color=INK):
    return Text(s, font=MONO, font_size=size, color=color)


def box(w, h, fill=None, dashed=False, color=INK, stroke=3):
    r = RoundedRectangle(width=w, height=h, corner_radius=0.12, color=color, stroke_width=stroke)
    if fill:
        r.set_fill(fill, opacity=1)
    if dashed:
        r = DashedVMobject(r, num_dashes=40)
    return r


def memory(rows, width=3.2, row_h=0.62, size=24):
    """A stack of labeled memory sections, top to bottom."""
    cells = VGroup()
    for i, name in enumerate(rows):
        r = Rectangle(width=width, height=row_h, color=INK, stroke_width=2)
        r.set_fill(WHITE, opacity=1)
        t = code(name, size=size)
        cell = VGroup(r, t)
        t.move_to(r)
        cell.shift(DOWN * i * row_h)
        cells.add(cell)
    return cells


def process(title, rows, width=3.6, size=24, title_size=28):
    """A process: a titled box holding a memory stack. Returns VGroup(frame, title, mem)."""
    mem = memory(rows, width=width - 0.4, size=size)
    t = txt(title, size=title_size, weight=BOLD)
    frame = box(width, mem.height + t.height + 0.8)
    t.move_to(frame.get_top() + DOWN * (0.25 + t.height / 2))
    mem.next_to(t, DOWN, buff=0.25)
    return VGroup(frame, t, mem)


def dim(mob, color=MID):
    """Gray out a group without filling it: strokes and text turn gray."""
    anims = []
    for m in mob.get_family():
        if isinstance(m, Text):
            anims.append(m.animate.set_color(color))
        elif isinstance(m, VMobject) and not isinstance(m, Text) and m.get_stroke_width() > 0:
            anims.append(m.animate.set_stroke(color=color))
    return anims


def caption_free(scene):
    """Captions live on the web page, not in the video, so nothing to do here."""
    return None


def hold(scene, t=0.6):
    scene.wait(t)

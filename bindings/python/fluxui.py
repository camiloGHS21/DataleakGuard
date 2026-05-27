import ctypes
import os
import sys

# Find and load the shared library
lib_name = "fluxui_shared"
if sys.platform == "win32":
    lib_file = f"{lib_name}.dll"
elif sys.platform == "darwin":
    lib_file = f"lib{lib_name}.dylib"
else:
    lib_file = f"lib{lib_name}.so"

# Search in the build/Release directory relative to the workspace, or in current directories.
possible_paths = [
    os.path.join(os.path.dirname(__file__), "../../build/Release", lib_file),
    os.path.join(os.getcwd(), "build/Release", lib_file),
    os.path.join(os.getcwd(), lib_file),
    lib_file
]

_lib = None
for p in possible_paths:
    if os.path.exists(p):
        try:
            _lib = ctypes.CDLL(p)
            break
        except Exception:
            pass

if _lib is None:
    try:
        _lib = ctypes.CDLL(lib_file)
    except Exception as e:
        raise ImportError(f"Could not load FluxUI shared library. Searched in: {possible_paths}. Error: {e}")

class FluxUIColor(ctypes.Structure):
    _fields_ = [
        ("r", ctypes.c_float),
        ("g", ctypes.c_float),
        ("b", ctypes.c_float),
        ("a", ctypes.c_float)
    ]

class FluxUIRect(ctypes.Structure):
    _fields_ = [
        ("x", ctypes.c_float),
        ("y", ctypes.c_float),
        ("w", ctypes.c_float),
        ("h", ctypes.c_float)
    ]

FluxUIClickCallback = ctypes.CFUNCTYPE(None, ctypes.c_void_p, ctypes.c_void_p)

# Define ctypes prototypes
_lib.fluxui_app_create.restype = ctypes.c_void_p
_lib.fluxui_app_create.argtypes = []

_lib.fluxui_app_destroy.restype = None
_lib.fluxui_app_destroy.argtypes = [ctypes.c_void_p]

_lib.fluxui_app_init.restype = ctypes.c_int
_lib.fluxui_app_init.argtypes = [ctypes.c_void_p, ctypes.c_char_p, ctypes.c_int, ctypes.c_int]

_lib.fluxui_app_run.restype = None
_lib.fluxui_app_run.argtypes = [ctypes.c_void_p]

_lib.fluxui_app_stop.restype = None
_lib.fluxui_app_stop.argtypes = [ctypes.c_void_p]

_lib.fluxui_app_root.restype = ctypes.c_void_p
_lib.fluxui_app_root.argtypes = [ctypes.c_void_p]

_lib.fluxui_widget_add_panel.restype = ctypes.c_void_p
_lib.fluxui_widget_add_panel.argtypes = [ctypes.c_void_p, ctypes.c_char_p]

_lib.fluxui_widget_add_button.restype = ctypes.c_void_p
_lib.fluxui_widget_add_button.argtypes = [ctypes.c_void_p, ctypes.c_char_p, ctypes.c_char_p]

_lib.fluxui_widget_add_text.restype = ctypes.c_void_p
_lib.fluxui_widget_add_text.argtypes = [ctypes.c_void_p, ctypes.c_char_p, ctypes.c_char_p]

_lib.fluxui_text_set_content.restype = None
_lib.fluxui_text_set_content.argtypes = [ctypes.c_void_p, ctypes.c_char_p]

_lib.fluxui_style_width_px.restype = None
_lib.fluxui_style_width_px.argtypes = [ctypes.c_void_p, ctypes.c_float]

_lib.fluxui_style_height_px.restype = None
_lib.fluxui_style_height_px.argtypes = [ctypes.c_void_p, ctypes.c_float]

_lib.fluxui_style_background_color.restype = None
_lib.fluxui_style_background_color.argtypes = [ctypes.c_void_p, FluxUIColor]

_lib.fluxui_widget_set_on_click.restype = None
_lib.fluxui_widget_set_on_click.argtypes = [ctypes.c_void_p, FluxUIClickCallback, ctypes.c_void_p]


class Widget:
    def __init__(self, handle):
        self.handle = handle
        self._click_cb = None

    def add_panel(self, class_name=""):
        res = _lib.fluxui_widget_add_panel(self.handle, class_name.encode('utf-8'))
        return Widget(res) if res else None

    def add_button(self, label, class_name=""):
        res = _lib.fluxui_widget_add_button(self.handle, label.encode('utf-8'), class_name.encode('utf-8'))
        return Widget(res) if res else None

    def add_text(self, text, class_name=""):
        res = _lib.fluxui_widget_add_text(self.handle, text.encode('utf-8'), class_name.encode('utf-8'))
        return Widget(res) if res else None

    def set_content(self, text):
        _lib.fluxui_text_set_content(self.handle, text.encode('utf-8'))

    def set_on_click(self, callback):
        # We must store the ctypes callback reference to prevent it from being garbage collected
        self._click_cb = FluxUIClickCallback(lambda w, u: callback())
        _lib.fluxui_widget_set_on_click(self.handle, self._click_cb, None)

    def style_width(self, px):
        _lib.fluxui_style_width_px(self.handle, float(px))

    def style_height(self, px):
        _lib.fluxui_style_height_px(self.handle, float(px))

    def style_background_color(self, r, g, b, a=1.0):
        color = FluxUIColor(r, g, b, a)
        _lib.fluxui_style_background_color(self.handle, color)


class App:
    def __init__(self):
        self.handle = _lib.fluxui_app_create()
        if not self.handle:
            raise RuntimeError("Failed to create FluxUI App")

    def __del__(self):
        if hasattr(self, 'handle') and self.handle:
            _lib.fluxui_app_destroy(self.handle)

    def init(self, title, width, height):
        return _lib.fluxui_app_init(self.handle, title.encode('utf-8'), width, height) != 0

    def run(self):
        _lib.fluxui_app_run(self.handle)

    def stop(self):
        _lib.fluxui_app_stop(self.handle)

    def root(self):
        res = _lib.fluxui_app_root(self.handle)
        return Widget(res) if res else None

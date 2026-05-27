package fluxui

import (
	"errors"
	"math"
	"syscall"
	"unsafe"
)

var (
	fluxui_dll = syscall.NewLazyDLL("fluxui_shared.dll")

	fluxui_app_create             = fluxui_dll.NewProc("fluxui_app_create")
	fluxui_app_destroy            = fluxui_dll.NewProc("fluxui_app_destroy")
	fluxui_app_init               = fluxui_dll.NewProc("fluxui_app_init")
	fluxui_app_run                = fluxui_dll.NewProc("fluxui_app_run")
	fluxui_app_stop               = fluxui_dll.NewProc("fluxui_app_stop")
	fluxui_app_root               = fluxui_dll.NewProc("fluxui_app_root")
	fluxui_widget_add_panel       = fluxui_dll.NewProc("fluxui_widget_add_panel")
	fluxui_widget_add_button      = fluxui_dll.NewProc("fluxui_widget_add_button")
	fluxui_widget_add_text        = fluxui_dll.NewProc("fluxui_widget_add_text")
	fluxui_text_set_content       = fluxui_dll.NewProc("fluxui_text_set_content")
	fluxui_style_width_px         = fluxui_dll.NewProc("fluxui_style_width_px")
	fluxui_style_height_px        = fluxui_dll.NewProc("fluxui_style_height_px")
	fluxui_style_background_color = fluxui_dll.NewProc("fluxui_style_background_color")
	fluxui_widget_set_on_click    = fluxui_dll.NewProc("fluxui_widget_set_on_click")
)

type App struct {
	handle uintptr
}

type Widget struct {
	handle uintptr
}

type FluxUIColor struct {
	R, G, B, A float32
}

func CreateApp() (*App, error) {
	r1, _, _ := fluxui_app_create.Call()
	if r1 == 0 {
		return nil, errors.New("failed to create FluxUI app")
	}
	return &App{handle: r1}, nil
}

func (a *App) Destroy() {
	if a.handle != 0 {
		fluxui_app_destroy.Call(a.handle)
		a.handle = 0
	}
}

func (a *App) Init(title string, width, height int) bool {
	cTitle, err := syscall.BytePtrFromString(title)
	if err != nil {
		return false
	}
	r1, _, _ := fluxui_app_init.Call(a.handle, uintptr(unsafe.Pointer(cTitle)), uintptr(width), uintptr(height))
	return r1 != 0
}

func (a *App) Run() {
	fluxui_app_run.Call(a.handle)
}

func (a *App) Stop() {
	fluxui_app_stop.Call(a.handle)
}

func (a *App) Root() *Widget {
	r1, _, _ := fluxui_app_root.Call(a.handle)
	if r1 == 0 {
		return nil
	}
	return &Widget{handle: r1}
}

func (w *Widget) AddPanel(className string) *Widget {
	cClass, err := syscall.BytePtrFromString(className)
	if err != nil {
		return nil
	}
	r1, _, _ := fluxui_widget_add_panel.Call(w.handle, uintptr(unsafe.Pointer(cClass)))
	if r1 == 0 {
		return nil
	}
	return &Widget{handle: r1}
}

func (w *Widget) AddButton(label, className string) *Widget {
	cLabel, err := syscall.BytePtrFromString(label)
	if err != nil {
		return nil
	}
	cClass, err := syscall.BytePtrFromString(className)
	if err != nil {
		return nil
	}
	r1, _, _ := fluxui_widget_add_button.Call(w.handle, uintptr(unsafe.Pointer(cLabel)), uintptr(unsafe.Pointer(cClass)))
	if r1 == 0 {
		return nil
	}
	return &Widget{handle: r1}
}

func (w *Widget) AddText(text, className string) *Widget {
	cText, err := syscall.BytePtrFromString(text)
	if err != nil {
		return nil
	}
	cClass, err := syscall.BytePtrFromString(className)
	if err != nil {
		return nil
	}
	r1, _, _ := fluxui_widget_add_text.Call(w.handle, uintptr(unsafe.Pointer(cText)), uintptr(unsafe.Pointer(cClass)))
	if r1 == 0 {
		return nil
	}
	return &Widget{handle: r1}
}

func (w *Widget) SetContent(text string) {
	cText, err := syscall.BytePtrFromString(text)
	if err != nil {
		return
	}
	fluxui_text_set_content.Call(w.handle, uintptr(unsafe.Pointer(cText)))
}

func (w *Widget) StyleWidth(px float32) {
	fluxui_style_width_px.Call(w.handle, uintptr(math.Float32bits(px)))
}

func (w *Widget) StyleHeight(px float32) {
	fluxui_style_height_px.Call(w.handle, uintptr(math.Float32bits(px)))
}

func (w *Widget) StyleBackgroundColor(r, g, b, a float32) {
	color := FluxUIColor{R: r, G: g, B: b, A: a}
	fluxui_style_background_color.Call(w.handle, uintptr(unsafe.Pointer(&color)))
}

var (
	clickCallbacks  = make(map[uintptr]func())
	callbackCounter uintptr
)

func goClickCallback(widget, userData uintptr) uintptr {
	if cb, ok := clickCallbacks[userData]; ok {
		cb()
	}
	return 0
}

var sysClickCallback = syscall.NewCallback(goClickCallback)

func (w *Widget) SetOnClick(cb func()) {
	callbackCounter++
	id := callbackCounter
	clickCallbacks[id] = cb
	fluxui_widget_set_on_click.Call(w.handle, sysClickCallback, id)
}

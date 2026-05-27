package main

import (
	"fmt"
	"os"
	"runtime"

	"github.com/camiloGHS21/DataleakGuard/bindings/go"
)

func main() {
	// Lock OS thread because UI frameworks usually require running on the main thread
	runtime.LockOSThread()

	app, err := fluxui.CreateApp()
	if err != nil {
		fmt.Printf("Error creating app: %v\n", err)
		os.Exit(1)
	}
	defer app.Destroy()

	fmt.Printf("App handle: 0x%x\n", app.GetHandle())
	app.SetBackend(100) // 100 is FLUXUI_BACKEND_COMPATIBILITY
	if !app.Init("FluxUI Go Minimal Example", 800, 600) {
		fmt.Println("Failed to initialize FluxUI App")
		os.Exit(1)
	}
	fmt.Printf("Active Backend: %d\n", app.GetBackend())

	root := app.Root()
	fmt.Printf("Root widget handle: 0x%x\n", root.GetHandle())
	panel := root.AddPanel("container")
	fmt.Printf("Panel widget handle: 0x%x\n", panel.GetHandle())
	panel.StyleWidth(600)
	panel.StyleHeight(400)
	panel.StyleBackgroundColor(0.15, 0.1, 0.1, 1.0)

	label := panel.AddText("Welcome to FluxUI from Go!", "")
	_ = label

	counter := 0
	_ = counter
	btn := panel.AddButton("Click Me", "btn")
	_ = btn
	// btn.SetOnClick(func() {
	// 	counter++
	// 	label.SetContent(fmt.Sprintf("Button clicked %d times!", counter))
	// 	fmt.Printf("Clicked: %d\n", counter)
	// })

	exitBtn := panel.AddButton("Exit", "btn")
	_ = exitBtn
	// exitBtn.SetOnClick(func() {
	// 	app.Stop()
	// })

	fmt.Println("Running FluxUI app from Go...")
	app.Run()
}

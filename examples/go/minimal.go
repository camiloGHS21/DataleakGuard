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

	if !app.Init("FluxUI Go Minimal Example", 800, 600) {
		fmt.Println("Failed to initialize FluxUI App")
		os.Exit(1)
	}

	root := app.Root()
	panel := root.AddPanel("container")
	panel.StyleWidth(600)
	panel.StyleHeight(400)
	panel.StyleBackgroundColor(0.15, 0.1, 0.1, 1.0)

	label := panel.AddText("Welcome to FluxUI from Go!", "")

	counter := 0
	btn := panel.AddButton("Click Me", "btn")
	btn.SetOnClick(func() {
		counter++
		label.SetContent(fmt.Sprintf("Button clicked %d times!", counter))
		fmt.Printf("Clicked: %d\n", counter)
	})

	exitBtn := panel.AddButton("Exit", "btn")
	exitBtn.SetOnClick(func() {
		app.Stop()
	})

	fmt.Println("Running FluxUI app from Go...")
	app.Run()
}

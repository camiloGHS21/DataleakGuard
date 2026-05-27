import sys
import os

# Add bindings/python to system path so we can import fluxui
sys.path.append(os.path.join(os.path.dirname(__file__), "../../bindings/python"))

from fluxui import App

def main():
    app = App()
    if not app.init("FluxUI Python Minimal Example", 800, 600):
        print("Failed to initialize FluxUI application.")
        return

    root = app.root()
    
    panel = root.add_panel("container")
    panel.style_width(600)
    panel.style_height(400)
    panel.style_background_color(0.1, 0.1, 0.15, 1.0)
    
    label = panel.add_text("Welcome to FluxUI from Python!")
    
    counter = [0]
    
    def on_click():
        counter[0] += 1
        label.set_content(f"Button Clicked {counter[0]} times!")
        print(f"Clicked: {counter[0]}")
        
    btn = panel.add_button("Click Me")
    btn.set_on_click(on_click)
    
    exit_btn = panel.add_button("Exit")
    exit_btn.set_on_click(lambda: app.stop())

    print("Running FluxUI app...")
    app.run()

if __name__ == "__main__":
    main()

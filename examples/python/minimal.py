import sys
import os

# Add bindings/python to system path so we can import fluxui
sys.path.append(os.path.join(os.path.dirname(__file__), "../../bindings/python"))

from fluxui import App, Widget

def main():
    app = App()
    if not app.init("FluxUI Python Showcase Console", 900, 650):
        print("Failed to initialize FluxUI application.")
        return

    # Auto-load the default font, fallback to standard Windows/System paths if needed
    if not app.load_default_font(16.0):
        app.load_font("C:/Windows/Fonts/segoeui.ttf", 16.0)

    # Warm up font sizes for smooth text layout rendering
    app.warm_font_cache([12.0, 14.0, 16.0, 18.0, 24.0, 28.0], "default")
    app.release_font_sources()

    # Premium dark-themed, glassmorphic stylesheet mimicking chromium sandboxed design
    app.add_stylesheet("""
        .root {
            display: flex;
            flex-direction: column;
            background: radial-gradient(circle at top, #161a26 0%, #0a0b10 100%);
            padding: 40px;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .container {
            display: flex;
            flex-direction: column;
            width: 720px;
            padding: 35px;
            border-radius: 16px;
            background: rgba(22, 26, 38, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.08);
            gap: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(12px);
        }
        .header {
            display: flex;
            flex-direction: column;
            gap: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.07);
            padding-bottom: 20px;
        }
        .title-class {
            font-size: 28px;
            font-weight: 800;
            color: #ffffff;
            background: linear-gradient(135deg, #ffffff 0%, #b0c4de 100%);
        }
        .desc-class {
            font-size: 14px;
            color: rgba(237, 243, 248, 0.7);
            line-height: 1.6;
        }
        .form-class {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .fieldset-class {
            display: flex;
            flex-direction: column;
            padding: 24px;
            border-radius: 10px;
            background: rgba(10, 11, 16, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.05);
            gap: 16px;
        }
        .legend-class {
            font-size: 14px;
            font-weight: 700;
            color: #6c5ce7;
            padding: 0 10px;
        }
        .row-class {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 15px;
        }
        .label-class {
            font-size: 14px;
            font-weight: 600;
            color: #a0aec0;
            width: 100px;
        }
        .input-class {
            padding: 11px 16px;
            border-radius: 8px;
            background-color: #0b0d13;
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #ffffff;
            font-size: 14px;
            transition: border-color 0.2s ease;
        }
        .input-class:focus {
            border-color: #6c5ce7;
            outline: none;
        }
        .actions-class {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 15px;
            margin-top: 10px;
        }
        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
        }
        .btn-primary {
            background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
            color: #ffffff;
            box-shadow: 0 4px 15px rgba(108, 92, 231, 0.25);
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
            background: linear-gradient(135deg, #7d6df3 0%, #b3adff 100%);
        }
        .btn-primary:active {
            transform: translateY(1px);
        }
        .btn-danger {
            background: linear-gradient(135deg, #e53e3e 0%, #f56565 100%);
            color: #ffffff;
            box-shadow: 0 4px 15px rgba(229, 62, 62, 0.25);
        }
        .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(229, 62, 62, 0.4);
            background: linear-gradient(135deg, #f56565 0%, #feb2b2 100%);
        }
        .btn-danger:active {
            transform: translateY(1px);
        }
        .anchor-class {
            font-size: 14px;
            color: #a29bfe;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s ease;
        }
        .anchor-class:hover {
            color: #b3adff;
        }
        .dialog-class {
            display: flex;
            flex-direction: column;
            padding: 28px;
            border-radius: 14px;
            background: #141824;
            border: 1px solid rgba(255, 255, 255, 0.09);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
            gap: 20px;
        }
        .dialog-text-class {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
        }
    """)

    # Apply the root class to the main panel
    root = app.root()
    root.set_class("root")
    
    panel = root.add_panel("container")
    
    header = panel.add_panel("header")
    title_lbl = header.add_text("FluxUI Native Style Console", "title-class")
    desc_lbl = header.add_text("Experience beautiful, high-performance styling and controls in native Python.", "desc-class")

    # Form with Fieldset
    form = panel.add_form("form-class")
    
    fieldset = form.add_fieldset("fieldset-class")
    fieldset.add_legend("User Information", "legend-class")
    
    # Input Row
    row = fieldset.add_panel("row-class")
    row.add_label("Username:", "label-class")
    
    txt_input = row.add_text_input("Enter username...", "input-class")
    txt_input.style_width(320)
    
    # Action row
    actions = panel.add_panel("actions-class")
    
    btn = actions.add_button("Submit Info", "btn btn-primary")
    anchor = actions.add_anchor("Visit Chromium Docs", "https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink", "anchor-class")

    # Add a custom dialog
    dlg = panel.add_dialog("dialog-class")
    dlg_text = dlg.add_text("Information successfully submitted!", "dialog-text-class")
    
    close_btn = dlg.add_button("Close", "btn btn-danger")
    close_btn.style_width(120)
    close_btn.set_on_click(lambda: dlg.dialog_close())

    def on_submit():
        user = txt_input.get_value()
        print(f"Submitted Username: {user}")
        title_lbl.set_content(f"Hello, {user}!")
        dlg.dialog_show_modal()
        
    btn.set_on_click(on_submit)
    
    exit_btn = actions.add_button("Exit", "btn btn-danger")
    exit_btn.set_on_click(lambda: app.stop())
 
    print("Running FluxUI app...")
    app.run()
    
    # Explicitly shutdown application to cleanly release GLFW/Vulkan contexts
    print("Shutting down FluxUI app...")
    app.shutdown()

if __name__ == "__main__":
    main()

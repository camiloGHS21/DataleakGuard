"""
FluxUI - Complete Blink/Chromium Default UI Element Showcase
============================================================
This file demonstrates ALL available FluxUI widget types rendered
with ZERO custom stylesheets. Every element uses the built-in
Blink/Chromium User Agent default styles baked into the core engine.

Reference: chromium/src/third_party/blink/renderer/core/html/resources/html.css
"""
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../bindings/python"))

from fluxui import App

def main():
    app = App()
    if not app.init("FluxUI - All Blink Default Elements (No Custom CSS)", 1024, 768):
        print("Failed to initialize FluxUI application.")
        return

    # Load default font only - NO stylesheets, NO class styling
    if not app.load_default_font(16.0):
        app.load_font("C:/Windows/Fonts/segoeui.ttf", 16.0)

    app.warm_font_cache([10.0, 12.0, 13.333, 14.0, 16.0, 18.0, 20.0, 24.0, 28.0, 32.0], "default")
    app.release_font_sources()

    # ===================================================================
    # NO app.add_stylesheet() calls! Pure built-in Blink defaults only.
    # ===================================================================

    root = app.root()

    # --- SECTION 1: Typography / Headings ---
    root.add_element("h1", "FluxUI Blink User Agent Stylesheet Showcase")
    root.add_element("h2", "All Elements with Default Browser Styling")
    root.add_element("h3", "Section: Typography")
    root.add_element("h4", "Heading Level 4")
    root.add_element("h5", "Heading Level 5")
    root.add_element("h6", "Heading Level 6")

    root.add_element("p", "This is a standard paragraph element (<p>) with default Blink margin and font sizing. "
                          "No custom CSS was loaded - this uses the built-in user-agent stylesheet.")

    root.add_element("p", "Another paragraph to show proper block-level spacing between <p> elements.")

    # --- Horizontal Rule ---
    root.add_hr()

    # --- SECTION 2: Inline Text Semantics ---
    root.add_element("h3", "Section: Inline Text Elements")

    inline_row = root.add_panel()
    inline_row.add_element("strong", "Bold/Strong text")
    inline_row.add_text("  |  ")
    inline_row.add_element("em", "Italic/Emphasized text")
    inline_row.add_text("  |  ")
    inline_row.add_element("small", "Small text")
    inline_row.add_text("  |  ")
    inline_row.add_element("span", "Normal span")
    inline_row.add_text("  |  ")
    inline_row.add_element("code", "monospace code")

    root.add_hr()

    # --- SECTION 3: Links / Anchors ---
    root.add_element("h3", "Section: Hyperlinks")

    link_row = root.add_panel()
    link_row.add_anchor("Chromium Blink Source", "https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink")
    link_row.add_text("   ")
    link_row.add_anchor("FluxUI Documentation", "https://fluxui.dev")
    link_row.add_text("   ")
    link_row.add_anchor("Google", "https://google.com")

    root.add_hr()

    # --- SECTION 4: Form with Fieldset + Legend ---
    root.add_element("h3", "Section: Form Controls")

    form = root.add_form()

    # Fieldset: Text Inputs
    fs_text = form.add_fieldset()
    fs_text.add_legend("Text Inputs")

    row1 = fs_text.add_panel()
    row1.add_label("Username: ")
    txt_username = row1.add_text_input("Enter username...")
    txt_username.style_width(250)

    row2 = fs_text.add_panel()
    row2.add_label("Email: ")
    txt_email = row2.add_input("email", "name@example.com")
    txt_email.style_width(250)

    row3 = fs_text.add_panel()
    row3.add_label("Password: ")
    txt_password = row3.add_password_input("Enter password...")
    txt_password.style_width(250)

    # Fieldset: Textarea
    fs_textarea = form.add_fieldset()
    fs_textarea.add_legend("Textarea")
    fs_textarea.add_label("Comments:")
    ta = fs_textarea.add_textarea("Type your comments here...")
    ta.style_width(400)
    ta.style_height(80)

    # Fieldset: Checkboxes
    fs_check = form.add_fieldset()
    fs_check.add_legend("Checkboxes")

    check_row1 = fs_check.add_panel()
    cb1 = check_row1.add_checkbox(True)
    check_row1.add_label(" Option A (checked by default)")

    check_row2 = fs_check.add_panel()
    cb2 = check_row2.add_checkbox(False)
    check_row2.add_label(" Option B (unchecked)")

    check_row3 = fs_check.add_panel()
    cb3 = check_row3.add_checkbox(False)
    check_row3.add_label(" Option C (unchecked)")

    # Fieldset: Radio Buttons
    fs_radio = form.add_fieldset()
    fs_radio.add_legend("Radio Buttons")

    radio_row1 = fs_radio.add_panel()
    r1 = radio_row1.add_radio(True, "color")
    radio_row1.add_label(" Red")

    radio_row2 = fs_radio.add_panel()
    r2 = radio_row2.add_radio(False, "color")
    radio_row2.add_label(" Green")

    radio_row3 = fs_radio.add_panel()
    r3 = radio_row3.add_radio(False, "color")
    radio_row3.add_label(" Blue")

    # Fieldset: Range Slider
    fs_range = form.add_fieldset()
    fs_range.add_legend("Range Slider")
    range_row = fs_range.add_panel()
    range_row.add_label("Volume: ")
    slider = range_row.add_range(50.0, 0.0, 100.0, 1.0)
    slider.style_width(200)

    # Fieldset: Select Dropdown
    fs_select = form.add_fieldset()
    fs_select.add_legend("Select Dropdown")
    select_row = fs_select.add_panel()
    select_row.add_label("Choose a fruit: ")
    sel = select_row.add_select()
    sel.add_option("Apple", "apple")
    sel.add_option("Banana", "banana")
    sel.add_option("Cherry", "cherry")
    sel.add_option("Dragonfruit", "dragonfruit")
    sel.style_width(180)

    root.add_hr()

    # --- SECTION 5: Buttons ---
    root.add_element("h3", "Section: Buttons")

    btn_row = root.add_panel()
    btn_submit = btn_row.add_button("Submit")
    btn_reset = btn_row.add_button("Reset")
    btn_cancel = btn_row.add_button("Cancel")
    btn_action = btn_row.add_button("Perform Action")

    root.add_hr()

    # --- SECTION 6: Meter & Progress ---
    root.add_element("h3", "Section: Meter & Progress")

    meter_row = root.add_panel()
    meter_row.add_label("Disk usage (meter): ")
    meter = meter_row.add_meter(65.0, 0.0, 100.0)
    meter.style_width(200)

    progress_row = root.add_panel()
    progress_row.add_label("Download (progress): ")
    prog = progress_row.add_progress_element(42.0, 100.0)
    prog.style_width(200)

    root.add_hr()

    # --- SECTION 7: Details / Summary ---
    root.add_element("h3", "Section: Details & Summary")

    details1 = root.add_details()
    details1.add_summary("Click to expand: System Information")
    details1.add_element("p", "Operating System: Windows 11 Pro")
    details1.add_element("p", "Architecture: x86_64")
    details1.add_element("p", "Renderer: Vulkan 1.3")

    details2 = root.add_details()
    details2.add_summary("Click to expand: Build Configuration")
    details2.add_element("p", "Compiler: MSVC 18.4")
    details2.add_element("p", "Config: Release")
    details2.add_element("p", "Backend: Vulkan + OpenGL fallback")

    root.add_hr()

    # --- SECTION 8: Preformatted / Code Block ---
    root.add_element("h3", "Section: Preformatted Text")

    root.add_element("pre",
        "// C++ FluxUI code example\n"
        "#include <fluxui/widgets.h>\n"
        "\n"
        "int main() {\n"
        "    FluxUI::Application app;\n"
        "    app.init(\"Hello\", 800, 600);\n"
        "    app.run();\n"
        "    return 0;\n"
        "}")

    root.add_hr()

    # --- SECTION 9: Dialog ---
    root.add_element("h3", "Section: Dialog")

    dlg = root.add_dialog()
    dlg.add_element("h3", "Modal Dialog")
    dlg.add_element("p", "This is a native <dialog> element rendered with Blink default styles.")
    dlg_close = dlg.add_button("Close Dialog")
    dlg_close.set_on_click(lambda: dlg.dialog_close())

    btn_open_dialog = root.add_button("Open Dialog")
    btn_open_dialog.set_on_click(lambda: dlg.dialog_show_modal())

    root.add_hr()

    # --- SECTION 10: Horizontal Rules and BR ---
    root.add_element("h3", "Section: Miscellaneous")
    root.add_element("p", "Line before <br>")
    root.add_br()
    root.add_element("p", "Line after <br>")
    root.add_hr()

    # --- Footer text ---
    root.add_element("p", "End of FluxUI Blink UA Stylesheet showcase. All elements above use ZERO custom CSS.")

    # --- Button actions ---
    def on_submit():
        user = txt_username.get_value()
        email = txt_email.get_value()
        print(f"Submit -> Username: {user}, Email: {email}")
        dlg.dialog_show_modal()

    btn_submit.set_on_click(on_submit)
    btn_cancel.set_on_click(lambda: app.stop())

    print("Running FluxUI Blink Default Showcase...")
    app.run()

    print("Shutting down...")
    app.shutdown()

if __name__ == "__main__":
    main()

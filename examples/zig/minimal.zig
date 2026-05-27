const std = @import("std");
const fluxui = @import("fluxui.zig");

pub fn main() !void {
    std.debug.print("Creating app...\n", .{});
    const app = try fluxui.App.create();
    defer {
        std.debug.print("Deinitializing app...\n", .{});
        app.deinit();
    }

    std.debug.print("Initializing app...\n", .{});
    try app.init("FluxUI Zig Example", 900, 600);
    
    std.debug.print("Loading default font...\n", .{});
    if (!app.loadDefaultFont(16.0)) {
        std.debug.print("Failed to load default font, loading Segoe UI...\n", .{});
        _ = app.loadFont("C:/Windows/Fonts/segoeui.ttf", 16.0);
    }
    
    std.debug.print("Warming font cache...\n", .{});
    const font_sizes = [_]f32{ 14.0, 16.0, 26.0 };
    app.warmFontCache(font_sizes[0..], "default");
    
    std.debug.print("Releasing font sources...\n", .{});
    app.releaseFontSources();
    
    std.debug.print("Adding stylesheet...\n", .{});
    app.addStylesheet(
        ".root { display: flex; flex-direction: column; background-color: #101418; padding: 32px; gap: 16px; }" ++
        ".title { font-size: 26px; font-weight: 700; color: #edf3f8; }" ++
        ".body { font-size: 14px; color: rgba(237, 243, 248, 0.68); }" ++
        ".button { width: 140px; height: 44px; border-radius: 8px; background-color: #37c6a3; color: #06100d; }"
    );

    std.debug.print("Getting root widget...\n", .{});
    const root = try app.root();
    
    std.debug.print("Reserving children...\n", .{});
    root.reserveChildren(3);
    
    std.debug.print("Adding text widgets...\n", .{});
    _ = try root.addText("Hello from Zig", "title");
    _ = try root.addText("This imports FluxUI as a Zig module.", "body");
    
    std.debug.print("Adding button...\n", .{});
    const close = try root.addButton("Close", "button");
    close.setOnClickStopApp(app);

    std.debug.print("Running main loop...\n", .{});
    app.run();
    
    std.debug.print("Done!\n", .{});
}

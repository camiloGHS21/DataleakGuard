#ifdef __APPLE__
#include "fluxui/platform.h"
#import <Cocoa/Cocoa.h>
#import <QuartzCore/CAMetalLayer.h>
#include <vulkan/vulkan.h>
#include <vulkan/vulkan_metal.h>
#include <dlfcn.h>
#include <iostream>

namespace FluxUI {

// Forward declaration of internal event callback
extern void Internal_OnWindowEvent(void* app, uint32_t msg, void* wParam, void* lParam);

@interface FluxUIView : NSView
@property (nonatomic, assign) void* app;
@end

@implementation FluxUIView
- (BOOL)acceptsFirstResponder { return YES; }
- (BOOL)wantsUpdateLayer { return YES; }
@end

@interface FluxUIWindowDelegate : NSObject <NSWindowDelegate>
@property (nonatomic, assign) void* app;
@end

@implementation FluxUIWindowDelegate
- (BOOL)windowShouldClose:(id)sender {
    if (self.app) {
        // Post a close message
    }
    return YES;
}
@end

bool Platform::init() {
    [NSApplication sharedApplication];
    [NSApp setActivationPolicy:NSApplicationActivationPolicyRegular];
    [NSApp finishLaunching];
    return true; 
}

void Platform::shutdown() {
}

NativeWindowHandle Platform::createWindow(const PlatformWindowConfig& config) {
    NSRect rect = NSMakeRect(0, 0, config.width, config.height);
    NSUInteger style = NSWindowStyleMaskTitled | NSWindowStyleMaskClosable | NSWindowStyleMaskMiniaturizable;
    if (config.resizable) style |= NSWindowStyleMaskResizable;
    
    NSWindow* window = [[NSWindow alloc] initWithContentRect:rect 
                                                   styleMask:style 
                                                     backing:NSBackingStoreBuffered 
                                                       defer:NO];
    [window setTitle:[NSString stringWithUTF8String:config.title.c_str()]];
    [window center];
    
    FluxUIView* view = [[FluxUIView alloc] initWithFrame:rect];
    [view setWantsLayer:YES];
    view.layer = [CAMetalLayer layer];
    [window setContentView:view];
    
    FluxUIWindowDelegate* delegate = [[FluxUIWindowDelegate alloc] init];
    // Keep delegate alive
    objc_setAssociatedObject(window, "FluxUIDelegate", delegate, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    [window setDelegate:delegate];
    
    [window makeKeyAndOrderFront:nil];
    return (NativeWindowHandle)window;
}

void Platform::destroyWindow(NativeWindowHandle window) {
    if (window) {
        NSWindow* nsWindow = (NSWindow*)window;
        [nsWindow close];
    }
}

void Platform::processEvents(bool& running) {
    NSEvent* event;
    while ((event = [NSApp nextEventMatchingMask:NSEventMaskAny 
                                       untilDate:nil 
                                          inMode:NSDefaultRunLoopMode 
                                         dequeue:YES])) {
        [NSApp sendEvent:event];
        // If app receives quit event, set running = false
    }
}

void Platform::setClipboardText(const char* text) {
    NSPasteboard* pasteboard = [NSPasteboard generalPasteboard];
    [pasteboard clearContents];
    [pasteboard setString:[NSString stringWithUTF8String:text] forType:NSPasteboardTypeString];
}

std::string Platform::getClipboardText() {
    NSPasteboard* pasteboard = [NSPasteboard generalPasteboard];
    NSString* string = [pasteboard stringForType:NSPasteboardTypeString];
    if (string) {
        return std::string([string UTF8String]);
    }
    return "";
}

NativeCursorHandle Platform::createSystemCursor(CursorType type) {
    NSCursor* cursor = [NSCursor arrowCursor];
    switch (type) {
        case CursorType::Pointer: cursor = [NSCursor pointingHandCursor]; break;
        case CursorType::Text: cursor = [NSCursor IBeamCursor]; break;
        default: break;
    }
    return (NativeCursorHandle)cursor;
}

void Platform::setCursor(NativeCursorHandle cursor) {
    if (cursor) {
        [(NSCursor*)cursor set];
    }
}

void Platform::getWindowSize(NativeWindowHandle window, int& w, int& h) {
    if (window) {
        NSWindow* nsWindow = (NSWindow*)window;
        NSRect rect = [nsWindow.contentView bounds];
        NSRect backing = [nsWindow.contentView convertRectToBacking:rect];
        w = (int)backing.size.width;
        h = (int)backing.size.height;
    }
}

void* Platform::loadVulkanLibrary() {
    void* handle = dlopen("libvulkan.dylib", RTLD_NOW | RTLD_LOCAL);
    if (!handle) handle = dlopen("libvulkan.1.dylib", RTLD_NOW | RTLD_LOCAL);
    if (!handle) handle = dlopen("libMoltenVK.dylib", RTLD_NOW | RTLD_LOCAL);
    return handle;
}

void Platform::unloadVulkanLibrary(void* library) {
    if (library) dlclose(library);
}

void* Platform::getVulkanProc(void* library, const char* name) {
    if (library) return dlsym(library, name);
    return nullptr;
}

std::vector<const char*> Platform::getVulkanInstanceExtensions() {
    return {VK_KHR_SURFACE_EXTENSION_NAME, VK_EXT_METAL_SURFACE_EXTENSION_NAME};
}

bool Platform::createVulkanSurface(VkInstance instance, NativeWindowHandle window, VkSurfaceKHR* surface) {
    if (!window) return false;
    NSWindow* nsWindow = (NSWindow*)window;
    CAMetalLayer* metalLayer = (CAMetalLayer*)nsWindow.contentView.layer;
    
    VkMetalSurfaceCreateInfoEXT surfaceInfo = {};
    surfaceInfo.sType = VK_STRUCTURE_TYPE_METAL_SURFACE_CREATE_INFO_EXT;
    surfaceInfo.pLayer = metalLayer;

    // We must load vkCreateMetalSurfaceEXT dynamically since it's an extension
    auto func = (PFN_vkCreateMetalSurfaceEXT)vkGetInstanceProcAddr(instance, "vkCreateMetalSurfaceEXT");
    if (!func) return false;
    
    return func(instance, &surfaceInfo, nullptr, surface) == VK_SUCCESS;
}

} // namespace FluxUI
#endif

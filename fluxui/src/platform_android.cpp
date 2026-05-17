#ifdef __ANDROID__
#include "fluxui/platform.h"
#include <android_native_app_glue.h>
#include <android/window.h>
#include <android/log.h>
#include <vulkan/vulkan.h>
#include <vulkan/vulkan_android.h>
#include <dlfcn.h>
#include <string>
#include <vector>

namespace FluxUI {

static struct android_app* g_app = nullptr;

bool Platform::init() {
    // Note: Android requires setting g_app externally in android_main
    return g_app != nullptr;
}

void Platform::shutdown() {
}

NativeWindowHandle Platform::createWindow(const PlatformWindowConfig& config) {
    if (!g_app) return nullptr;
    // Wait until the native window is actually created by the OS
    while (!g_app->window) {
        int events;
        android_poll_source* source;
        if (ALooper_pollAll(-1, nullptr, &events, (void**)&source) >= 0) {
            if (source) source->process(g_app, source);
        }
        if (g_app->destroyRequested) return nullptr;
    }
    return (NativeWindowHandle)g_app->window;
}

void Platform::destroyWindow(NativeWindowHandle window) {
    // Window lifecycle is managed by Android
}

void Platform::processEvents(bool& running) {
    if (!g_app) return;
    int events;
    android_poll_source* source;
    while (ALooper_pollAll(0, nullptr, &events, (void**)&source) >= 0) {
        if (source) source->process(g_app, source);
        if (g_app->destroyRequested) {
            running = false;
        }
    }
}

void Platform::setClipboardText(const char* text) {
    // Clipboard interaction requires JNI in Android
}

std::string Platform::getClipboardText() {
    // Clipboard interaction requires JNI in Android
    return "";
}

NativeCursorHandle Platform::createSystemCursor(CursorType type) {
    return nullptr; // Android doesn't use hardware cursors natively
}

void Platform::setCursor(NativeCursorHandle cursor) {
}

void Platform::getWindowSize(NativeWindowHandle window, int& w, int& h) {
    if (window) {
        ANativeWindow* androidWindow = (ANativeWindow*)window;
        w = ANativeWindow_getWidth(androidWindow);
        h = ANativeWindow_getHeight(androidWindow);
    }
}

void* Platform::loadVulkanLibrary() {
    return dlopen("libvulkan.so", RTLD_NOW | RTLD_LOCAL);
}

void Platform::unloadVulkanLibrary(void* library) {
    if (library) dlclose(library);
}

void* Platform::getVulkanProc(void* library, const char* name) {
    if (library) return dlsym(library, name);
    return nullptr;
}

std::vector<const char*> Platform::getVulkanInstanceExtensions() {
    return {VK_KHR_SURFACE_EXTENSION_NAME, VK_KHR_ANDROID_SURFACE_EXTENSION_NAME};
}

bool Platform::createVulkanSurface(VkInstance instance, NativeWindowHandle window, VkSurfaceKHR* surface) {
    if (!window) return false;
    
    VkAndroidSurfaceCreateInfoKHR surfaceInfo = {};
    surfaceInfo.sType = VK_STRUCTURE_TYPE_ANDROID_SURFACE_CREATE_INFO_KHR;
    surfaceInfo.window = (ANativeWindow*)window;

    auto func = (PFN_vkCreateAndroidSurfaceKHR)vkGetInstanceProcAddr(instance, "vkCreateAndroidSurfaceKHR");
    if (!func) return false;
    
    return func(instance, &surfaceInfo, nullptr, surface) == VK_SUCCESS;
}

} // namespace FluxUI

#endif

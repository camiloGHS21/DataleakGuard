#include "fluxui/FluxUI.h"
#include <chrono>
#include <iostream>

int main() {
    FluxUI::StyleSheet sheet;
    sheet.parse(
        ".root { display: flex; color: #ffffff; }"
        ".sidebar { width: 250px; background-color: #111115; }"
        ".btn { padding: 10px; background-color: #3b82f6; }"
        ".btn:hover { background-color: #2563eb; }"
        ".btn.primary { font-weight: 700; }"
        "#main-action { border-radius: 4px; }"
        "button { cursor: pointer; }"
        ".sidebar .nav-item { opacity: 0.8; }"
        ".wrap-container > .wrap-item { width: 100px; }"
    );

    std::cout << "Starting benchmark with 100,000 iterations..." << std::endl;
    auto start = std::chrono::high_resolution_clock::now();
    
    int iterations = 100000;
    // We choose a combination of selectors to resolve
    for (int i = 0; i < iterations; ++i) {
        // Resolve for an element matching: class="btn primary", id="main-action", type="button"
        auto style = sheet.resolve("btn primary", "main-action", "button");
        // Resolve for a sidebar item: class="nav-item", id="", type="div"
        auto style2 = sheet.resolve("nav-item", "", "div");
        
        // Prevent compiler optimizations
        if (style.padding.top > 9999.0f || style2.opacity > 9999.0f) {
            std::cout << "Optimized" << std::endl;
        }
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> duration = end - start;
    
    std::cout << "Benchmark Finished!" << std::endl;
    std::cout << "Resolved " << (iterations * 2) << " styles in " << duration.count() << " ms" << std::endl;
    std::cout << "Average time per style resolution: " << (duration.count() / (iterations * 2) * 1000.0) << " microseconds" << std::endl;
    
    return 0;
}

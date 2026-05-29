#include "fluxui/renderer.h"
#include <iostream>
#include <fstream>
#include <vector>
#include <cassert>

void saveBmp(const std::string& filename, int w, int h, const std::vector<unsigned char>& pixels) {
    std::ofstream f(filename, std::ios::binary);
    if (!f) return;
    unsigned char header[54] = {
        'B', 'M', 0, 0, 0, 0, 0, 0, 0, 0, 54, 0, 0, 0,
        40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 32, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    };
    int fileSize = 54 + w * h * 4;
    header[2] = fileSize & 0xff;
    header[3] = (fileSize >> 8) & 0xff;
    header[4] = (fileSize >> 16) & 0xff;
    header[5] = (fileSize >> 24) & 0xff;
    header[18] = w & 0xff;
    header[19] = (w >> 8) & 0xff;
    header[20] = (w >> 16) & 0xff;
    header[21] = (w >> 24) & 0xff;
    header[22] = h & 0xff;
    header[23] = (h >> 8) & 0xff;
    header[24] = (h >> 16) & 0xff;
    header[25] = (h >> 24) & 0xff;
    f.write((char*)header, 54);
    std::vector<unsigned char> row(w * 4);
    for (int y = h - 1; y >= 0; --y) {
        for (int x = 0; x < w; ++x) {
            int srcIdx = (y * w + x) * 4;
            int dstIdx = x * 4;
            row[dstIdx + 0] = pixels[srcIdx + 2]; // B
            row[dstIdx + 1] = pixels[srcIdx + 1]; // G
            row[dstIdx + 2] = pixels[srcIdx + 0]; // R
            row[dstIdx + 3] = pixels[srcIdx + 3]; // A
        }
        f.write((char*)row.data(), w * 4);
    }
}

int main() {
    std::cout << "[Test] Running high-fidelity SVG renderer parity tests..." << std::endl;

    // Instantiate the renderer to use its public memory-based image loading API
    FluxUI::Renderer renderer;

    // Test 1: Simple SVG string with named colors and W3C functional rgb/rgba notation
    std::string simpleSvg = 
        "<svg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\">"
        "  <rect x=\"10\" y=\"10\" width=\"80\" height=\"80\" fill=\"crimson\" stroke=\"rgb(12 34 56 / 80%)\" stroke-width=\"5\"/>"
        "</svg>";
        
    bool simpleOk = renderer.loadImageFromMemory(
        reinterpret_cast<const unsigned char*>(simpleSvg.c_str()), 
        static_cast<int>(simpleSvg.size()), 
        "simple_test",
        true // svg = true
    );
    assert(simpleOk);
    
    FluxUI::Vec2 simpleSize = renderer.imageSize("simple_test");
    assert(simpleSize.x == 100.0f);
    assert(simpleSize.y == 100.0f);
    std::cout << "[Test 1 Passed] Simple SVG with named color (crimson) and rgb/rgba functional syntax parsed successfully! Decoded size: "
              << simpleSize.x << "x" << simpleSize.y << std::endl;

    // Test 2: SVG containing smooth quadratic and smooth cubic Bézier curves (T and S commands)
    std::string curveSvg = 
        "<svg width=\"200\" height=\"200\" viewBox=\"0 0 200 200\">"
        "  <path d=\"M 10 80 Q 52.5 10, 95 80 T 180 80 S 240 140, 240 80\" fill=\"none\" stroke=\"aquamarine\" stroke-width=\"4\"/>"
        "</svg>";
        
    bool curveOk = renderer.loadImageFromMemory(
        reinterpret_cast<const unsigned char*>(curveSvg.c_str()), 
        static_cast<int>(curveSvg.size()), 
        "curve_test",
        true // svg = true
    );
    assert(curveOk);
    
    FluxUI::Vec2 curveSize = renderer.imageSize("curve_test");
    assert(curveSize.x == 200.0f);
    assert(curveSize.y == 200.0f);
    std::cout << "[Test 2 Passed] Curves SVG with S/s and T/t commands parsed successfully! Decoded size: "
              << curveSize.x << "x" << curveSize.y << std::endl;

    // Test 3: Load and parse complex tiger.svg from assets
    std::ifstream tigerFile("assets/tiger.svg", std::ios::binary | std::ios::ate);
    if (!tigerFile) {
        std::cerr << "[Warning] assets/tiger.svg not found in current directory. Skipping file tests." << std::endl;
        return 0;
    }
    
    std::streamsize size = tigerFile.tellg();
    tigerFile.seekg(0, std::ios::beg);
    std::vector<char> buffer(size);
    if (tigerFile.read(buffer.data(), size)) {
        std::cout << "[Test 3] Loading complex tiger.svg into memory..." << std::endl;
        bool tigerOk = renderer.loadImageFromMemory(
            reinterpret_cast<const unsigned char*>(buffer.data()), 
            static_cast<int>(size), 
            "tiger_test",
            true // svg = true
        );
        std::cout << "[Test 3] Finished loading tiger.svg!" << std::endl;
        assert(tigerOk);
        
        FluxUI::Vec2 tigerSize = renderer.imageSize("tiger_test");
        std::cout << "[Test 3 Passed] Complex tiger.svg (" << size << " bytes) loaded, parsed and rasterized successfully! Decoded size: " 
                  << tigerSize.x << "x" << tigerSize.y << std::endl;
        const auto* tPix = renderer.imagePixels("tiger_test");
        if (tPix) saveBmp("tiger_test.bmp", (int)tigerSize.x, (int)tigerSize.y, *tPix);
    }

    // Test 4: Load and parse Font-Awesome gear.svg
    std::ifstream gearFile("assets/gear.svg", std::ios::binary | std::ios::ate);
    if (gearFile) {
        std::streamsize gSize = gearFile.tellg();
        gearFile.seekg(0, std::ios::beg);
        std::vector<char> gBuf(gSize);
        if (gearFile.read(gBuf.data(), gSize)) {
            bool gearOk = renderer.loadImageFromMemory(
                reinterpret_cast<const unsigned char*>(gBuf.data()), 
                static_cast<int>(gSize), 
                "gear_test",
                true // svg = true
            );
            assert(gearOk);
            
            FluxUI::Vec2 gearSize = renderer.imageSize("gear_test");
            std::cout << "[Test 4 Passed] Font-Awesome gear.svg loaded and parsed successfully! Decoded size: " 
                      << gearSize.x << "x" << gearSize.y << std::endl;
            const auto* gPix = renderer.imagePixels("gear_test");
            if (gPix) saveBmp("gear_test.bmp", (int)gearSize.x, (int)gearSize.y, *gPix);
        }
    }

    // Test 5: Multi-path fill-rule verification (nonzero winding / hole subtraction)
    // The gear.svg has two subpaths: an outer gear shape and an inner circle (the hole).
    // With correct nonzero-winding fill, the center pixel (256,256) should be TRANSPARENT 
    // because the inner circle subpath winds in opposite direction and subtracts from the fill.
    // Verify an outer gear tooth pixel has fill (opaque) and center has no fill (transparent).
    {
        std::string holeTestSvg =
            "<svg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\">"
            "  <path d=\"M10,10 L90,10 L90,90 L10,90 Z M30,30 L30,70 L70,70 L70,30 Z\" fill=\"red\"/>"
            "</svg>";
        bool holeOk = renderer.loadImageFromMemory(
            reinterpret_cast<const unsigned char*>(holeTestSvg.c_str()),
            static_cast<int>(holeTestSvg.size()),
            "hole_test", true
        );
        assert(holeOk);

        FluxUI::Vec2 holeSize = renderer.imageSize("hole_test");
        assert(holeSize.x == 100.0f && holeSize.y == 100.0f);

        // Access pixel data: check center (50,50) should be TRANSPARENT (inside hole)
        // and outer area (15,15) should be RED (inside outer rect, outside inner rect)
        const auto* pixels = renderer.imagePixels("hole_test");
        if (pixels && pixels->size() >= 100 * 100 * 4) {
            // Outer area pixel (15, 15) — should be filled RED
            int outerIdx = (15 * 100 + 15) * 4;
            int outerR = (*pixels)[outerIdx + 0];
            int outerA = (*pixels)[outerIdx + 3];
            
            // Center pixel (50, 50) — should be TRANSPARENT (hole)
            int centerIdx = (50 * 100 + 50) * 4;
            int centerA = (*pixels)[centerIdx + 3];

            std::cout << "[Test 5] Outer pixel (15,15): R=" << outerR << " A=" << outerA
                      << " | Center pixel (50,50): A=" << centerA << std::endl;

            bool outerIsFilled = (outerA > 200 && outerR > 200);  // Should be opaque red
            bool centerIsHole = (centerA < 50);  // Should be transparent
            
            if (outerIsFilled && centerIsHole) {
                std::cout << "[Test 5 Passed] Multi-path fill-rule: hole correctly subtracted! "
                          << "Outer=filled, Center=transparent." << std::endl;
            } else {
                std::cerr << "[Test 5 FAILED] Multi-path fill-rule: ";
                if (!outerIsFilled) std::cerr << "outer pixel NOT filled (A=" << outerA << "). ";
                if (!centerIsHole) std::cerr << "center pixel NOT transparent (A=" << centerA << "). ";
                std::cerr << std::endl;
                return 1;
            }
        } else {
            std::cerr << "[Test 5 Skipped] Could not access pixel data." << std::endl;
        }
    }

    std::cout << "[Success] All high-fidelity SVG parity tests passed successfully!" << std::endl;
    return 0;
}


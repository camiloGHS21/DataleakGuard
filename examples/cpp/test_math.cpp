#include "fluxui/core.h"
#include "fluxui/css_parser.h"
#include <iostream>
#include <cassert>

int main() {
    std::cout << "Running math expressions test..." << std::endl;

    // Test simple parsing
    auto v1 = FluxUI::StyleSheet::parseCSSValue("calc(100% - 200px)");
    assert(v1.mathExpr != nullptr);
    float res1 = v1.resolve(1000.0f); // 100% of 1000 - 200 = 800
    std::cout << "calc(100% - 200px) resolved to: " << res1 << " (expected 800)" << std::endl;
    assert(res1 == 800.0f);

    // Test clamp()
    auto v2 = FluxUI::StyleSheet::parseCSSValue("clamp(10px, 50%, 300px)");
    assert(v2.mathExpr != nullptr);
    float res2_low = v2.resolve(100.0f); // min is 10px, pref is 50px (50% of 100), max is 300px -> 50
    float res2_under = v2.resolve(10.0f); // min is 10px, pref is 5px, max is 300px -> 10
    float res2_high = v2.resolve(800.0f); // min is 10px, pref is 400px, max is 300px -> 300
    std::cout << "clamp(10px, 50%, 300px) low resolved to: " << res2_low << " (expected 50)" << std::endl;
    std::cout << "clamp(10px, 50%, 300px) under resolved to: " << res2_under << " (expected 10)" << std::endl;
    std::cout << "clamp(10px, 50%, 300px) high resolved to: " << res2_high << " (expected 300)" << std::endl;
    assert(res2_low == 50.0f);
    assert(res2_under == 10.0f);
    assert(res2_high == 300.0f);

    // Test min()
    auto v3 = FluxUI::StyleSheet::parseCSSValue("min(100px, 10%)");
    assert(v3.mathExpr != nullptr);
    float res3_1 = v3.resolve(500.0f); // min(100, 50) = 50
    float res3_2 = v3.resolve(2000.0f); // min(100, 200) = 100
    std::cout << "min(100px, 10%) resolved to: " << res3_1 << " (expected 50)" << std::endl;
    std::cout << "min(100px, 10%) resolved to: " << res3_2 << " (expected 100)" << std::endl;
    assert(res3_1 == 50.0f);
    assert(res3_2 == 100.0f);

    // Test nested expressions
    auto v4 = FluxUI::StyleSheet::parseCSSValue("calc(10px + (20% - 2rem) * 1.5)");
    assert(v4.mathExpr != nullptr);
    // rem is 16px -> 2rem = 32px.
    // parentSize = 1000. 20% of 1000 = 200px.
    // 200 - 32 = 168.
    // 168 * 1.5 = 252.
    // 10 + 252 = 262.
    float res4 = v4.resolve(1000.0f);
    std::cout << "calc(10px + (20% - 2rem) * 1.5) resolved to: " << res4 << " (expected 262)" << std::endl;
    assert(res4 == 262.0f);

    // Test new viewport and typographic units
    auto v5 = FluxUI::StyleSheet::parseCSSValue("calc(10vmin + 5vmax)");
    // viewportWidth = 1920, viewportHeight = 1080 (defaults in application/stylesheet)
    // vmin = 1080 -> 10vmin = 108px
    // vmax = 1920 -> 5vmax = 96px
    // Total = 108 + 96 = 204px
    float res5 = v5.resolve(0.0f, 1920.0f, 1080.0f, 16.0f);
    std::cout << "calc(10vmin + 5vmax) resolved to: " << res5 << " (expected 204)" << std::endl;
    assert(res5 == 204.0f);

    auto v6 = FluxUI::StyleSheet::parseCSSValue("calc(2ex + 1ic + 1cap + 1rlh)");
    // ex = 0.5 * emBase = 8px -> 2ex = 16px
    // ic = emBase = 16px -> 1ic = 16px
    // cap = 0.7 * emBase = 11.2px -> 1cap = 11.2px
    // rlh = 16px * 1.2 = 19.2px -> 1rlh = 19.2px
    // Total = 16 + 16 + 11.2 + 19.2 = 62.4px
    float res6 = v6.resolve(0.0f, 1920.0f, 1080.0f, 16.0f);
    std::cout << "calc(2ex + 1ic + 1cap + 1rlh) resolved to: " << res6 << " (expected 62.4)" << std::endl;
    assert(std::abs(res6 - 62.4f) < 0.001f);

    // Test Container Query Units
    auto v7 = FluxUI::StyleSheet::parseCSSValue("calc(10cqw + 20cqh)");
    // cqw using parentSize fallback = 500 -> 10cqw = 50px
    // cqh using parentSize fallback = 500 -> 20cqh = 100px
    // Total = 150px
    float res7 = v7.resolve(500.0f, 1920.0f, 1080.0f, 16.0f);
    std::cout << "calc(10cqw + 20cqh) resolved to: " << res7 << " (expected 150)" << std::endl;
    assert(res7 == 150.0f);

    // Test parseLengthPixels integration with complex math expressions!
    float len1 = FluxUI::StyleSheet::parseLengthPixels("calc(100% + 2rem)", 16.0f);
    // 100% of emBase (16.0f) + 2rem (32.0f) = 48.0f
    std::cout << "parseLengthPixels(\"calc(100% + 2rem)\") resolved to: " << len1 << " (expected 48)" << std::endl;
    assert(len1 == 48.0f);

    float len2 = FluxUI::StyleSheet::parseLengthPixels("clamp(10px, 20%, 30px)", 50.0f);
    // 20% of emBase (50.0f) = 10px -> clamp(10px, 10px, 30px) = 10.0f
    std::cout << "parseLengthPixels(\"clamp(10px, 20%, 30px)\") resolved to: " << len2 << " (expected 10)" << std::endl;
    assert(len2 == 10.0f);

    std::cout << "All math tests passed successfully!" << std::endl;
    return 0;
}

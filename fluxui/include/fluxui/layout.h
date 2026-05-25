// FluxUI Blink-style Decoupled Layout Solver Definitions
#pragma once
#include <vector>
#include <string>
#include <memory>
#include "fluxui/core.h"

namespace FluxUI {

    class Widget;

    // Computed output of a layout pass (Blink-style LayoutResult)
    struct LayoutResult {
        float x = 0.0f;
        float y = 0.0f;
        float width = 0.0f;
        float height = 0.0f;
        float contentHeight = 0.0f;
    };

    // Decoupled Layout Constraints matching Blink's constraint spaces
    struct LayoutConstraints {
        float availableWidth = 0.0f;
        float availableHeight = 0.0f;
        float parentWidth = 1920.0f;
        float parentHeight = 1080.0f;
        float emBase = 16.0f;
    };

    // Abstract base class for decoupled layout algorithms (Blink parity)
    class LayoutAlgorithm {
    public:
        virtual ~LayoutAlgorithm() = default;
        
        // Executes layout pass for a widget and its children, returning computed bounds
        virtual LayoutResult layout(Widget* widget, const LayoutConstraints& constraints) = 0;
    };

    // W3C-compliant Flexbox Solver (Parity with Blink's NGFlexLayoutAlgorithm)
    class FlexLayoutAlgorithm : public LayoutAlgorithm {
    public:
        LayoutResult layout(Widget* widget, const LayoutConstraints& constraints) override;
    };

    // Grid Layout Solver (Parity with Blink's NGGridLayoutAlgorithm)
    class GridLayoutAlgorithm : public LayoutAlgorithm {
    public:
        LayoutResult layout(Widget* widget, const LayoutConstraints& constraints) override;
    };

} // namespace FluxUI

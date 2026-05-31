#include "fluxui/core.h"
#include "fluxui/css_parser.h"
#include "fluxui/widgets.h"
#include <iostream>
#include <cassert>

using namespace FluxUI;

int main() {
    std::cout << "Running CSS Selector Matching Tests..." << std::endl;

    // Test 1: Attribute Matching with diverse operators and case flags
    {
        // Setup an element with attributes represented in the type-encoding:
        // actualType = "panel|dir=rtl|lang=en-us|class=container|open|checked"
        std::string actualType = "panel|dir=rtl|lang=en-us|class=container|open|checked";

        StyleSheet sheet;

        // Exact match
        CSSRule rule1;
        rule1.selector = "[dir=\"rtl\"]";
        rule1.parts = { "[dir=\"rtl\"]" };
        assert(sheet.selectorMatches(rule1, "container", "", actualType, {}));

        // Case insensitive match
        CSSRule rule2;
        rule2.selector = "[dir=\"RTL\" i]";
        rule2.parts = { "[dir=\"RTL\" i]" };
        assert(sheet.selectorMatches(rule2, "container", "", actualType, {}));

        // Prefix match
        CSSRule rule3;
        rule3.selector = "[lang^=\"en\"]";
        rule3.parts = { "[lang^=\"en\"]" };
        assert(sheet.selectorMatches(rule3, "container", "", actualType, {}));

        // Suffix match
        CSSRule rule4;
        rule4.selector = "[lang$=\"us\"]";
        rule4.parts = { "[lang$=\"us\"]" };
        assert(sheet.selectorMatches(rule4, "container", "", actualType, {}));

        // Substring match
        CSSRule rule5;
        rule5.selector = "[lang*=\"-\"]";
        rule5.parts = { "[lang*=\"-\"]" };
        assert(sheet.selectorMatches(rule5, "container", "", actualType, {}));

        // Sibling hyphen match
        CSSRule rule6;
        rule6.selector = "[lang|=\"en\"]";
        rule6.parts = { "[lang|=\"en\"]" };
        assert(sheet.selectorMatches(rule6, "container", "", actualType, {}));

        // Sibling hyphen match failure
        CSSRule rule6_fail;
        rule6_fail.selector = "[lang|=\"us\"]";
        rule6_fail.parts = { "[lang|=\"us\"]" };
        assert(!sheet.selectorMatches(rule6_fail, "container", "", actualType, {}));

        // Whitespace word match
        std::string wordType = "panel|class=active primary dynamic";
        CSSRule rule7;
        rule7.selector = "[class~=\"primary\"]";
        rule7.parts = { "[class~=\"primary\"]" };
        assert(sheet.selectorMatches(rule7, "active primary dynamic", "", wordType, {}));

        std::cout << "Test 1: Attribute Matching operators passed successfully." << std::endl;
    }

    // Test 2: Sibling combinators matching (+ and ~) on Widget tree
    {
        StyleSheet sheet;

        // Setup widget tree:
        // parent (Panel)
        //  ├── child1 (TextInput, type="input", id="input1")
        //  ├── child2 (Panel, class="sibling-one")
        //  └── child3 (Panel, class="sibling-two")
        
        auto parent = std::make_shared<Panel>("");
        
        auto child1 = std::make_shared<TextInput>("");
        child1->id = "input1";
        child1->parent = parent.get();
        parent->children.push_back(child1);

        auto child2 = std::make_shared<Panel>("sibling-one");
        child2->parent = parent.get();
        parent->children.push_back(child2);

        auto child3 = std::make_shared<Panel>("sibling-two");
        child3->parent = parent.get();
        parent->children.push_back(child3);

        // Match adjacent sibling: input + .sibling-one
        CSSRule adjacentRule;
        adjacentRule.selector = "input + .sibling-one";
        adjacentRule.parts = { "input", ".sibling-one" };
        adjacentRule.combinators = { '+' };

        bool matchAdjacent = sheet.selectorMatches(
            adjacentRule,
            child2->className.getString(),
            child2->id.getString(),
            child2->selectorType(),
            {},
            nullptr,
            child2.get()
        );
        assert(matchAdjacent);

        // Match general sibling: input ~ .sibling-two
        CSSRule generalRule;
        generalRule.selector = "input ~ .sibling-two";
        generalRule.parts = { "input", ".sibling-two" };
        generalRule.combinators = { '~' };

        bool matchGeneral = sheet.selectorMatches(
            generalRule,
            child3->className.getString(),
            child3->id.getString(),
            child3->selectorType(),
            {},
            nullptr,
            child3.get()
        );
        assert(matchGeneral);

        // Adjacent sibling mismatch: input + .sibling-two (child1 and child3 are not adjacent!)
        CSSRule adjacentRuleFail;
        adjacentRuleFail.selector = "input + .sibling-two";
        adjacentRuleFail.parts = { "input", ".sibling-two" };
        adjacentRuleFail.combinators = { '+' };

        bool matchAdjacentFail = sheet.selectorMatches(
            adjacentRuleFail,
            child3->className.getString(),
            child3->id.getString(),
            child3->selectorType(),
            {},
            nullptr,
            child3.get()
        );
        assert(!matchAdjacentFail);

        std::cout << "Test 2: Sibling combinators matching (+ and ~) passed successfully." << std::endl;
    }

    // Test 3: W3C Spec-Compliant Multi-Pass StyleCascade & EM Resolution
    {
        StyleSheet sheet;
        sheet.parse(".box { padding: 2em; font-size: 20px; }");

        // Resolve style for widget with class="box"
        auto widget = std::make_shared<Panel>("box");
        Style style = sheet.resolve("box", "", "panel", {}, nullptr, widget.get());
        style.resolveLogicalProperties();

        // Under standard Cascade/Blink resolution:
        // 1. font-size (high-priority typo property) resolves first to 20px
        // 2. padding resolves next using style.fontSize, resulting in 2em * 20px = 40px
        assert(style.fontSize == 20.0f);
        assert(style.padding.left == 40.0f);
        assert(style.padding.right == 40.0f);
        assert(style.padding.top == 40.0f);
        assert(style.padding.bottom == 40.0f);

        // Test custom variables resolved in first pass
        StyleSheet sheetVar;
        sheetVar.parse(".var-box { --base-padding: 1.5em; font-size: 10px; padding: var(--base-padding); }");

        auto widgetVar = std::make_shared<Panel>("var-box");
        Style styleVar = sheetVar.resolve("var-box", "", "panel", {}, nullptr, widgetVar.get());
        styleVar.resolveLogicalProperties();

        // 1. --base-padding resolved as 1.5em (Pass 1)
        // 2. font-size resolved as 10px (Pass 2)
        // 3. padding resolved using --base-padding (1.5em) relative to 10px -> 15px (Pass 3)
        assert(styleVar.fontSize == 10.0f);
        assert(styleVar.padding.left == 15.0f);

        std::cout << "Test 3: W3C Multi-Pass StyleCascade and EM resolution passed successfully." << std::endl;
    }

    std::cout << "All Selector Parity Tests Passed!" << std::endl;
    return 0;
}

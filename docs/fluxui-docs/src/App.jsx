import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Cpu, 
  Layers, 
  Compass, 
  Code2, 
  Check, 
  Copy, 
  Play, 
  ExternalLink,
  ChevronRight,
  GitBranch,
  Sparkles,
  Zap,
  Box,
  Monitor,
  Flame,
  HelpCircle
} from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [activeLangTab, setActiveLangTab] = useState('rust');
  const [copiedText, setCopiedText] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Sandbox Simulator State
  const [sandboxStyle, setSandboxStyle] = useState('cyberpunk');
  const [customText, setCustomText] = useState('FluxUI Native Widget');
  const [customColor, setCustomColor] = useState('#37c6a3');
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const codeSnippets = {
    rust: `// Cargo.toml / rustc direct invocation
// extern crate fluxui;

use fluxui::App;

fn main() -> Result<(), fluxui::Error> {
    // 1. Initialize high-performance FluxUI engine
    let app = App::create()?;
    
    // 2. Initialize native window (Vulkan 1.4 active backend)
    app.init("Vulkan Game Engine UI", 1024, 768)?;
    
    // 3. Register modern Google Fonts
    app.load_font("assets/fonts/Outfit-Bold.ttf", 16.0);
    
    // 4. Inject Blink-style dynamic CSS stylesheet
    app.add_stylesheet(
        ".container { \
            display: flex; \
            flex-direction: column; \
            background-color: #0c0f12; \
            padding: 32px; \
            border-radius: 16px; \
            gap: 20px; \
        } \
        .title { \
            font-size: 28px; \
            color: #37c6a3; \
            font-weight: 800; \
        } \
        .action-btn { \
            width: 200px; \
            height: 48px; \
            background: linear-gradient(135deg, #37c6a3, #9055ff); \
            border-radius: 8px; \
            display: flex; \
            justify-content: center; \
            align-items: center; \
        }"
    )?;
    
    // 5. Build dynamic UI tree nodes
    let root = app.root().unwrap();
    let container = root.add_panel("container")?.unwrap();
    
    container.add_text("FluxUI Native Window", "title")?;
    
    let btn = container.add_button("Click to Start", "action-btn")?.unwrap();
    btn.set_on_click_stop_app(&app); // Bind close app trigger
    
    // 6. Enter native Vulkan high-speed rendering loop
    app.run();
    
    Ok(())
}`,
    cpp: `#include <fluxui/fluxui.h>
#include <iostream>

int main() {
    try {
        // 1. Create a secure, sandboxed FluxUI instance
        auto app = fluxui::App::Create();
        
        // 2. Open standard window using Vulkan core backend
        app->Init("FluxUI C++ Core Application", 1280, 800);
        
        // 3. Register typography and stylesheets
        app->LoadFont("assets/fonts/Inter-Regular.ttf", 15.0f);
        app->AddStylesheet(R"(
            .root-view {
                background: #06080a;
                padding: 40px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .glow-btn {
                background-color: rgba(55, 198, 163, 0.1);
                border: 1px solid rgba(55, 198, 163, 0.4);
                color: #37c6a3;
                border-radius: 12px;
                padding: 12px 24px;
            }
        )");

        // 4. Construct elements using layout tree
        auto root = app->GetRoot();
        root->SetClassName("root-view");

        auto btn = root->AddButton("Initialize 3D Vulkan Sandbox", "glow-btn");
        
        // 5. Start main loop
        app->Run();
        
    } catch (const std::exception& e) {
        std::cerr << "Engine Initialization Failed: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}`,
    zig: `const std::import("std");
const fluxui = @import("fluxui.zig");

pub fn main() !void {
    // 1. Initialize core system allocations
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    
    // 2. Initialize native FluxUI App instance
    var app = try fluxui.App.create();
    defer app.destroy();
    
    // 3. Launch window linked to custom Vulkan swapchain
    try app.init("FluxUI Native Zig Application", 1024, 768);
    
    // 4. Load premium typography
    app.loadFont("assets/fonts/Inter-Medium.ttf", 15.0);
    
    // 5. Inject styles and add components
    try app.addStylesheet(
        \\.main-box {
        \\  display: flex;
        \\  flex-direction: column;
        \\  background-color: #0c0f12;
        \\  padding: 30px;
        \\  border-radius: 10px;
        \\}
    );
    
    var root = app.getRoot() orelse return error.InitFailed;
    var panel = try root.addPanel("main-box") orelse return error.InitFailed;
    
    // 6. Enter rendering pipeline loop
    app.run();
}`
  };

  const getSandboxCSS = () => {
    switch (sandboxStyle) {
      case 'cyberpunk':
        return {
          background: 'linear-gradient(135deg, #120c1f, #07050e)',
          border: `2px solid ${customColor}`,
          boxShadow: `0 0 20px ${customColor}33, inset 0 0 15px ${customColor}22`,
          padding: '24px 32px',
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: '900',
          color: '#ffffff',
          fontFamily: 'var(--sans)',
          transition: 'all 0.3s ease'
        };
      case 'glassmorphic':
        return {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          padding: '28px 40px',
          borderRadius: '16px',
          color: '#edf3f8',
          fontFamily: 'var(--sans)',
          transition: 'all 0.3s ease'
        };
      case 'gradient-glow':
        return {
          background: `linear-gradient(135deg, ${customColor}, #9055ff)`,
          border: 'none',
          boxShadow: `0 10px 30px ${customColor}55`,
          padding: '22px 36px',
          borderRadius: '12px',
          color: '#06080a',
          fontWeight: '700',
          fontFamily: 'var(--sans)',
          transition: 'all 0.3s ease'
        };
      default:
        return {};
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'intro':
        return (
          <section aria-labelledby="intro-title">
            <div className="badge-group">
              <span className="logo-badge" style={{ fontSize: '12px' }}>Vulkan Enabled</span>
              <span className="logo-badge" style={{ background: 'rgba(144, 85, 255, 0.1)', color: '#9055ff', border: '1px solid rgba(144, 85, 255, 0.2)' }}>Multi-Language Bindings</span>
            </div>
            
            <h1 id="intro-title">Next-Generation GPU-Accelerated Native UI</h1>
            <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
              <strong>FluxUI</strong> is a state-of-the-art UI rendering framework engineered from the ground up for high-performance interactive 2D canvases, desktop widgets, and full-featured 3D game overlays. Using a highly optimized, fully customized C++ core, it compiles directly against the modern <strong>Vulkan Graphics API</strong> to deliver silky-smooth rendering at up to 240+ FPS.
            </p>

            <div className="simulator-box">
              <div className="simulator-header">
                <div className="sim-indicator">
                  <span className="sim-dot"></span>
                  <span>FluxUI CSS & Layout Engine Sandbox</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interactive Realtime Simulator</span>
              </div>
              <div className="simulator-body">
                <div style={getSandboxCSS()}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', opacity: 0.6, letterSpacing: '1px', textTransform: 'uppercase' }}>FluxUI Container</span>
                    <span style={{ fontSize: '20px' }}>{customText}</span>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <span className="logo-badge" style={{ borderColor: customColor, color: customColor, background: 'none' }}>Active API</span>
                      <span className="logo-badge" style={{ background: customColor + '22', color: '#fff', border: 'none' }}>60 FPS</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sim-controls">
                <span style={{ fontSize: '13px', fontWeight: '600', marginRight: '8px' }}>Style Presets:</span>
                <button 
                  className={`sim-btn ${sandboxStyle === 'cyberpunk' ? 'active' : ''}`}
                  onClick={() => setSandboxStyle('cyberpunk')}
                >
                  Cyberpunk Neon
                </button>
                <button 
                  className={`sim-btn ${sandboxStyle === 'glassmorphic' ? 'active' : ''}`}
                  onClick={() => setSandboxStyle('glassmorphic')}
                >
                  Glassmorphic
                </button>
                <button 
                  className={`sim-btn ${sandboxStyle === 'gradient-glow' ? 'active' : ''}`}
                  onClick={() => setSandboxStyle('gradient-glow')}
                >
                  Gradient Glow
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                  <input 
                    type="text" 
                    value={customText} 
                    onChange={(e) => setCustomText(e.target.value)} 
                    placeholder="Custom Text"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
                  />
                  <input 
                    type="color" 
                    value={customColor} 
                    onChange={(e) => setCustomColor(e.target.value)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', width: '28px', height: '28px' }}
                  />
                </div>
              </div>
            </div>

            <h2>⚡ Key Architecture Pillars</h2>
            <div className="card-grid">
              <div className="doc-card">
                <div className="card-icon"><Monitor size={20} /></div>
                <div className="card-title">Vulkan Core Renderer</div>
                <div className="card-desc">Bypasses old-school slow GDI/Direct2D pipelines. It submits draws directly to the GPU using Vulkan Command Buffers, achieving near-zero overhead.</div>
              </div>
              <div className="doc-card">
                <div className="card-icon"><Layers size={20} /></div>
                <div className="card-title">Blink-Inspired Layout</div>
                <div className="card-desc">Parses native CSS rules with a sophisticated Flexbox styling algorithm. Style buttons, headers, panels, and canvases with simple CSS selectors.</div>
              </div>
              <div className="doc-card">
                <div className="card-icon"><Cpu size={20} /></div>
                <div className="card-title">Multi-Language Bindings</div>
                <div className="card-desc">Features a robust, stable C ABI (`fluxui_c.h`) that allows high-fidelity wrapper libraries for C++, Rust, and Zig without performance penalties.</div>
              </div>
            </div>

            <h2>📚 First-Class Support</h2>
            <p>
              FluxUI has official integrations and first-class toolchain bindings built to compile cleanly on Windows and Linux:
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', margin: '24px 0' }}>
              <div className="lang-badge cpp">C++ Core & Shared lib</div>
              <div className="lang-badge rust">Rust Native rlib (`rustc`)</div>
              <div className="lang-badge zig">Zig Built-in Module</div>
            </div>

            <div className="callout">
              <div className="callout-title">🚀 Vulkan By Default</div>
              <div className="callout-desc">
                By default, FluxUI compiles and runs using our state-of-the-art **Vulkan pipeline** (with standard automatic fallbacks). This delivers hardware-accelerated 2D canvas drawing and low-latency 3D render pipelines right out of the box.
              </div>
            </div>
          </section>
        );

      case 'setup':
        return (
          <section aria-labelledby="setup-title">
            <h1 id="setup-title">Installation & Quickstart</h1>
            <p>
              Setting up FluxUI is quick and fully automated. Our build system uses CMake and native compiler flags to generate libraries cleanly.
            </p>

            <h2>📦 Build Toolchain & Bindings</h2>
            <p>
              We have provided a fully automated PowerShell script `build_bindings.ps1` at the root of the workspace. It compiles the C++ Core dynamic library (`fluxui_shared.dll`), creates the Rust FFI bindings metadata file (`libfluxui.rlib`), and structures the Zig integration targets.
            </p>

            <div className="code-container">
              <div className="code-header">
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Automated Build Script (Windows Powershell)</span>
                <button className="copy-btn" onClick={() => handleCopy('powershell -File .\\build_bindings.ps1')} title="Copy Command">
                  {copiedText ? <Check size={16} color="var(--accent-primary)" /> : <Copy size={16} />}
                </button>
              </div>
              <pre className="code-body">
                <span className="hl-com"># Run this inside the project root directory</span>{"\n"}
                powershell -File .\build_bindings.ps1
              </pre>
            </div>

            <h2>🛡️ Manual Detailed Installation Steps</h2>
            <div className="step-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <div className="step-title">Compile C++ Shared Core</div>
                  <p>Configure with CMake and build using Release targets to generate `fluxui_shared.dll` and `fluxui_shared.lib` in the `build/Release` folder.</p>
                  <pre className="code-body" style={{ background: '#090b0e', padding: '16px', borderRadius: '8px' }}>
                    cmake -B build -S . -DCMAKE_BUILD_TYPE=Release{"\n"}
                    cmake --build build --config Release
                  </pre>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <div className="step-title">Generate Rust Library Metadata</div>
                  <p>Compile the Rust wrapper into a reusable static metadata library crate (`.rlib`):</p>
                  <pre className="code-body" style={{ background: '#090b0e', padding: '16px', borderRadius: '8px' }}>
                    C:\Users\Administrator\.cargo\bin\rustc.exe --crate-name fluxui --crate-type rlib bindings/rust/lib.rs -L native=build/Release -o build/Release/libfluxui.rlib
                  </pre>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <div className="step-title">Compile Your First App</div>
                  <p>Compile your app by pointing directly to the compiled metadata library crate (`libfluxui.rlib`):</p>
                  <pre className="code-body" style={{ background: '#090b0e', padding: '16px', borderRadius: '8px' }}>
                    C:\Users\Administrator\.cargo\bin\rustc.exe examples/rust/minimal.rs --extern fluxui=build/Release/libfluxui.rlib -L native=build/Release -o build/Release/rust_minimal.exe
                  </pre>
                </div>
              </div>
            </div>
          </section>
        );

      case 'tutorials':
        return (
          <section aria-labelledby="tutorials-title">
            <h1 id="tutorials-title">Tutorial: Multi-Language Quickstart</h1>
            <p>
              FluxUI has been designed to expose the exact same API signatures, layout objects, styling mechanics, and lifecycle hooks across C++, Rust, and Zig.
            </p>

            <div className="code-container">
              <div className="code-header">
                <div className="code-tabs">
                  <button 
                    className={`code-tab ${activeLangTab === 'rust' ? 'active' : ''}`}
                    onClick={() => setActiveLangTab('rust')}
                  >
                    Rust bindings
                  </button>
                  <button 
                    className={`code-tab ${activeLangTab === 'cpp' ? 'active' : ''}`}
                    onClick={() => setActiveLangTab('cpp')}
                  >
                    C++ Native
                  </button>
                  <button 
                    className={`code-tab ${activeLangTab === 'zig' ? 'active' : ''}`}
                    onClick={() => setActiveLangTab('zig')}
                  >
                    Zig Native
                  </button>
                </div>
                <button className="copy-btn" onClick={() => handleCopy(codeSnippets[activeLangTab])}>
                  {copiedText ? <Check size={16} color="var(--accent-primary)" /> : <Copy size={16} />}
                </button>
              </div>
              <pre className="code-body" style={{ maxHeight: '480px', overflowY: 'auto' }}>
                {codeSnippets[activeLangTab]}
              </pre>
            </div>

            <h2>🎨 Step-by-Step UI Design</h2>
            <p>
              Building a UI involves styling the layout container with standard CSS properties and adding structured controls.
            </p>
            <div className="step-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <div className="step-title">Load Fonts and Layout Rules</div>
                  <p>In all languages, start by calling `load_font` with a TrueType Font (TTF) and initialize your layouts using standard flex-grow, height, padding, gap, and alignment selectors.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <div className="step-title">Bind Actions</div>
                  <p>Bind functional event loops, clicks, or frame drawing timers to trigger native callbacks back into your compiled Rust / C++ / Zig loops seamlessly.</p>
                </div>
              </div>
            </div>
          </section>
        );

      case 'api':
        return (
          <section aria-labelledby="api-title">
            <h1 id="api-title">API & Component Reference</h1>
            <p>
              FluxUI's UI engine organizes UI elements inside a hierarchical tree structure called the **Layout Tree**, which parses styles and performs layouts inspired by the Chromium Blink rendering flow.
            </p>

            <h2>🌲 Core Classes</h2>
            
            <h3>1. `App`</h3>
            <p>Manages the application lifecycle, Vulkan context, window swapchains, event dispatching, and system font tables.</p>
            <ul>
              <li><strong>`App::create()`</strong>: Creates a new engine instance.</li>
              <li><strong>`App::init(title, width, height)`</strong>: Opens a window and initializes the GPU graphics context.</li>
              <li><strong>`App::add_stylesheet(css_rules)`</strong>: Feeds CSS properties into the layout parser.</li>
              <li><strong>`App::run()`</strong>: Starts the main desktop message loop and begins Vulkan swapchain presentation.</li>
            </ul>

            <h3>2. `Panel`</h3>
            <p>A modular container node, serving as the equivalent of a <code>{"<div>"}</code> element in HTML. Used for layout containers, cards, and custom canvas canvases.</p>
            <ul>
              <li><strong>`panel.add_panel(class_name)`</strong>: Inserts a child panel with a specific style selector.</li>
              <li><strong>`panel.add_text(label, class_name)`</strong>: Embeds stylized text strings inside the container.</li>
              <li><strong>`panel.add_button(label, class_name)`</strong>: Appends an interactive button with built-in click handlers.</li>
            </ul>

            <h3>3. `Button`</h3>
            <p>An interactive control widget with built-in hover and active visual state listeners.</p>
            <ul>
              <li><strong>`button.set_on_click_stop_app(&app)`</strong>: Triggers a clean application shutdown when clicked.</li>
            </ul>

            <h2>🎨 Supported CSS Properties</h2>
            <div className="callout important">
              <div className="callout-title">Flexbox CSS Parser</div>
              <div className="callout-desc">
                Our lightweight layout algorithm currently parses: `display` (flex/none), `flex-direction` (row/column), `flex-grow`, `padding`, `gap`, `margin-top`, `width`, `height`, `font-size`, `font-weight`, `color`, `background-color`, `border-radius`, and `border-color`.
              </div>
            </div>
          </section>
        );

      case 'roadmap':
        return (
          <section aria-labelledby="roadmap-title">
            <h1 id="roadmap-title">Future Project Roadmap</h1>
            <p>
              FluxUI is actively maintained and built for developers looking for high-performance alternatives to heavy Webview wrappers like Electron or heavy styling engines.
            </p>

            <div className="step-list">
              <div className="step-item">
                <div className="step-number">🚀</div>
                <div className="step-content">
                  <div className="step-title">Advanced CSS Animations</div>
                  <p>Incorporate hardware-accelerated CSS Transitions, CSS Transform matrix operations, and dynamic Bezier animation keyframe interpolation.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">⚡</div>
                <div className="step-content">
                  <div className="step-title">Multi-Backend Selectability (DirectX 12 & Metal)</div>
                  <p>Implement pluggable swapchains to optionally toggle between Vulkan, DX12 (for clean Windows-native deployment), and Metal (for macOS hardware acceleration).</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">🌐</div>
                <div className="step-content">
                  <div className="step-title">WebAssembly target (WASM + WebGL)</div>
                  <p>Port the core layout engine to WASM, compiling C++ directly to run within standard modern web browsers via high-speed WebGL2 canvases.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">🛠️</div>
                <div className="step-content">
                  <div className="step-title">Hot-Reloading Stylesheets</div>
                  <p>Support loading dynamic styling sheets from file paths that reload styles dynamically at runtime when editing files on disk without needing a rebuild.</p>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="layout-container">
      {/* Premium Glassmorphic Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-glow">F</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="logo-text">FluxUI</span>
              <span className="logo-badge">v1.4</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Vulkan Layout Engine</span>
          </div>
        </div>
        
        <nav className="nav-menu">
          <div className="nav-category">
            <span className="category-title">Getting Started</span>
            <button 
              className={`nav-link ${activeSection === 'intro' ? 'active' : ''}`}
              onClick={() => setActiveSection('intro')}
            >
              <BookOpen size={16} /> Introduction
            </button>
            <button 
              className={`nav-link ${activeSection === 'setup' ? 'active' : ''}`}
              onClick={() => setActiveSection('setup')}
            >
              <Terminal size={16} /> Setup & Installation
            </button>
          </div>

          <div className="nav-category">
            <span className="category-title">Integrations & Tutorials</span>
            <button 
              className={`nav-link ${activeSection === 'tutorials' ? 'active' : ''}`}
              onClick={() => setActiveSection('tutorials')}
            >
              <Code2 size={16} /> Multi-Language Guide
            </button>
            <button 
              className={`nav-link ${activeSection === 'api' ? 'active' : ''}`}
              onClick={() => setActiveSection('api')}
            >
              <Layers size={16} /> API & Widget Reference
            </button>
          </div>

          <div className="nav-category">
            <span className="category-title">Future Roadmap</span>
            <button 
              className={`nav-link ${activeSection === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveSection('roadmap')}
            >
              <Compass size={16} /> Project Roadmap
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content display */}
      <main className="main-content">
        <header className="top-navbar">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search documentation..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="top-actions">
            <button 
              className="github-btn" 
              onClick={() => window.open('https://github.com/camiloGHS21/DataleakGuard', '_blank')}
            >
              <GitBranch size={16} color="var(--accent-primary)" />
              <span>GitHub Repository</span>
            </button>
          </div>
        </header>
        
        <article className="page-body">
          {renderContent()}
        </article>

        <footer className="footer">
          <div>
            © {new Date().getFullYear()} <span className="footer-brand">FluxUI Project</span>. Built for high-performance GPU UI rendering.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Sparkles size={14} color="var(--accent-primary)" /> Vulkan Accelerated
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;

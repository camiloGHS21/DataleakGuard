import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Terminal as TerminalIcon, 
  Layers, 
  Compass, 
  Code2, 
  Check, 
  Copy, 
  Search, 
  GitBranch, 
  Cpu, 
  Settings, 
  Layout, 
  Zap, 
  CheckCircle,
  HelpCircle,
  FolderCode
} from 'lucide-react';

const codeSnippets = {
  rust: `// examples/rust/minimal.rs
extern crate fluxui;

use fluxui::{App, Backend};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Create a safe wrapper handle to the native FFI context
    let app = App::create()?;
    
    // 2. Select the hardware accelerated Vulkan rendering pipeline
    app.set_backend(Backend::Vulkan);
    
    // 3. Initialize SDL2 window hooks and swapchain render contexts
    app.init("FluxUI Production Rust Application", 1280, 720)?;
    
    // 4. Retrieve the opaque root widget handle from the retained tree
    let root = app.root();
    
    // 5. Append dynamic container layout node with custom CSS styles
    let container = root.add_panel("app-container");
    container.css("
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        padding: 40px;
        background-color: #050505;
    ");
    
    // 6. Embed structured headers and click listeners
    let header = container.add_text("FluxUI + Rust + Vulkan Core", "title-header");
    header.css("font-size: 24px; font-weight: 700; color: #ffffff;");
    
    let button = container.add_button("Execute Vector Search", "btn-action", || {
        println!("Vulkan pipeline triggered instanced draw batching!");
    });
    button.css("
        background-color: #ffffff;
        color: #000000;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 600;
    ");
    
    // 7. Dispatch events and run native window loop thread
    app.run();
    Ok(())
}`,
  cpp: `// examples/game_2d/main.cpp
#include "fluxui/FluxUI.h"
#include <iostream>

int main(int argc, char* argv[]) {
    // 1. Instantiation of standard native Application lifecycle controller
    FluxUI::Application app;
    
    // 2. Force hardware Vulkan command buffers for low-latency drawing
    app.setBackend(FluxUI::RenderBackendType::Vulkan);
    
    // 3. Bind events to logging callbacks
    app.on(FluxUI::UIEventType::RouteChanged, [](FluxUI::UIEvent& event) {
        std::cout << "Navigation Route mutated from: " 
                  << event.previousRoute << " -> " << event.route << "\\n";
    });
    
    // 4. Initialize physical display surface dimensions
    app.init("FluxUI Native C++ Performance Target", 1280, 720);
    
    // 5. Acquire root retained nodes from Arena allocation pool
    auto* root = app.getRoot();
    
    auto* wrapper = root->div("main-wrapper");
    wrapper->css("display: flex; flex-direction: column; padding: 24px; gap: 12px;");
    
    wrapper->h1("Direct Instanced Draw Lists", "section-title");
    wrapper->p("This dashboard bypasses GDI/Direct2D standard queues.", "subtitle");
    
    // 6. Push lazy widget node builders
    wrapper->button("Flush Render Queue", "btn btn-primary", [&app]() {
        std::cout << "Vulkan command buffer pool resetting fences...\\n";
    });
    
    // 7. Start application run loop
    app.run();
    return 0;
}`,
  zig: `// examples/zig/minimal.zig
const fluxui = @import("fluxui");
const std = @import("std");

pub fn main() !void {
    // 1. Create native application handle through Zig import table
    var app = try fluxui.App.create();
    defer app.destroy();
    
    // 2. Select default Vulkan backend preference
    _ = app.setBackend(.vulkan);
    
    // 3. Initialize OS window bindings and event loops
    try app.init("FluxUI Opaque Zig Target", 1280, 720);
    
    const root = app.root();
    
    // 4. Create and align panels using standard Flexbox layouts
    const panel = try root.addPanel("main-panel");
    try panel.css("
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        gap: 16px;
    ");
    
    // 5. Append stylable text and canvas resources
    _ = try panel.addText("Engine status: Hardware Accelerated", "status-label");
    
    // 6. Execute native run loop
    try app.run();
}`
};

function App() {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('intro');
  
  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };
  const [activeLangTab, setActiveLangTab] = useState('rust');
  const [copiedText, setCopiedText] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Interactive CLI Terminal Simulator State
  const [terminalCmd, setTerminalCmd] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([
    'FluxUI Native CLI Simulator. Select a command below to run.'
  ]);
  
  // Interactive Flexbox Sandbox State
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('space-between');
  const [alignItems, setAlignItems] = useState('center');
  const [gapSize, setGapSize] = useState('16px');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Run simulated commands in the developer terminal emulator
  const runTerminalCommand = (cmd) => {
    setTerminalCmd(cmd);
    setTerminalOutput(['Executing command...', '']);
    
    setTimeout(() => {
      if (cmd === 'probe') {
        setTerminalOutput([
          '> .\\build\\Release\\DataLeakGuard.exe --probe-vulkan',
          '==========================================================',
          '  FluxUI Vulkan Probe Target',
          '==========================================================',
          '[OK] Vulkan loader successfully detected.',
          '[OK] Found Vulkan Instance (v1.4.329).',
          '[OK] Surface Extensions configured successfully.',
          '[OK] Native Win32 window handles matched.',
          '[OK] Found compatible GPU: NVIDIA GeForce RTX 3050 Laptop GPU',
          '[SUCCESS] Vulkan physical hardware device and queues verified.',
          '=========================================================='
        ]);
      } else if (cmd === 'test-run') {
        setTerminalOutput([
          '> .\\build\\Release\\DataLeakGuard.exe --backend=vulkan --frames=3',
          '==========================================================',
          '  FluxUI Vulkan Test Frame Run (frames=3)',
          '==========================================================',
          '[INFO] Initializing Vulkan window (1280x720)...',
          '[INFO] glslang compiling shader pipelines in memory...',
          '[INFO] Vulkan Swapchain created with 3 images (Double-Buffered).',
          '[FRAME 1] Draw call batched: 24 rectangles, 8 text vertices.',
          '[FRAME 2] Render pass committed, Present Queue flushed.',
          '[FRAME 3] Render pass committed, present completed successfully.',
          '[SUCCESS] Core execution validated with 3 frame test run.',
          '=========================================================='
        ]);
      } else if (cmd === 'build-all') {
        setTerminalOutput([
          '> powershell -File .\\build_bindings.ps1',
          '[1/4] Configuring C++ Core Shared Libraries...',
          '  -> cmake configuration completed. MSBuild release compiled successfully.',
          '  -> build/Release/fluxui_shared.dll',
          '[2/4] Compiling Rust FFI bindings...',
          '  -> rustc --crate-name fluxui --crate-type rlib bindings/rust/lib.rs',
          '  -> build/Release/libfluxui.rlib',
          '  -> build/Release/rust_minimal.exe',
          '[3/4] Compiling Zig FFI bindings...',
          '  -> zig build-exe examples/zig/minimal.zig -lfluxui_shared',
          '  -> build/Release/minimal_zig.exe',
          '[SUCCESS] All bindings compiled and verified.'
        ]);
      } else {
        setTerminalOutput([
          '> .\\build\\Release\\DataLeakGuard.exe --help',
          'Usage: DataLeakGuard.exe [options]',
          '',
          'Options:',
          '  --probe-vulkan      Smoke test Vulkan runtime layers and exit.',
          '  --backend=<type>    Force a backend: [vulkan, d3d12, metal, compatibility].',
          '  --frames=<N>        Run the app through exactly N frames, then close cleanly.',
          '  --help              Display this menu.'
        ]);
      }
    }, 450);
  };

  // Substantive technical search engine index
  const docsIndex = [
    { id: 'intro', title: 'Architecture Deep-Dive & Threading Model', keywords: 'vulkan gpu core layers architecture swapchain spv spir-v blink GPUI zed design pipeline threads double-buffering queue fence' },
    { id: 'setup', title: 'Setup, Compilers & Toolchains', keywords: 'cmake install compilation msbuild build_bindings build powershell scripts toolchain release vcpkg' },
    { id: 'ffi', title: 'FFI C-ABI Specification', keywords: 'ffi c-abi bindings handles headers lifetime text-input pointers strings memory opaque widget' },
    { id: 'styling', title: 'Blink-Style Cascade & Specificity Rules', keywords: 'css selectors stylesheet specificity media rules pseudo function specificity is not where ancestor parent cascade' },
    { id: 'api-ref', title: 'Native API & Widget Reference', keywords: 'api reference cpp rust zig panels buttons text progressbar textinput canvas signatures methods' },
    { id: 'tutorials', title: 'Multi-Language Guide', keywords: 'rust cpp zig tutorial source minimal examples bindings' },
    { id: 'performance', title: 'Performance Architecture & Benchmarks', keywords: 'caching font uniform buffer vertex shadow lists table prebuild warming warmFontCache invalidation dirty' },
    { id: 'roadmap', title: 'Staging Roadmap & Core Parity', keywords: 'roadmap metal d3d12 directx12 wasm animations transforms metal d3d12 fallback' }
  ];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    } else {
      const filtered = docsIndex.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery]);

  const selectSearchResult = (sectionId) => {
    setActiveSection(sectionId);
    setSearchQuery('');
  };

  const getTOC = () => {
    switch (activeSection) {
      case 'intro':
        return [
          { id: 'overview', title: '1. Technical Overview' },
          { id: 'threading', title: '2. Threading & Frame Pacing' },
          { id: 'pipeline', title: '3. Vulkan Draw-Call Batching' },
          { id: 'comparison', title: '4. Parity Comparison Table' }
        ];
      case 'setup':
        return [
          { id: 'quick', title: '1. Quick Start' },
          { id: 'build-steps', title: '2. CMake Toolchains' },
          { id: 'preprocessor', title: '3. Preprocessor Config' }
        ];
      case 'ffi':
        return [
          { id: 'handles', title: '1. Opaque C-Handles' },
          { id: 'event-bus', title: '2. Event Registration' },
          { id: 'rules', title: '3. ABI Safety Rules' }
        ];
      case 'styling':
        return [
          { id: 'cascade', title: '1. Cascade Specificity' },
          { id: 'checker', title: '2. Sibling & Ancestral Walks' },
          { id: 'live-sandbox', title: '3. Interactive Flexbox' },
          { id: 'pseudos', title: '4. Selector Pseudo-Classes' },
          { id: 'media', title: '5. Dynamic Viewports' }
        ];
      case 'api-ref':
        return [
          { id: 'app-api', title: '1. Application Class' },
          { id: 'panel-api', title: '2. Panel Class' },
          { id: 'button-api', title: '3. Button Class' },
          { id: 'text-api', title: '4. Text Class' },
          { id: 'input-api', title: '5. TextInput Class' },
          { id: 'progress-api', title: '6. ProgressBar Class' }
        ];
      case 'tutorials':
        return [
          { id: 'rust-binder', title: '1. Rust Bindings' },
          { id: 'cpp-native', title: '2. C++ Production' },
          { id: 'zig-native', title: '3. Zig Modules' }
        ];
      case 'performance':
        return [
          { id: 'allocators', title: '1. Arena Allocators' },
          { id: 'caching-opt', title: '2. Style & Layout Caching' },
          { id: 'font-warm', title: '3. Font Atlas Warm Cache' }
        ];
      case 'roadmap':
        return [
          { id: 'staging-order', title: '1. Fallback Staging' },
          { id: 'milestones', title: '2. Future Milestones' }
        ];
      default:
        return [];
    }
  };

  const scrollToAnchor = (anchorId) => {
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="layout-container">
      {/* Hand-crafted Sidebar (Bun-inspired styling) */}
      <aside className="sidebar">
        <div className="logo-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="logo-text">FluxUI</span>
            <span className="logo-badge">v1.4</span>
          </div>
        </div>
        
        <nav className="nav-menu">
          <div className="nav-category">
            <span className="category-title">{t('nav.core_engine')}</span>
            <button 
              className={`nav-link ${activeSection === 'intro' ? 'active' : ''}`}
              onClick={() => setActiveSection('intro')}
            >
              <BookOpen size={15} /> {t('nav.intro')}
            </button>
            <button 
              className={`nav-link ${activeSection === 'setup' ? 'active' : ''}`}
              onClick={() => setActiveSection('setup')}
            >
              <Settings size={15} /> {t('nav.setup')}
            </button>
          </div>

          <div className="nav-category">
            <span className="category-title">{t('nav.language_bindings')}</span>
            <button 
              className={`nav-link ${activeSection === 'ffi' ? 'active' : ''}`}
              onClick={() => setActiveSection('ffi')}
            >
              <FolderCode size={15} /> {t('nav.ffi')}
            </button>
            <button 
              className={`nav-link ${activeSection === 'styling' ? 'active' : ''}`}
              onClick={() => setActiveSection('styling')}
            >
              <Layout size={15} /> {t('nav.styling')}
            </button>
            <button 
              className={`nav-link ${activeSection === 'api-ref' ? 'active' : ''}`}
              onClick={() => setActiveSection('api-ref')}
            >
              <Layers size={15} /> {t('nav.api_ref')}
            </button>
            <button 
              className={`nav-link ${activeSection === 'tutorials' ? 'active' : ''}`}
              onClick={() => setActiveSection('tutorials')}
            >
              <Code2 size={15} /> {t('nav.tutorials')}
            </button>
          </div>

          <div className="nav-category">
            <span className="category-title">{t('nav.deep_dive')}</span>
            <button 
              className={`nav-link ${activeSection === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveSection('performance')}
            >
              <Zap size={15} /> {t('nav.performance')}
            </button>
            <button 
              className={`nav-link ${activeSection === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveSection('roadmap')}
            >
              <Compass size={15} /> {t('nav.roadmap')}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        <header className="top-navbar">
          <div className="search-container">
            <div className="search-bar">
              <Search size={14} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder={t('header.search_placeholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="search-dropdown">
                <span className="category-title" style={{ padding: '4px 8px', display: 'block' }}>{t('header.search_results')}</span>
                {searchResults.map(result => (
                  <button 
                    key={result.id}
                    className="search-result-item"
                    onClick={() => selectSearchResult(result.id)}
                  >
                    <div style={{ fontWeight: '600', color: '#fff' }}>{t(`docs.${result.id}.title`)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t('header.keywords')}: {t(`docs.${result.id}.keywords`)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className="github-btn" 
              onClick={toggleLanguage}
              style={{ padding: '6px 10px', minWidth: '80px' }}
            >
              <Compass size={14} />
              <span>{i18n.language.startsWith('es') ? 'English' : 'Español'}</span>
            </button>

            <button 
              className="github-btn" 
              onClick={() => window.open('https://github.com/camiloGHS21/DataleakGuard', '_blank')}
            >
              <GitBranch size={14} />
              <span>camiloGHS21/DataleakGuard</span>
            </button>
          </div>
        </header>

        {/* Content Split Screen */}
        <div className="content-wrapper">
          <article className="page-body">
            
            {/* 1. INTRODUCTION SECTION */}
            {activeSection === 'intro' && (
              <section>
                <div id="overview">
                  <h1>{t('sections.intro.overview.title')}</h1>
                  <p style={{ fontSize: '16px', color: '#fff', fontWeight: '500' }}>
                    {t('sections.intro.overview.description')}
                  </p>
                  <p dangerouslySetInnerHTML={{ __html: t('sections.intro.overview.p1') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('sections.intro.overview.p2') }} />
                </div>

                {/* Hand-crafted CLI sandbox */}
                <div className="terminal-sandbox">
                  <div className="terminal-header">
                    <div className="terminal-dots">
                      <span className="terminal-dot red"></span>
                      <span className="terminal-dot yellow"></span>
                      <span className="terminal-dot green"></span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{t('sections.intro.terminal.filename')}</span>
                  </div>
                  <div className="terminal-body">
                    {terminalOutput.map((line, idx) => {
                      let displayLine = line;
                      if (line === 'Executing command...') displayLine = t('sections.intro.terminal.executing');
                      
                      return (
                        <div key={idx} style={{ color: displayLine.startsWith('>') ? '#fff' : displayLine.startsWith('[OK]') ? '#37c6a3' : displayLine.startsWith('[SUCCESS]') ? '#a855f7' : '#c5c5c5' }}>
                          {displayLine}
                        </div>
                      );
                    })}
                  </div>
                  <div className="terminal-options-grid">
                    <button className="terminal-opt-btn" onClick={() => runTerminalCommand('probe')}>
                      <TerminalIcon size={12} style={{ marginRight: '6px' }} /> {t('sections.intro.terminal.probe')}
                    </button>
                    <button className="terminal-opt-btn" onClick={() => runTerminalCommand('test-run')}>
                      <Cpu size={12} style={{ marginRight: '6px' }} /> {t('sections.intro.terminal.test_run')}
                    </button>
                    <button className="terminal-opt-btn" onClick={() => runTerminalCommand('build-all')}>
                      <Zap size={12} style={{ marginRight: '6px' }} /> {t('sections.intro.terminal.build_all')}
                    </button>
                    <button className="terminal-opt-btn" onClick={() => runTerminalCommand('help')}>
                      <HelpCircle size={12} style={{ marginRight: '6px' }} /> {t('sections.intro.terminal.help')}
                    </button>
                  </div>
                </div>

                <div id="threading">
                  <h2>{t('sections.intro.threading.title')}</h2>
                  <p>
                    {t('sections.intro.threading.p1')}
                  </p>
                  <ul>
                    <li>
                      <span dangerouslySetInnerHTML={{ __html: t('sections.intro.threading.app_thread') }} />
                    </li>
                    <li>
                      <span dangerouslySetInnerHTML={{ __html: t('sections.intro.threading.render_thread') }} />
                    </li>
                  </ul>
                  <p>
                    {t('sections.intro.threading.p2')}
                  </p>
                </div>

                <div id="pipeline">
                  <h2>{t('sections.intro.pipeline.title')}</h2>
                  <p>
                    {t('sections.intro.pipeline.p1')}
                  </p>
                  <p>
                    {t('sections.intro.pipeline.p2')}
                  </p>
                  <p>
                    {t('sections.intro.pipeline.p3')}
                  </p>
                </div>

                <div id="comparison">
                  <h2>{t('sections.intro.comparison.title')}</h2>
                  <p>
                    {t('sections.intro.comparison.p1')}
                  </p>
                  
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>{t('sections.intro.comparison.table.metric')}</th>
                          <th>{t('sections.intro.comparison.table.chromium')}</th>
                          <th>{t('sections.intro.comparison.table.flutter')}</th>
                          <th>{t('sections.intro.comparison.table.fluxui')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>{t('sections.intro.comparison.table.memory')}</strong></td>
                          <td>High (150MB - 400MB+)</td>
                          <td>Medium (80MB - 120MB)</td>
                          <td><span dangerouslySetInnerHTML={{ __html: t('sections.intro.comparison.table.memory_val') }} /></td>
                        </tr>
                        <tr>
                          <td><strong>{t('sections.intro.comparison.table.pipeline')}</strong></td>
                          <td>Skia / CPU-GPU Compositor</td>
                          <td>Impeller / Tessellation</td>
                          <td><span dangerouslySetInnerHTML={{ __html: t('sections.intro.comparison.table.pipeline_val') }} /></td>
                        </tr>
                        <tr>
                          <td><strong>{t('sections.intro.comparison.table.layout')}</strong></td>
                          <td>Blink C++ Flex/Grid Layout</td>
                          <td>Dart Widget Constraints</td>
                          <td><span dangerouslySetInnerHTML={{ __html: t('sections.intro.comparison.table.layout_val') }} /></td>
                        </tr>
                        <tr>
                          <td><strong>{t('sections.intro.comparison.table.bindings')}</strong></td>
                          <td>JavaScript / WebAssembly</td>
                          <td>Dart Only</td>
                          <td><span dangerouslySetInnerHTML={{ __html: t('sections.intro.comparison.table.bindings_val') }} /></td>
                        </tr>
                        <tr>
                          <td><strong>{t('sections.intro.comparison.table.overhead')}</strong></td>
                          <td>Very High (80MB+)</td>
                          <td>High (25MB+)</td>
                          <td><span dangerouslySetInnerHTML={{ __html: t('sections.intro.comparison.table.overhead_val') }} /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* 2. SETUP & COMPILATION SECTION */}
            {activeSection === 'setup' && (
              <section>
                <div id="quick">
                  <h1>{t('sections.setup.quick.title')}</h1>
                  <p>
                    {t('sections.setup.quick.p1')}
                  </p>

                  <div className="callout-box info">
                    <div className="callout-box-title">{t('sections.setup.quick.callout_title')}</div>
                    <div className="callout-box-desc">
                      {t('sections.setup.quick.callout_desc')}
                    </div>
                  </div>

                  <pre className="code-pre-box" style={{ backgroundColor: '#09090b', border: '1px solid var(--accent-border)', borderRadius: '6px', padding: '16px' }}>
                    <span className="hl-com">{t('sections.setup.quick.pre_comment')}</span>{"\n"}
                    powershell -File .\build_bindings.ps1
                  </pre>
                </div>

                <div id="build-steps">
                  <h2>{t('sections.setup.build_steps.title')}</h2>
                  
                  <h3>{t('sections.setup.build_steps.cpp_title')}</h3>
                  <p>
                    {t('sections.setup.build_steps.cpp_p1')}
                  </p>
                  <pre className="code-pre-box" style={{ backgroundColor: '#09090b', border: '1px solid var(--accent-border)', borderRadius: '6px', padding: '16px' }}>
                    cmake -B build -S . -DCMAKE_BUILD_TYPE=Release{"\n"}
                    cmake --build build --config Release
                  </pre>
                  <p>
                    {t('sections.setup.build_steps.cpp_output')}
                    <ul>
                      <li>{t('sections.setup.build_steps.cpp_list_1')}</li>
                      <li>{t('sections.setup.build_steps.cpp_list_2')}</li>
                    </ul>
                  </p>

                  <h3>{t('sections.setup.build_steps.rust_rlib_title')}</h3>
                  <p>
                    {t('sections.setup.build_steps.rust_rlib_p1')}
                  </p>
                  <pre className="code-pre-box" style={{ backgroundColor: '#09090b', border: '1px solid var(--accent-border)', borderRadius: '6px', padding: '16px' }}>
                    C:\Users\Administrator\.cargo\bin\rustc.exe --crate-name fluxui --crate-type rlib bindings/rust/lib.rs -L native=build/Release -o build/Release/libfluxui.rlib
                  </pre>

                  <h3>{t('sections.setup.build_steps.rust_ex_title')}</h3>
                  <p>
                    {t('sections.setup.build_steps.rust_ex_p1')}
                  </p>
                  <pre className="code-pre-box" style={{ backgroundColor: '#09090b', border: '1px solid var(--accent-border)', borderRadius: '6px', padding: '16px' }}>
                    C:\Users\Administrator\.cargo\bin\rustc.exe examples/rust/minimal.rs --extern fluxui=build/Release/libfluxui.rlib -L native=build/Release -o build/Release/rust_minimal.exe
                  </pre>
                </div>

                <div id="preprocessor">
                  <h2>{t('sections.setup.preprocessor.title')}</h2>
                  <p>
                    {t('sections.setup.preprocessor.p1')}
                  </p>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>{t('sections.setup.preprocessor.table.definition')}</th>
                          <th>{t('sections.setup.preprocessor.table.default')}</th>
                          <th>{t('sections.setup.preprocessor.table.impact')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>`FLUXUI_ENABLE_MSAA`</td>
                          <td>`ON`</td>
                          <td>{t('sections.setup.preprocessor.table.msaa')}</td>
                        </tr>
                        <tr>
                          <td>`FLUXUI_ENABLE_VSYNC`</td>
                          <td>`ON`</td>
                          <td>{t('sections.setup.preprocessor.table.vsync')}</td>
                        </tr>
                        <tr>
                          <td>`FLUXUI_FONT_GLYPH_LIMIT`</td>
                          <td>`384`</td>
                          <td>{t('sections.setup.preprocessor.table.font')}</td>
                        </tr>
                        <tr>
                          <td>`FLUXUI_DEFAULT_BACKEND`</td>
                          <td>`VULKAN`</td>
                          <td>{t('sections.setup.preprocessor.table.backend')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* 3. FFI C-ABI SPECIFICATION */}
            {activeSection === 'ffi' && (
              <section>
                <div id="handles">
                  <h1>{t('sections.ffi.handles.title')}</h1>
                  <p>
                    {t('sections.ffi.handles.p1')}
                  </p>
                  <p>
                    {t('sections.ffi.handles.p2')}
                  </p>
                  
                  <h3>{t('sections.ffi.handles.ref_title')}</h3>
                  <ul>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.ffi.handles.app_handle') }} /></li>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.ffi.handles.widget_handle') }} /></li>
                  </ul>
                </div>

                <div id="event-bus">
                  <h2>{t('sections.ffi.event_bus.title')}</h2>
                  <p>
                    {t('sections.ffi.event_bus.p1')}
                  </p>
                  
                  <pre className="code-pre-box" style={{ backgroundColor: '#09090b', border: '1px solid var(--accent-border)', borderRadius: '6px', padding: '16px' }}>
                    <span className="hl-com">{t('sections.ffi.event_bus.pre_comment')}</span>{"\n"}
                    <span className="hl-kw">typedef void</span> (*FluxUIEventCallback)(FluxUIApp* app, <span className="hl-kw">const</span> FluxUIEvent* event, <span className="hl-kw">void</span>* user_data);{"\n"}
                    {"\n"}
                    <span className="hl-fn">fluxui_app_on_event</span>(app, FLUXUI_EVENT_ROUTE_CHANGED, callback_fn, context_payload);
                  </pre>
                </div>

                <div id="rules">
                  <h2>{t('sections.ffi.rules.title')}</h2>
                  <p>
                    {t('sections.ffi.rules.p1')}
                  </p>
                  
                  <div className="step-list">
                    <div className="step-item">
                      <div className="step-number">A</div>
                      <div className="step-content">
                        <div className="step-title">{t('sections.ffi.rules.step_a_title')}</div>
                        <p>{t('sections.ffi.rules.step_a_p')}</p>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">B</div>
                      <div className="step-content">
                        <div className="step-title">{t('sections.ffi.rules.step_b_title')}</div>
                        <p>{t('sections.ffi.rules.step_b_p')}</p>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">C</div>
                      <div className="step-content">
                        <div className="step-title">{t('sections.ffi.rules.step_c_title')}</div>
                        <p>{t('sections.ffi.rules.step_c_p')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 4. BLINK-STYLE CSS & CASCADE */}
            {activeSection === 'styling' && (
              <section>
                <div id="cascade">
                  <h1>{t('sections.styling.cascade.title')}</h1>
                  <p>
                    {t('sections.styling.cascade.p1')}
                  </p>
                  
                  <h2>{t('sections.styling.cascade.rules_title')}</h2>
                  <p>
                    {t('sections.styling.cascade.rules_p')}
                  </p>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>{t('sections.styling.cascade.table.type')}</th>
                          <th>{t('sections.styling.cascade.table.weight')}</th>
                          <th>{t('sections.styling.cascade.table.example')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>{t('sections.styling.cascade.table.inline')}</strong></td>
                          <td>1000</td>
                          <td><code>{"widget->css(\"color: #fff;\")"}</code></td>
                        </tr>
                        <tr>
                          <td><strong>{t('sections.styling.cascade.table.id')}</strong></td>
                          <td>100</td>
                          <td>`#primary-header`</td>
                        </tr>
                        <tr>
                          <td><strong>{t('sections.styling.cascade.table.class')}</strong></td>
                          <td>10</td>
                          <td>`.btn`, `.danger`</td>
                        </tr>
                        <tr>
                          <td><strong>{t('sections.styling.cascade.table.type_sel')}</strong></td>
                          <td>1</td>
                          <td>`h1`, `button`</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div id="combinators">
                  <h2>{t('sections.styling.combinators.title')}</h2>
                  <p>
                    {t('sections.styling.combinators.p1')}
                  </p>
                  <ul>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.styling.combinators.descendant') }} /></li>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.styling.combinators.child') }} /></li>
                  </ul>
                </div>

                {/* Live Sandbox Playground */}
                <div className="sandbox-card" id="live-sandbox">
                  <h3>{t('sections.styling.live_sandbox.title')}</h3>
                  <p>
                    {t('sections.styling.live_sandbox.p1')}
                  </p>
                  
                  <div className="sandbox-preview-win">
                    <div style={{
                      display: 'flex',
                      flexDirection: flexDirection,
                      justifyContent: justifyContent,
                      alignItems: alignItems,
                      gap: gapSize,
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#0c0f12',
                      border: '1px solid #1a222a',
                      borderRadius: '8px',
                      minHeight: '120px'
                    }}>
                      <div className="preview-badge">{t('sections.styling.live_sandbox.card1')}</div>
                      <div className="preview-badge" style={{ padding: '12px 8px' }}>{t('sections.styling.live_sandbox.card2')}</div>
                      <div className="preview-badge">{t('sections.styling.live_sandbox.card3')}</div>
                    </div>
                  </div>

                  <div className="sandbox-controls">
                    <div>
                      <span style={{ marginRight: '8px', color: 'var(--text-muted)' }}>flex-direction:</span>
                      <select 
                        value={flexDirection} 
                        onChange={(e) => setFlexDirection(e.target.value)}
                        style={{ background: '#121212', border: '1px solid #333', color: '#fff', padding: '4px', borderRadius: '4px' }}
                      >
                        <option value="row">row</option>
                        <option value="column">column</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ marginRight: '8px', color: 'var(--text-muted)' }}>justify-content:</span>
                      <select 
                        value={justifyContent} 
                        onChange={(e) => setJustifyContent(e.target.value)}
                        style={{ background: '#121212', border: '1px solid #333', color: '#fff', padding: '4px', borderRadius: '4px' }}
                      >
                        <option value="space-between">space-between</option>
                        <option value="center">center</option>
                        <option value="flex-start">flex-start</option>
                        <option value="flex-end">flex-end</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ marginRight: '8px', color: 'var(--text-muted)' }}>align-items:</span>
                      <select 
                        value={alignItems} 
                        onChange={(e) => setAlignItems(e.target.value)}
                        style={{ background: '#121212', border: '1px solid #333', color: '#fff', padding: '4px', borderRadius: '4px' }}
                      >
                        <option value="center">center</option>
                        <option value="flex-start">flex-start</option>
                        <option value="flex-end">flex-end</option>
                        <option value="stretch">stretch</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ marginRight: '8px', color: 'var(--text-muted)' }}>gap:</span>
                      <select 
                        value={gapSize} 
                        onChange={(e) => setGapSize(e.target.value)}
                        style={{ background: '#121212', border: '1px solid #333', color: '#fff', padding: '4px', borderRadius: '4px' }}
                      >
                        <option value="8px">8px</option>
                        <option value="16px">16px</option>
                        <option value="24px">24px</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div id="pseudos">
                  <h2>{t('sections.styling.pseudos.title')}</h2>
                  <p>
                    {t('sections.styling.pseudos.p1')}
                  </p>
                  <ul>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.styling.pseudos.is') }} /></li>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.styling.pseudos.not') }} /></li>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.styling.pseudos.where') }} /></li>
                  </ul>
                </div>

                <div id="media">
                  <h2>{t('sections.styling.media.title')}</h2>
                  <p>
                    {t('sections.styling.media.p1')}
                  </p>
                  <pre className="code-pre-box" style={{ backgroundColor: '#09090b', border: '1px solid var(--accent-border)', borderRadius: '6px', padding: '16px' }}>
                    <span className="hl-kw">@media screen and</span> (max-width: 900px) {"{"}{"\n"}
                    {"  "}<span className="hl-cls">.sidebar</span> {"{"} display: none; {"}"}{"\n"}
                    {"}"}
                  </pre>
                </div>
              </section>
            )}

            {/* 5. NATIVE WIDGET REFERENCE (NEW EXHAUSTIVE SECTION) */}
            {activeSection === 'api-ref' && (
              <section>
                <h1>{t('sections.api_ref.title')}</h1>
                <p>
                  {t('sections.api_ref.p1')}
                </p>

                <div id="app-api">
                  <h2>{t('sections.api_ref.app.title')}</h2>
                  <p>{t('sections.api_ref.app.p1')}</p>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>C++ Signature</th>
                          <th>Rust Signature</th>
                          <th>Zig Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>{"void init(const char*, int, int)"}</code></td>
                          <td><code>{"app.init(&str, u32, u32) -> Result"}</code></td>
                          <td><code>{"try app.init([]const u8, u32, u32)"}</code></td>
                        </tr>
                        <tr>
                          <td><code>{"void run()"}</code></td>
                          <td><code>{"app.run()"}</code></td>
                          <td><code>{"try app.run()"}</code></td>
                        </tr>
                        <tr>
                          <td><code>{"Widget* getRoot()"}</code></td>
                          <td><code>{"app.root() -> Widget"}</code></td>
                          <td><code>{"app.root() Widget"}</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div id="panel-api">
                  <h2>{t('sections.api_ref.panel.title')}</h2>
                  <p>{t('sections.api_ref.panel.p1')}</p>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>C++ Signature</th>
                          <th>Rust Signature</th>
                          <th>Zig Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>{"Panel* div(const char*, int)"}</code></td>
                          <td><code>{"panel.add_panel(&str) -> Panel"}</code></td>
                          <td><code>{"try panel.addPanel([]const u8) Panel"}</code></td>
                        </tr>
                        <tr>
                          <td><code>{"void css(const char*)"}</code></td>
                          <td><code>{"panel.css(&str)"}</code></td>
                          <td><code>{"try panel.css([]const u8)"}</code></td>
                        </tr>
                        <tr>
                          <td><code>{"void addClass(const char*)"}</code></td>
                          <td><code>{"panel.addClass(&str)"}</code></td>
                          <td><code>{"try panel.addClass([]const u8)"}</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div id="button-api">
                  <h2>{t('sections.api_ref.button.title')}</h2>
                  <p>{t('sections.api_ref.button.p1')}</p>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>C++ Signature</th>
                          <th>Rust Signature</th>
                          <th>Zig Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>{"Button* button(const char*, const char*, Fn)"}</code></td>
                          <td><code>{"panel.add_button(&str, &str, Fn)"}</code></td>
                          <td><code>{"try panel.addButton([]const u8, Fn)"}</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div id="text-api">
                  <h2>{t('sections.api_ref.text.title')}</h2>
                  <p>{t('sections.api_ref.text.p1')}</p>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>C++ Signature</th>
                          <th>Rust Signature</th>
                          <th>Zig Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>{"Text* p(const char*, const char*)"}</code></td>
                          <td><code>{"panel.add_text(&str, &str) -> Text"}</code></td>
                          <td><code>{"try panel.addText([]const u8, []const u8)"}</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div id="input-api">
                  <h2>{t('sections.api_ref.input.title')}</h2>
                  <p>{t('sections.api_ref.input.p1')}</p>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>C++ Signature</th>
                          <th>Rust Signature</th>
                          <th>Zig Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>{"const char* getValue()"}</code></td>
                          <td><code>{"input.get_value() -> &str"}</code></td>
                          <td><code>{"input.getValue() []const u8"}</code></td>
                        </tr>
                        <tr>
                          <td><code>{"void setValue(const char*)"}</code></td>
                          <td><code>{"input.set_value(&str)"}</code></td>
                          <td><code>{"try input.setValue([]const u8)"}</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div id="progress-api">
                  <h2>{t('sections.api_ref.progress.title')}</h2>
                  <p>{t('sections.api_ref.progress.p1')}</p>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>C++ Signature</th>
                          <th>Rust Signature</th>
                          <th>Zig Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>{"void setProgress(float)"}</code></td>
                          <td><code>{"bar.set_progress(f32)"}</code></td>
                          <td><code>{"bar.setProgress(f32)"}</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* 6. MULTI-LANGUAGE GUIDE */}
            {activeSection === 'tutorials' && (
              <section>
                <h1 id="tutorials-header">{t('sections.tutorials.title')}</h1>
                <p>
                  {t('sections.tutorials.p1')}
                </p>

                <div className="code-wrapper">
                  <div className="code-tabs-header">
                    <div className="lang-tabs">
                      <button 
                        className={`lang-tab ${activeLangTab === 'rust' ? 'active' : ''}`}
                        onClick={() => setActiveLangTab('rust')}
                      >
                        Rust
                      </button>
                      <button 
                        className={`lang-tab ${activeLangTab === 'cpp' ? 'active' : ''}`}
                        onClick={() => setActiveLangTab('cpp')}
                      >
                        C++ Native
                      </button>
                      <button 
                        className={`lang-tab ${activeLangTab === 'zig' ? 'active' : ''}`}
                        onClick={() => setActiveLangTab('zig')}
                      >
                        Zig
                      </button>
                    </div>
                    <button className="copy-btn" onClick={() => handleCopy(codeSnippets[activeLangTab])}>
                      {copiedText ? <Check size={14} color="var(--accent-primary)" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <pre className="code-pre-box" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                    {codeSnippets[activeLangTab]}
                  </pre>
                </div>

                <div id="rust-binder">
                  <h2>{t('sections.tutorials.rust.title')}</h2>
                  <p>
                    {t('sections.tutorials.rust.p1')}
                  </p>
                </div>

                <div id="cpp-native">
                  <h2>{t('sections.tutorials.cpp.title')}</h2>
                  <p>
                    {t('sections.tutorials.cpp.p1')}
                  </p>
                </div>

                <div id="zig-native">
                  <h2>{t('sections.tutorials.zig.title')}</h2>
                  <p>
                    {t('sections.tutorials.zig.p1')}
                  </p>
                </div>
              </section>
            )}

            {/* 7. PERFORMANCE WORK LANDED */}
            {activeSection === 'performance' && (
              <section>
                <div id="allocators">
                  <h1>{t('sections.performance.title')}</h1>
                  <p>
                    {t('sections.performance.p1')}
                  </p>

                  <h2>{t('sections.performance.allocators.title')}</h2>
                  <p>
                    {t('sections.performance.allocators.p1')}
                  </p>
                  <p>
                    {t('sections.performance.allocators.p2')}
                  </p>
                </div>

                <div id="caching-opt">
                  <h2>{t('sections.performance.caching.title')}</h2>
                  <p>
                    {t('sections.performance.caching.p1')}
                  </p>
                  <ul>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.performance.caching.dirty') }} /></li>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.performance.caching.align') }} /></li>
                  </ul>
                </div>

                <div id="font-warm">
                  <h2>{t('sections.performance.font.title')}</h2>
                  <p>
                    {t('sections.performance.font.p1')}
                  </p>
                  <pre className="code-pre-box" style={{ backgroundColor: '#09090b', border: '1px solid var(--accent-border)', borderRadius: '6px', padding: '16px' }}>
                    <span className="hl-com">{t('sections.performance.font.comment1')}</span>{"\n"}
                    app.renderer-&gt;<span className="hl-fn">warmFontCache</span>();{"\n"}
                    <span className="hl-com">{t('sections.performance.font.comment2')}</span>{"\n"}
                    app.renderer-&gt;<span className="hl-fn">releaseFontSources</span>();
                  </pre>
                </div>
              </section>
            )}

            {/* 8. ROADMAP & FUTURE WORK */}
            {activeSection === 'roadmap' && (
              <section>
                <div id="staging-order">
                  <h1>{t('sections.roadmap.title')}</h1>
                  <p>
                    {t('sections.roadmap.p1')}
                  </p>

                  <h2>{t('sections.roadmap.backends.title')}</h2>
                  <p>
                    {t('sections.roadmap.backends.p1')}
                  </p>
                  <div className="step-list">
                    <div className="step-item">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <div className="step-title">{t('sections.roadmap.backends.vulkan_title')}</div>
                        <p>{t('sections.roadmap.backends.vulkan_p')}</p>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <div className="step-title">{t('sections.roadmap.backends.dx_title')}</div>
                        <p>{t('sections.roadmap.backends.dx_p')}</p>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <div className="step-title">{t('sections.roadmap.backends.compat_title')}</div>
                        <p>{t('sections.roadmap.backends.compat_p')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="milestones">
                  <h2>{t('sections.roadmap.milestones.title')}</h2>
                  <ul>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.roadmap.milestones.keyframes') }} /></li>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.roadmap.milestones.wasm') }} /></li>
                    <li><span dangerouslySetInnerHTML={{ __html: t('sections.roadmap.milestones.hot_reload') }} /></li>
                  </ul>
                </div>
              </section>
            )}

          </article>

          {/* Table of Contents pane (Bun-style) */}
          <aside className="toc-pane">
            <div className="toc-title">{t('common.on_this_page')}</div>
            {getTOC().map(item => (
              <button 
                key={item.id}
                className="toc-link"
                onClick={() => scrollToAnchor(item.id)}
                style={{ background: 'none', border: 'none', textAlign: 'left', display: 'block', width: '100%' }}
              >
                {t(`toc.${activeSection}.${item.id}`)}
              </button>
            ))}
          </aside>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Vulkan 1.4</span>
            <a href="https://github.com/camiloGHS21/DataleakGuard" className="footer-link" target="_blank" rel="noreferrer">{t('footer.github')}</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;

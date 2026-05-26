// FluxUI - GPU-Accelerated UI Framework with CSS Styling
// Copyright (c) 2026 - MIT License
#pragma once
#include "fluxui/renderer.h"
#include <vector>
#include <mutex>
#include <thread>
#include <atomic>
#include <condition_variable>

namespace FluxUI {

// PaintRecord behaves exactly like Blink's cc::PaintRecord / DisplayList,
// containing a list of recorded RenderCommands that can be serialized/swapped
// to the Compositor Thread without locking the Main Thread.
class PaintRecord {
private:
    std::vector<RenderCommand> commands_;

public:
    PaintRecord() = default;
    ~PaintRecord() = default;

    void addCommand(const RenderCommand& cmd) {
        commands_.push_back(cmd);
    }

    void clear() {
        commands_.clear();
    }

    const std::vector<RenderCommand>& getCommands() const {
        return commands_;
    }

    std::vector<RenderCommand>& getCommands() {
        return commands_;
    }

    bool empty() const {
        return commands_.empty();
    }

    void swap(PaintRecord& other) {
        commands_.swap(other.commands_);
    }
};

// ThreadedCompositor runs a dedicated compositor thread that executes
// OpenGL/Vulkan GPU drawing calls from committed PaintRecords.
class ThreadedCompositor {
private:
    std::thread compositorThread_;
    std::atomic<bool> running_{false};
    std::mutex mutex_;
    std::condition_variable cv_;

    // Double buffering for thread-safe display list commits
    PaintRecord activeRecord_;
    PaintRecord pendingRecord_;
    bool hasNewRecord_ = false;

    Renderer* renderer_ = nullptr;
    void* windowHandle_ = nullptr;

public:
    ThreadedCompositor() = default;
    ~ThreadedCompositor() {
        stop();
    }

    static ThreadedCompositor& instance() {
        static ThreadedCompositor inst;
        return inst;
    }

    void init(Renderer* renderer, void* windowHandle) {
        renderer_ = renderer;
        windowHandle_ = windowHandle;
    }

    void start() {
        if (running_.exchange(true)) return;
        compositorThread_ = std::thread(&ThreadedCompositor::compositorLoop, this);
    }

    void stop() {
        if (!running_.exchange(false)) return;
        {
            std::lock_guard<std::mutex> lock(mutex_);
            cv_.notify_one();
        }
        if (compositorThread_.joinable()) {
            compositorThread_.join();
        }
    }

    // Main thread commits a completed frame recording to the compositor
    void commitFrame(PaintRecord& record) {
        std::lock_guard<std::mutex> lock(mutex_);
        pendingRecord_.clear();
        pendingRecord_.swap(record); // O(1) swap
        hasNewRecord_ = true;
        cv_.notify_one();
    }

private:
    void compositorLoop() {
        // GPU context binding must happen on the compositor thread in a multi-threaded system
        // Note: For compatibility, if the GPU backend is single-threaded, we can also perform
        // inline drawing in response to ticks.
        while (running_) {
            PaintRecord currentFrame;
            {
                std::unique_lock<std::mutex> lock(mutex_);
                cv_.wait(lock, [this]() { return !running_ || hasNewRecord_; });

                if (!running_) break;

                // Swap pending frame to active display list
                activeRecord_.swap(pendingRecord_);
                hasNewRecord_ = false;

                // Make a thread-local copy or swap so we release the mutex instantly
                currentFrame.swap(activeRecord_);
            }

            if (renderer_ && !currentFrame.empty()) {
                // Rasterize the display list on the GPU/Compositor thread
                int w = 0, h = 0;
                Vec2 size = renderer_->getWindowSize();
                w = static_cast<int>(size.x);
                h = static_cast<int>(size.y);

                renderer_->beginFrame(w, h);

                // Playback recorded PaintRecord
                for (const auto& cmd : currentFrame.getCommands()) {
                    playbackCommand(cmd);
                }

                renderer_->endFrame();
            }

            // Target ~120 FPS presentation loop
            std::this_thread::sleep_for(std::chrono::milliseconds(8));
        }
    }

    void playbackCommand(const RenderCommand& cmd) {
        if (!renderer_) return;

        switch (cmd.type) {
            case RenderCommandType::RoundedRect:
                if (cmd.hasGradient) {
                    renderer_->drawRoundedRectGradient(cmd.rect, cmd.gradient, cmd.radius, cmd.opacity);
                } else {
                    renderer_->drawRoundedRect(cmd.rect, cmd.color, cmd.radius, cmd.opacity);
                }
                if (cmd.hasBorder) {
                    renderer_->drawBorder(cmd.rect, cmd.border, cmd.radius);
                }
                break;
            case RenderCommandType::Text:
                renderer_->drawText(cmd.text, cmd.rect.position(), cmd.color, cmd.fontSize, cmd.fontWeight);
                break;
            case RenderCommandType::TexturedQuad:
                renderer_->drawImage("", cmd.rect, cmd.opacity, cmd.color);
                break;
            case RenderCommandType::Scissor:
                renderer_->pushScissor(cmd.scissorRect);
                break;
            case RenderCommandType::ScissorPop:
                renderer_->popScissor();
                break;
        }
    }
};

} // namespace FluxUI

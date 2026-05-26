#pragma once
#include <glad/gl.h>
#include <iostream>

namespace FluxUI {

    class GPUPaintLayer {
    public:
        GPUPaintLayer() = default;
        ~GPUPaintLayer() {
            release();
        }

        void release() {
            if (glad_glDeleteFramebuffers != nullptr) {
                if (fbo_ != 0 && fbo_ != 999) {
                    glDeleteFramebuffers(1, &fbo_);
                }
            }
            if (glad_glDeleteTextures != nullptr) {
                if (textureId_ != 0 && textureId_ != 999) {
                    glDeleteTextures(1, &textureId_);
                }
            }
            fbo_ = 0;
            textureId_ = 0;
            width_ = 0;
            height_ = 0;
            layerPaintDirty_ = true;
        }

        void resize(int w, int h) {
            if (w == width_ && h == height_ && fbo_ != 0) {
                return;
            }
            release();

            if (w <= 0 || h <= 0) return;

            width_ = w;
            height_ = h;

            if (glad_glGenFramebuffers == nullptr) {
                // If OpenGL context is not initialized (headless or CPU mode), 
                // assign dummy non-zero IDs to allow offline layout/paint tests.
                fbo_ = 999;
                textureId_ = 999;
                layerPaintDirty_ = true;
                return;
            }

            glGenFramebuffers(1, &fbo_);
            glBindFramebuffer(GL_FRAMEBUFFER, fbo_);

            glGenTextures(1, &textureId_);
            glBindTexture(GL_TEXTURE_2D, textureId_);
            glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, w, h, 0, GL_RGBA, GL_UNSIGNED_BYTE, nullptr);
            
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

            glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, textureId_, 0);

            GLenum status = glCheckFramebufferStatus(GL_FRAMEBUFFER);
            if (status != GL_FRAMEBUFFER_COMPLETE) {
                std::cerr << "[GPUPaintLayer] Error: Framebuffer is not complete: " << status << "\n";
            }

            glBindFramebuffer(GL_FRAMEBUFFER, 0);
            layerPaintDirty_ = true;
        }

        uint32_t fbo() const { return fbo_; }
        uint32_t textureId() const { return textureId_; }
        int width() const { return width_; }
        int height() const { return height_; }
        bool isDirty() const { return layerPaintDirty_; }
        void markDirty() { layerPaintDirty_ = true; }
        void markClean() { layerPaintDirty_ = false; }

    private:
        uint32_t fbo_ = 0;
        uint32_t textureId_ = 0;
        int width_ = 0;
        int height_ = 0;
        bool layerPaintDirty_ = true;
    };

} // namespace FluxUI

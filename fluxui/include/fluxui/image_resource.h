// FluxUI Image Resource System — Blink-aligned image loading pipeline
// Architecture mirrors: blink/renderer/core/loader/resource/image_resource.h
//                       blink/renderer/platform/graphics/image.h
//                       blink/renderer/core/svg/svg_image_element.h
#pragma once

#include "core.h"
#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <cstdint>
#include <functional>

namespace FluxUI {

// ============================================================
//  Image Loading States (mirrors Blink ResourceStatus)
// ============================================================

enum class ImageLoadState {
    NotStarted,   // No load attempted
    Pending,      // Load requested, waiting for data
    Loading,      // Data arriving
    Decoded,      // Pixel data available (CPU-side)
    Uploaded,     // GPU texture created
    Error         // Load or decode failed
};

// ============================================================
//  ImageDecoder — format detection & pixel decoding
//  (mirrors blink/renderer/platform/image-decoders/)
// ============================================================

enum class ImageFormat {
    Unknown,
    PNG,
    JPEG,
    BMP,
    GIF,
    HDR,
    TGA,
    PSD,
    SVG
};

ImageFormat detectImageFormat(const unsigned char* data, int dataSize);

// ============================================================
//  DecodedImageData — raw RGBA8 pixels + metadata
//  (mirrors blink::DecodedImageData / SkBitmap backing)
// ============================================================

struct DecodedImageData {
    int width = 0;
    int height = 0;
    int channels = 4;          // Always RGBA after decode
    bool premultiplied = false; // Premultiplied alpha
    std::vector<unsigned char> pixels;

    bool valid() const { return width > 0 && height > 0 && !pixels.empty(); }
    size_t byteSize() const { return (size_t)width * height * channels; }
};

// ============================================================
//  SVG DOM Elements — Blink-style per-shape classes
//  (mirrors blink/renderer/core/svg/svg_*_element.h)
// ============================================================

// Forward declarations for the SVG paint context
struct SVGPaintState {
    Color fill = Color(0, 0, 0, 1);
    Color stroke = Color(0, 0, 0, 0);
    float strokeWidth = 1.0f;
    float opacity = 1.0f;
    float fillOpacity = 1.0f;
    float strokeOpacity = 1.0f;
    bool noFill = false;
    bool noStroke = false;
};

// 2x3 affine transform (like SVGTransform in Blink)
struct SVGTransform {
    float a = 1, b = 0, c = 0, d = 1, e = 0, f = 0;

    SVGTransform() = default;
    SVGTransform(float a, float b, float c, float d, float e, float f)
        : a(a), b(b), c(c), d(d), e(e), f(f) {}

    static SVGTransform identity() { return {}; }
    static SVGTransform translate(float tx, float ty) { return {1, 0, 0, 1, tx, ty}; }
    static SVGTransform scale(float sx, float sy) { return {sx, 0, 0, sy, 0, 0}; }
    static SVGTransform rotate(float angleDeg);

    Vec2 apply(Vec2 p) const {
        return { a * p.x + c * p.y + e, b * p.x + d * p.y + f };
    }

    SVGTransform multiply(const SVGTransform& o) const {
        return {
            a * o.a + c * o.b,
            b * o.a + d * o.b,
            a * o.c + c * o.d,
            b * o.c + d * o.d,
            a * o.e + c * o.f + e,
            b * o.e + d * o.f + f
        };
    }
};

// preserveAspectRatio (mirrors blink::SVGPreserveAspectRatio)
enum class SVGAlign {
    None,           // none — stretch to fill viewBox
    XMinYMin,
    XMidYMin,
    XMaxYMin,
    XMinYMid,
    XMidYMid,       // default
    XMaxYMid,
    XMinYMax,
    XMidYMax,
    XMaxYMax
};

enum class SVGMeetOrSlice {
    Meet,           // default — contain
    Slice           // cover
};

struct SVGPreserveAspectRatio {
    SVGAlign align = SVGAlign::XMidYMid;
    SVGMeetOrSlice meetOrSlice = SVGMeetOrSlice::Meet;

    // Compute the viewport → viewBox transform
    SVGTransform computeTransform(float viewportW, float viewportH,
                                  float viewBoxX, float viewBoxY,
                                  float viewBoxW, float viewBoxH) const;
};

// Base SVG element (mirrors blink::SVGElement)
class SVGElement {
public:
    virtual ~SVGElement() = default;

    std::string id;
    SVGPaintState paint;
    SVGTransform transform;
    bool hasTransform = false;

    virtual void rasterize(DecodedImageData& canvas,
                           const SVGTransform& parentTransform,
                           float canvasScaleX, float canvasScaleY,
                           float viewX, float viewY) const = 0;
};

// Individual SVG shape elements (mirrors blink::SVGRectElement, etc.)
class SVGRectElement : public SVGElement {
public:
    float x = 0, y = 0, width = 0, height = 0;
    float rx = 0, ry = 0;
    void rasterize(DecodedImageData& canvas,
                   const SVGTransform& parentTransform,
                   float canvasScaleX, float canvasScaleY,
                   float viewX, float viewY) const override;
};

class SVGCircleElement : public SVGElement {
public:
    float cx = 0, cy = 0, r = 0;
    void rasterize(DecodedImageData& canvas,
                   const SVGTransform& parentTransform,
                   float canvasScaleX, float canvasScaleY,
                   float viewX, float viewY) const override;
};

class SVGEllipseElement : public SVGElement {
public:
    float cx = 0, cy = 0, rx = 0, ry = 0;
    void rasterize(DecodedImageData& canvas,
                   const SVGTransform& parentTransform,
                   float canvasScaleX, float canvasScaleY,
                   float viewX, float viewY) const override;
};

class SVGLineElement : public SVGElement {
public:
    float x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    void rasterize(DecodedImageData& canvas,
                   const SVGTransform& parentTransform,
                   float canvasScaleX, float canvasScaleY,
                   float viewX, float viewY) const override;
};

class SVGPolylineElement : public SVGElement {
public:
    std::vector<Vec2> points;
    bool closed = false;  // polyline vs polygon
    void rasterize(DecodedImageData& canvas,
                   const SVGTransform& parentTransform,
                   float canvasScaleX, float canvasScaleY,
                   float viewX, float viewY) const override;
};

class SVGPathElement : public SVGElement {
public:
    std::string d;   // path data string
    void rasterize(DecodedImageData& canvas,
                   const SVGTransform& parentTransform,
                   float canvasScaleX, float canvasScaleY,
                   float viewX, float viewY) const override;
};

class SVGGroupElement : public SVGElement {
public:
    std::vector<std::unique_ptr<SVGElement>> children;
    void rasterize(DecodedImageData& canvas,
                   const SVGTransform& parentTransform,
                   float canvasScaleX, float canvasScaleY,
                   float viewX, float viewY) const override;
};

class SVGTextElement : public SVGElement {
public:
    float x = 0, y = 0;
    float fontSize = 16.0f;
    std::string content;
    void rasterize(DecodedImageData& canvas,
                   const SVGTransform& parentTransform,
                   float canvasScaleX, float canvasScaleY,
                   float viewX, float viewY) const override;
};

// ============================================================
//  SVGDocument — parsed SVG DOM tree
//  (mirrors blink::SVGSVGElement as document root)
// ============================================================

struct SVGDocument {
    float width = 0, height = 0;
    float viewBoxX = 0, viewBoxY = 0, viewBoxW = 0, viewBoxH = 0;
    SVGPreserveAspectRatio preserveAspectRatio;
    SVGPaintState rootPaint;
    std::vector<std::unique_ptr<SVGElement>> elements;

    // Parse SVG XML into the DOM tree
    static std::unique_ptr<SVGDocument> parse(const unsigned char* data, int dataSize);

    // Rasterize DOM to RGBA pixels (like Blink SVGImage::Draw)
    bool rasterize(DecodedImageData& output, int targetWidth = 0, int targetHeight = 0) const;
};

// ============================================================
//  ImageResource — loading + caching + lifecycle
//  (mirrors blink::ImageResource + ImageResourceContent)
// ============================================================

class ImageResource {
public:
    std::string key;             // name or file path
    ImageLoadState state = ImageLoadState::NotStarted;
    ImageFormat format = ImageFormat::Unknown;
    DecodedImageData decoded;    // CPU-side RGBA pixels
    uint32_t textureId = 0;      // GPU handle (set by Renderer)
    std::unique_ptr<SVGDocument> svgDocument; // If SVG, parsed DOM

    // Raw source bytes (kept for re-rasterization at different sizes)
    std::vector<unsigned char> sourceData;

    bool loaded() const { return state == ImageLoadState::Decoded || state == ImageLoadState::Uploaded; }
    bool isSvg() const { return format == ImageFormat::SVG; }
    int width() const { return decoded.width; }
    int height() const { return decoded.height; }
    Vec2 naturalSize() const { return { (float)decoded.width, (float)decoded.height }; }

    // Decode from raw bytes (auto-detects format)
    bool decode(const unsigned char* data, int dataSize, bool forceSvg = false);

    // Re-rasterize SVG at a new target size
    bool rerasterizeSvg(int targetWidth, int targetHeight);

    // Release CPU-side pixel data after GPU upload
    void releasePixels();
};

// ============================================================
//  ImageResourceCache — global image cache
//  (mirrors Blink's MemoryCache for images)
// ============================================================

class ImageResourceCache {
public:
    // Get or load an image by path or name
    ImageResource* get(const std::string& key);
    ImageResource* loadFromFile(const std::string& path, const std::string& name = "");
    ImageResource* loadFromMemory(const unsigned char* data, int dataSize,
                                  const std::string& name, bool forceSvg = false);

    // Check if an image exists in cache
    bool has(const std::string& key) const;

    // Remove from cache
    void remove(const std::string& key);

    // Clear all cached images
    void clear();

    // Iterate all resources
    using VisitFn = std::function<void(const std::string& key, ImageResource& resource)>;
    void forEach(VisitFn fn);

    // Memory stats
    size_t totalPixelBytes() const;
    size_t count() const { return cache_.size(); }

private:
    std::unordered_map<std::string, std::unique_ptr<ImageResource>> cache_;
};

} // namespace FluxUI

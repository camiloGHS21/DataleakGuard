#pragma once

#include <string>
#include <string_view>
#include <mutex>
#include <unordered_set>
#include <ostream>

namespace FluxUI {

class AtomicString {
private:
    const std::string* ptr_ = nullptr;

public:
    AtomicString() : ptr_(&emptyString()) {}

    AtomicString(const char* str) {
        if (!str || str[0] == '\0') {
            ptr_ = &emptyString();
        } else {
            ptr_ = &intern(str);
        }
    }

    AtomicString(const std::string& str) {
        if (str.empty()) {
            ptr_ = &emptyString();
        } else {
            ptr_ = &intern(str);
        }
    }

    AtomicString(std::string_view str) {
        if (str.empty()) {
            ptr_ = &emptyString();
        } else {
            ptr_ = &intern(str);
        }
    }

    AtomicString(const AtomicString& other) = default;
    AtomicString(AtomicString&& other) noexcept = default;
    AtomicString& operator=(const AtomicString& other) = default;
    AtomicString& operator=(AtomicString&& other) noexcept = default;

    const std::string& getString() const { return *ptr_; }
    const char* c_str() const { return ptr_->c_str(); }
    std::string_view view() const { return *ptr_; }
    bool empty() const { return ptr_ == &emptyString() || ptr_->empty(); }
    size_t size() const { return ptr_->size(); }
    size_t length() const { return ptr_->size(); }

    // Read delegators for 100% std::string source compatibility
    size_t find(std::string_view str, size_t pos = 0) const { return view().find(str, pos); }
    size_t find(char c, size_t pos = 0) const { return view().find(c, pos); }
    size_t rfind(std::string_view str, size_t pos = std::string_view::npos) const { return view().rfind(str, pos); }
    size_t rfind(char c, size_t pos = std::string_view::npos) const { return view().rfind(c, pos); }
    std::string_view substr(size_t pos = 0, size_t count = std::string_view::npos) const { return view().substr(pos, count); }

    // Direct comparison operators to eliminate compiler ambiguities
    bool operator==(const AtomicString& other) const { return ptr_ == other.ptr_; }
    bool operator!=(const AtomicString& other) const { return ptr_ != other.ptr_; }

    bool operator==(const std::string& other) const { return *ptr_ == other; }
    bool operator!=(const std::string& other) const { return *ptr_ != other; }

    bool operator==(std::string_view other) const { return view() == other; }
    bool operator!=(std::string_view other) const { return view() != other; }

    bool operator==(const char* other) const {
        if (!other) return empty();
        return view() == other;
    }
    bool operator!=(const char* other) const {
        if (!other) return !empty();
        return view() != other;
    }

    bool operator<(const AtomicString& other) const {
        return ptr_ < other.ptr_;
    }
    bool operator<(const std::string& other) const { return *ptr_ < other; }
    bool operator<(std::string_view other) const { return view() < other; }
    bool operator<(const char* other) const { return view() < other; }

    operator const std::string&() const { return *ptr_; }
    operator std::string_view() const { return view(); }

    static const std::string& intern(std::string_view sv) {
        static std::unordered_set<std::string> pool;
        static std::mutex mutex;
        
        std::lock_guard<std::mutex> lock(mutex);
        std::string key(sv);
        auto it = pool.find(key);
        if (it != pool.end()) {
            return *it;
        }
        auto [insertedIt, success] = pool.insert(std::move(key));
        return *insertedIt;
    }

    static const std::string& emptyString() {
        static const std::string empty;
        return empty;
    }
};

// Global symmetric comparison operators for 100% direct compiler match
inline bool operator==(const std::string& lhs, const AtomicString& rhs) { return rhs == lhs; }
inline bool operator==(const char* lhs, const AtomicString& rhs) { return rhs == lhs; }
inline bool operator==(std::string_view lhs, const AtomicString& rhs) { return rhs == lhs; }

inline bool operator!=(const std::string& lhs, const AtomicString& rhs) { return rhs != lhs; }
inline bool operator!=(const char* lhs, const AtomicString& rhs) { return rhs != lhs; }
inline bool operator!=(std::string_view lhs, const AtomicString& rhs) { return rhs != lhs; }

// Add concatenation support for easy integration
inline std::string operator+(const std::string& lhs, const AtomicString& rhs) {
    return lhs + rhs.getString();
}
inline std::string operator+(const AtomicString& lhs, const std::string& rhs) {
    return lhs.getString() + rhs;
}
inline std::string operator+(const char* lhs, const AtomicString& rhs) {
    return std::string(lhs) + rhs.getString();
}
inline std::ostream& operator<<(std::ostream& os, const AtomicString& as) {
    return os << as.view();
}

} // namespace FluxUI

namespace std {
    template <>
    struct hash<FluxUI::AtomicString> {
        size_t operator()(const FluxUI::AtomicString& s) const noexcept {
            return std::hash<const std::string*>{}(&s.getString());
        }
    };
}

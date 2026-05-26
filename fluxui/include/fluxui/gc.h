// FluxUI - GPU-Accelerated UI Framework with CSS Styling
// Copyright (c) 2026 - MIT License
#pragma once
#include <vector>
#include <unordered_set>
#include <algorithm>
#include <iostream>

namespace FluxUI {

class Visitor;

class GarbageCollectedBase {
public:
    virtual ~GarbageCollectedBase() = default;
    virtual void trace(Visitor* visitor) {}

    bool gcMarked_ = false;
};

template <typename T>
class GarbageCollected : public GarbageCollectedBase {
public:
    virtual ~GarbageCollected() = default;
};

class GCHeap {
private:
    static std::vector<GarbageCollectedBase*> allocations_;
    static std::unordered_set<GarbageCollectedBase**> roots_;
    static bool isCollecting_;

public:
    static void registerRoot(GarbageCollectedBase** root) {
        roots_.insert(root);
    }

    static void unregisterRoot(GarbageCollectedBase** root) {
        roots_.erase(root);
    }

    template <typename T, typename... Args>
    static T* allocate(Args&&... args) {
        T* obj = new T(std::forward<Args>(args)...);
        allocations_.push_back(obj);
        return obj;
    }

    static void collectGarbage();
    static size_t getAllocationCount() { return allocations_.size(); }
    static void cleanupHeap();
};

class Visitor {
public:
    virtual ~Visitor() = default;
    virtual void trace(GarbageCollectedBase* obj) = 0;
};

class GCVisitor : public Visitor {
private:
    std::vector<GarbageCollectedBase*> worklist_;

public:
    void trace(GarbageCollectedBase* obj) override {
        if (obj && !obj->gcMarked_) {
            obj->gcMarked_ = true;
            worklist_.push_back(obj);
        }
    }

    void drain() {
        while (!worklist_.empty()) {
            GarbageCollectedBase* obj = worklist_.back();
            worklist_.pop_back();
            obj->trace(this);
        }
    }
};

// Member pointer wrapper to enable tracing of object references
template <typename T>
class Member {
private:
    T* ptr_ = nullptr;

public:
    Member() = default;
    Member(T* ptr) : ptr_(ptr) {}
    Member(const Member& other) : ptr_(other.ptr_) {}
    Member& operator=(T* ptr) {
        ptr_ = ptr;
        return *this;
    }
    Member& operator=(const Member& other) {
        ptr_ = other.ptr_;
        return *this;
    }

    T* get() const { return ptr_; }
    T& operator*() const { return *ptr_; }
    T* operator->() const { return ptr_; }

    operator T*() const { return ptr_; }
    explicit operator bool() const { return ptr_ != nullptr; }

    bool operator==(const Member& other) const { return ptr_ == other.ptr_; }
    bool operator!=(const Member& other) const { return ptr_ != other.ptr_; }
    bool operator==(T* other) const { return ptr_ == other; }
    bool operator!=(T* other) const { return ptr_ != other; }

    void trace(Visitor* visitor) const {
        if (ptr_) {
            visitor->trace(static_cast<GarbageCollectedBase*>(ptr_));
        }
    }
};

// Persistent handle wrapper to register references as garbage collection roots
template <typename T>
class Persistent {
private:
    T* ptr_ = nullptr;

public:
    Persistent() {
        GCHeap::registerRoot(reinterpret_cast<GarbageCollectedBase**>(&ptr_));
    }
    Persistent(T* ptr) : ptr_(ptr) {
        GCHeap::registerRoot(reinterpret_cast<GarbageCollectedBase**>(&ptr_));
    }
    Persistent(const Persistent& other) : ptr_(other.ptr_) {
        GCHeap::registerRoot(reinterpret_cast<GarbageCollectedBase**>(&ptr_));
    }
    Persistent(const Member<T>& member) : ptr_(member.get()) {
        GCHeap::registerRoot(reinterpret_cast<GarbageCollectedBase**>(&ptr_));
    }
    ~Persistent() {
        GCHeap::unregisterRoot(reinterpret_cast<GarbageCollectedBase**>(&ptr_));
    }

    Persistent& operator=(T* ptr) {
        ptr_ = ptr;
        return *this;
    }
    Persistent& operator=(const Persistent& other) {
        ptr_ = other.ptr_;
        return *this;
    }
    Persistent& operator=(const Member<T>& member) {
        ptr_ = member.get();
        return *this;
    }

    T* get() const { return ptr_; }
    T& operator*() const { return *ptr_; }
    T* operator->() const { return ptr_; }

    operator T*() const { return ptr_; }
    explicit operator bool() const { return ptr_ != nullptr; }

    bool operator==(const Persistent& other) const { return ptr_ == other.ptr_; }
    bool operator!=(const Persistent& other) const { return ptr_ != other.ptr_; }
    bool operator==(T* other) const { return ptr_ == other; }
    bool operator!=(T* other) const { return ptr_ != other; }
};

// Weak pointer wrapper that does not keep the target object alive
template <typename T>
class WeakMember {
private:
    T* ptr_ = nullptr;

public:
    WeakMember() = default;
    WeakMember(T* ptr) : ptr_(ptr) {}
    WeakMember(const WeakMember& other) : ptr_(other.ptr_) {}
    WeakMember& operator=(T* ptr) {
        ptr_ = ptr;
        return *this;
    }
    WeakMember& operator=(const WeakMember& other) {
        ptr_ = other.ptr_;
        return *this;
    }

    T* get() const { return ptr_; }
    T& operator*() const { return *ptr_; }
    T* operator->() const { return ptr_; }

    operator T*() const { return ptr_; }
    explicit operator bool() const { return ptr_ != nullptr; }

    bool operator==(const WeakMember& other) const { return ptr_ == other.ptr_; }
    bool operator!=(const WeakMember& other) const { return ptr_ != other.ptr_; }

    // Weak pointers are not traced during normal graph traversal. Instead, we can clear them in sweep phase.
    void clearIfDead() {
        if (ptr_ && !static_cast<GarbageCollectedBase*>(ptr_)->gcMarked_) {
            ptr_ = nullptr;
        }
    }
};

} // namespace FluxUI

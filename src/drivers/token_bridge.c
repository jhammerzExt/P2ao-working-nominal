/**
 * token_bridge.c - Lock-Free Buffer-to-Token Zero-Copy Implementation
 */

#include "token_bridge.h"
#include <string.h>

void ring_buffer_init(spsc_ring_buffer_t *ring)
{
    if (!ring) return;
    memset((void*)ring->buffer, 0, RING_BUFFER_CAPACITY);
    atomic_store_explicit(&ring->head, 0, memory_order_relaxed);
    atomic_store_explicit(&ring->tail, 0, memory_order_relaxed);
}

/**
 * Producer: Push single byte into SPSC ring without mutex contention
 */
bool ring_buffer_push_byte(spsc_ring_buffer_t *ring, uint8_t byte)
{
    uint32_t current_head = atomic_load_explicit(&ring->head, memory_order_relaxed);
    uint32_t current_tail = atomic_load_explicit(&ring->tail, memory_order_acquire);

    uint32_t next_head = (current_head + 1) & (RING_BUFFER_CAPACITY - 1);

    if (next_head == current_tail) {
        return false; // Ring Buffer Full
    }

    ring->buffer[current_head] = byte;

    // Release memory order guarantees byte write is visible before updating head
    atomic_store_explicit(&ring->head, next_head, memory_order_release);
    return true;
}

/**
 * Producer: Push byte chunk
 */
bool ring_buffer_push_bytes(spsc_ring_buffer_t *ring, const uint8_t *data, size_t length)
{
    for (size_t i = 0; i < length; i++) {
        if (!ring_buffer_push_byte(ring, data[i])) {
            return false; // Buffer overflow
        }
    }
    return true;
}

/**
 * Consumer: Direct Zero-Copy Pointer Casting into Int32 Token Array View
 * Re-interprets contiguous 4-byte memory blocks directly as 32-bit token IDs
 */
size_t ring_buffer_get_zero_copy_tokens(
    spsc_ring_buffer_t *ring,
    zero_copy_token_view_t *view,
    size_t max_tokens
) {
    if (!ring || !view || max_tokens == 0) return 0;

    uint32_t current_head = atomic_load_explicit(&ring->head, memory_order_acquire);
    uint32_t current_tail = atomic_load_explicit(&ring->tail, memory_order_relaxed);

    uint32_t available_bytes = (current_head >= current_tail) ?
        (current_head - current_tail) :
        (RING_BUFFER_CAPACITY - current_tail + current_head);

    // Tokens require 4-byte alignment (int32_t)
    size_t available_tokens = available_bytes / sizeof(int32_t);
    if (available_tokens == 0) {
        view->tokens = NULL;
        view->count = 0;
        return 0;
    }

    if (available_tokens > max_tokens) {
        available_tokens = max_tokens;
    }

    // Zero-copy pointer cast: Cast raw unsigned char buffer memory directly to int32_t*
    view->tokens = (const int32_t *)(void *)&ring->buffer[current_tail];
    view->count = available_tokens;
    view->source_head_offset = current_tail;

    return available_tokens;
}

/**
 * Advance tail pointer after zero-copy token processing completes
 */
void ring_buffer_advance_tail(spsc_ring_buffer_t *ring, size_t consumed_bytes)
{
    if (!ring) return;
    uint32_t current_tail = atomic_load_explicit(&ring->tail, memory_order_relaxed);
    uint32_t new_tail = (current_tail + (uint32_t)consumed_bytes) & (RING_BUFFER_CAPACITY - 1);
    atomic_store_explicit(&ring->tail, new_tail, memory_order_release);
}

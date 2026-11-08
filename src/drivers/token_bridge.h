/**
 * token_bridge.h - Lock-Free Circular Buffer & Zero-Copy Tokenization Interface
 * Architecture: C11 Lock-Free Atomic Memory Ring Buffer for Transformer Inference
 */

#ifndef TOKEN_BRIDGE_H
#define TOKEN_BRIDGE_H

#include <stdint.h>
#include <stdbool.h>
#include <stdatomic.h>

#define RING_BUFFER_CAPACITY 4096 // Must be a power of two
#define TOKEN_VOCAB_SIZE     32000
#define MMIO_REGION_SIZE     0x1000

// Lock-Free Single-Producer Single-Consumer (SPSC) Circular Ring Buffer
typedef struct {
    uint8_t buffer[RING_BUFFER_CAPACITY];
    _Atomic uint32_t head; // Written by Producer (Kernel DMA / Hardware)
    _Atomic uint32_t tail; // Read by Consumer (Tokenization Engine)
} spsc_ring_buffer_t;

// Zero-Copy Token Array Wrapper
typedef struct {
    const int32_t *tokens;
    size_t count;
    uint32_t source_head_offset;
} zero_copy_token_view_t;

// Function Declarations
void ring_buffer_init(spsc_ring_buffer_t *ring);
bool ring_buffer_push_byte(spsc_ring_buffer_t *ring, uint8_t byte);
bool ring_buffer_push_bytes(spsc_ring_buffer_t *ring, const uint8_t *data, size_t length);

size_t ring_buffer_get_zero_copy_tokens(
    spsc_ring_buffer_t *ring,
    zero_copy_token_view_t *view,
    size_t max_tokens
);

void ring_buffer_advance_tail(spsc_ring_buffer_t *ring, size_t consumed_bytes);

#endif // TOKEN_BRIDGE_H

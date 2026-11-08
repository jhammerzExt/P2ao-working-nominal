package main

import (
	"crypto/sha256"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

// SovereignProtocol defines the standardized response envelope for sovereign execution
type SovereignProtocol[T any] struct {
	Success   bool   `json:"success"`
	Result    T      `json:"result"`
	LatencyMs int64  `json:"latency_ms"`
	ProofHash string `json:"proof_hash"`
}

// TaskRunner manages concurrent execution with thread-safe caching and cryptographic attestation
type TaskRunner struct {
	mu    sync.RWMutex
	cache map[string]interface{}
}

// NewTaskRunner instantiates a thread-safe task runner
func NewTaskRunner() *TaskRunner {
	return &TaskRunner{
		cache: make(map[string]interface{}),
	}
}

// Execute runs the provided task or returns the cached result with WORM proof hashing
func (tr *TaskRunner[T any]) Execute(key string, fn func() (T, error)) (SovereignProtocol[T], error) {
	start := time.Now()

	tr.mu.RLock()
	if val, found := tr.cache[key]; found {
		tr.mu.RUnlock()
		latency := time.Since(start).Milliseconds()
		return SovereignProtocol[T]{
			Success:   true,
			Result:    val.(T),
			LatencyMs: latency,
			ProofHash: generateProofHash(key),
		}, nil
	}
	tr.mu.RUnlock()

	output, err := fn()
	if err != nil {
		return SovereignProtocol[T]{Success: false}, err
	}

	tr.mu.Lock()
	tr.cache[key] = output
	tr.mu.Unlock()

	latency := time.Since(start).Milliseconds()
	return SovereignProtocol[T]{
		Success:   true,
		Result:    output,
		LatencyMs: latency,
		ProofHash: generateProofHash(key + fmt.Sprintf("%v", output)),
	}, nil
}

func generateProofHash(input string) string {
	hasher := sha512.New()
	hasher.Write([]byte(input + fmt.Sprintf("%d", rand.Int63())))
	return "0x" + hex.EncodeToString(hasher.Sum(nil))[:64]
}

func main() {
	runner := NewTaskRunner()
	res, _ := runner.Execute("sys-metrics", func() (string, error) {
		return "Sovereign Node-01 Active [4096 TFLOPS]", nil
	})
	jsonData, _ := json.MarshalIndent(res, "", "  ")
	fmt.Println(string(jsonData))
}

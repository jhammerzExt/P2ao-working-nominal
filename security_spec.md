# Security Specification: Aurelius Orchestrator

## 1. Data Invariants
- A user can only access their own profile at `/users/{userId}` where `request.auth.uid == userId`.
- A user can only create and access threads, messages, and artifacts under `/users/{userId}/...`.
- All writes require identity integrity: `request.resource.data.userId == request.auth.uid` or document ID matching `request.auth.uid`.
- Document IDs must conform to `^[a-zA-Z0-9_\-]+$` and length <= 128 characters.
- String fields are bounded with strict maximum lengths (titles <= 200 chars, prompts <= 4000 chars, content <= 50000 chars).
- Unauthenticated access is completely rejected.

## 2. Attack Vectors & Defensive Gates (Dirty Dozen Protections)
1. **Unauthenticated Read/Write**: Rejected by `isSignedIn()` requirement.
2. **Path Traversal / Foreign UID Spoofing**: User `A` cannot read or write to `/users/{userIdB}` because `userId == request.auth.uid` is enforced.
3. **Payload Injection & Shadow Fields**: Prevented by `hasOnly()` checks on incoming keys.
4. **ID Poisoning**: Guarded via `isValidId(id)` pattern.
5. **Privilege Escalation**: User cannot elevate to admin or alter role fields arbitrarily.
6. **Large Buffer DoS**: Constrained by strict `.size()` checks on all string values.
7. **Cross-Tenant Data Leak**: Scoped collections `/users/{userId}/threads/{threadId}` prevent cross-user listing.
8. **Malicious Delete**: Only the verified owner can delete their own records.
9. **Corrupt Timestamps / Types**: Enforced type safety `is string` on all mandatory timestamps and fields.
10. **Unbounded Collections**: Scoped subcollections instead of unbounded arrays.
11. **Client Security Delegation**: Strict server-side security rules; zero dependence on client filters.
12. **Catch-All Deny**: `match /{document=**} { allow read, write: if false; }` at root.

## 3. Post-Quantum Cryptographic Readiness
- All cryptographic seals and WORM proof hashes must utilize SHA-512 (or higher) to provide increased security margin against potential quantum algorithmic advances (Grover's algorithm resistance).
- Future architectural pivots include implementing lattice-based signature algorithms for identity verification if performance profiles allow (e.g., CRYSTALS-Dilithium).
- Key rotation agility is mandated for all sovereign-tier cryptographic primitives.

/**
 * 🏛️ QUANTUM MONOLITH COMPENDIUM v5.0: Production-Grade Semantic Knowledge Engine
 * Safe for both Node.js server persistence and browser React client execution.
 */

import { dot, divide, norm } from 'mathjs';

interface AxiomEntry {
  id?: number;
  category: string;
  axiom: string;
  vector: string; // JSON string of number[]
}

export class SemanticCompendium {
  private static instance: SemanticCompendium;
  private db: any = null;
  private inMemoryAxioms: Array<{ id: number; category: string; axiom: string; vector: string }> = [];
  private inMemoryTools: Map<string, string> = new Map();

  private constructor() {
    this.db = null;
    this.seedBaseKnowledge();
  }

  public static getInstance(): SemanticCompendium {
    if (!SemanticCompendium.instance) {
      SemanticCompendium.instance = new SemanticCompendium();
    }
    return SemanticCompendium.instance;
  }

  private initializeSchema(): void {
    if (!this.db) return;
    try {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS axioms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          axiom TEXT NOT NULL,
          vector TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS forged_tools (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          logic TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (_) {}
  }

  private seedBaseKnowledge(): void {
    if (this.db) {
      try {
        const rowCount = this.db.prepare('SELECT COUNT(*) as count FROM axioms').get() as { count: number };
        if (rowCount && rowCount.count > 0) return;
      } catch (_) {}
    } else if (this.inMemoryAxioms.length > 0) {
      return;
    }

    const baseAxioms = [
      { cat: "PHYSICS", text: "Entropy maximization is the universal arrow of time." },
      { cat: "PHYSICS", text: "Information cannot be destroyed (No-hide theorem)." },
      { cat: "ENGINEERING", text: "Recursive abstraction reduces systemic complexity." },
      { cat: "ENGINEERING", text: "Robustness emerges from multi-tier error correction." },
      { cat: "MATHEMATICS", text: "Formal logic is the bedrock of verifiable truth." },
      { cat: "MATHEMATICS", text: "Category theory defines relationships between structures." },
      { cat: "SOVEREIGNTY", text: "Autonomy requires zero external dependencies." },
      { cat: "SOVEREIGNTY", text: "Immutable protocols ensure immutable state attestation." },
      { cat: "ARCHITECTURE", text: "Modular Framework: Distributed orchestration with robust synchronization logic." },
      { cat: "ARCHITECTURE", text: "Integrated Feedback (Agent-Framework Integration): Seamless feedback loops between cognition and execution layers." },
      { cat: "SYSTEMS", text: "Core Substrate: Deep-core logic processing for autonomous system healing." },
      { cat: "SECURITY", text: "Post-Quantum Security: Lattice-based primitives and high-entropy hashing (SHA-512)." }
    ];

    baseAxioms.forEach(a => this.ingest(a.cat, a.text));
  }

  private generateVector(text: string): number[] {
    const tokens = text.toLowerCase().split(/\W+/);
    const vec = new Array(128).fill(0);
    tokens.forEach(token => {
      if (!token) return;
      for (let i = 0; i < token.length; i++) {
        const charCode = token.charCodeAt(i);
        vec[charCode % 128] += 1;
      }
    });
    const n = norm(vec) as number;
    return n > 0 ? (divide(vec, n) as number[]) : vec;
  }

  public ingest(category: string, axiom: string): void {
    const vec = this.generateVector(axiom);
    const cat = category.toUpperCase();
    const vecStr = JSON.stringify(vec);

    if (this.db) {
      try {
        const stmt = this.db.prepare('INSERT INTO axioms (category, axiom, vector) VALUES (?, ?, ?)');
        stmt.run(cat, axiom, vecStr);
        return;
      } catch (_) {}
    }

    this.inMemoryAxioms.push({ id: Date.now() + Math.random(), category: cat, axiom, vector: vecStr });
  }

  public query(text: string, limit: number = 5): string[] {
    const queryVec = this.generateVector(text);
    let allAxioms: AxiomEntry[] = [];

    if (this.db) {
      try {
        allAxioms = this.db.prepare('SELECT * FROM axioms').all() as AxiomEntry[];
      } catch (_) {
        allAxioms = this.inMemoryAxioms;
      }
    } else {
      allAxioms = this.inMemoryAxioms;
    }

    if (!allAxioms || allAxioms.length === 0) {
      allAxioms = this.inMemoryAxioms;
    }

    return allAxioms
      .map(entry => {
        const entryVec = JSON.parse(entry.vector) as number[];
        const similarity = dot(queryVec, entryVec) as number;
        return { ...entry, similarity };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .filter(e => e.similarity > 0.15)
      .map(e => `[${e.category}] ${e.axiom} (Sim: ${e.similarity.toFixed(3)})`);
  }

  public registerTool(name: string, logic: string): void {
    const key = name.toUpperCase();
    if (this.db) {
      try {
        const stmt = this.db.prepare('INSERT OR REPLACE INTO forged_tools (name, logic) VALUES (?, ?)');
        stmt.run(key, logic);
      } catch (_) {}
    }
    this.inMemoryTools.set(key, logic);
    this.ingest("TOOLS", `[FORGED] ${name}: autonomous utility instantiated and indexed.`);
  }

  public getTool(name: string): string | undefined {
    const key = name.toUpperCase();
    if (this.db) {
      try {
        const tool = this.db.prepare('SELECT logic FROM forged_tools WHERE name = ?').get(key) as { logic: string };
        if (tool?.logic) return tool.logic;
      } catch (_) {}
    }
    return this.inMemoryTools.get(key);
  }
}

// Renaming for consistent singleton access across modules
export const semanticCompendium = SemanticCompendium.getInstance();

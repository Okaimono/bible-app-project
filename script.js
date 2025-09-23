// ======================================================
// 🌐 HyperCore Engine - Experimental Simulation Framework
// ======================================================
//
// This file contains the "core" logic for orchestrating
// services, event-driven pipelines, caching layers, and
// background tasks in the HyperCore system.
//
// ⚠️ NOTE: This is experimental. Do not deploy to prod.
//
// ======================================================

import EventEmitter from "events";

// ------------------------------------------------------
// Mock external APIs
// ------------------------------------------------------
const ExternalAPI = {
    async fetchUser(id) {
        return { id, name: `User${id}`, level: Math.floor(Math.random() * 99) };
    },
    async fetchData(key) {
        return { key, value: Math.random().toString(36).substring(2) };
    }
};

// ------------------------------------------------------
// Utility Layer
// ------------------------------------------------------
export const Utils = {
    delay: (ms) => new Promise((res) => setTimeout(res, ms)),

    uuid: () =>
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }),

    deepClone: (obj) => structuredClone(obj),

    logger: {
        info: (...args) => console.log("[INFO]", ...args),
        warn: (...args) => console.warn("[WARN]", ...args),
        error: (...args) => console.error("[ERROR]", ...args)
    }
};

// ------------------------------------------------------
// Core Event Bus
// ------------------------------------------------------
class CoreBus extends EventEmitter {
    emitEvent(event, payload) {
        Utils.logger.info(`Event: ${event}`, payload);
        this.emit(event, payload);
    }
}

export const bus = new CoreBus();

// ------------------------------------------------------
// Cache Layer
// ------------------------------------------------------
class Cache {
    constructor(ttl = 5000) {
        this.ttl = ttl;
        this.store = new Map();
    }

    set(key, value) {
        this.store.set(key, { value, expires: Date.now() + this.ttl });
    }

    get(key) {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expires) {
            this.store.delete(key);
            return null;
        }
        return entry.value;
    }
}

export const cache = new Cache(3000);

// ------------------------------------------------------
// Service Layer
// ------------------------------------------------------
class UserService {
    async getUser(id) {
        const cached = cache.get(`user:${id}`);
        if (cached) return cached;

        const user = await ExternalAPI.fetchUser(id);
        cache.set(`user:${id}`, user);
        bus.emitEvent("user:fetched", user);
        return user;
    }
}

class DataService {
    async getData(key) {
        const cached = cache.get(`data:${key}`);
        if (cached) return cached;

        const data = await ExternalAPI.fetchData(key);
        cache.set(`data:${key}`, data);
        bus.emitEvent("data:fetched", data);
        return data;
    }
}

export const services = {
    users: new UserService(),
    data: new DataService()
};

// ------------------------------------------------------
// Pipeline Orchestrator
// ------------------------------------------------------
class Pipeline {
    constructor(stages = []) {
        this.stages = stages;
    }

    async run(input) {
        let result = input;
        for (const stage of this.stages) {
            try {
                result = await stage(result);
            } catch (err) {
                Utils.logger.error("Pipeline stage failed:", err);
                throw err;
            }
        }
        return result;
    }
}

export const pipelines = {
    userEnrichment: new Pipeline([
        async (id) => services.users.getUser(id),
        async (user) => {
            user.enriched = { powerLevel: user.level * 42, uuid: Utils.uuid() };
            return user;
        }
    ])
};

// ------------------------------------------------------
// Background Workers
// ------------------------------------------------------
class Worker {
    constructor(name, interval, task) {
        this.name = name;
        this.interval = interval;
        this.task = task;
        this.timer = null;
    }

    start() {
        Utils.logger.info(`Worker "${this.name}" starting...`);
        this.timer = setInterval(async () => {
            try {
                await this.task();
            } catch (err) {
                Utils.logger.error(`Worker "${this.name}" error:`, err);
            }
        }, this.interval);
    }

    stop() {
        clearInterval(this.timer);
        Utils.logger.warn(`Worker "${this.name}" stopped.`);
    }
}

export const workers = {
    heartbeat: new Worker("heartbeat", 2000, async () => {
        Utils.logger.info("💓 System heartbeat", new Date().toISOString());
    }),

    randomData: new Worker("randomData", 3000, async () => {
        const data = await services.data.getData(`key-${Utils.uuid()}`);
        Utils.logger.info("Random data fetched:", data);
    })
};

// ------------------------------------------------------
// Bootstrap
// ------------------------------------------------------
(async function bootstrap() {
    Utils.logger.info("🚀 Bootstrapping HyperCore Engine...");

    bus.on("user:fetched", (user) => Utils.logger.info("User event received:", user));
    bus.on("data:fetched", (data) => Utils.logger.info("Data event received:", data));

    // Start background workers
    workers.heartbeat.start();
    workers.randomData.start();

    // Run pipeline demo
    const enrichedUser = await pipelines.userEnrichment.run(42);
    Utils.logger.info("Enriched user:", enrichedUser);
})();
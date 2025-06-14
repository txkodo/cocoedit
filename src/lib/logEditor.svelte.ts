import type { Log, LogDoc, Profile } from "src/logic/model";

export class LogDocEdit {
    profiles: Profile[];
    #allLogOrder: number[];
    logOrder: number[];
    #logMap: Map<number, Log>;
    constructor(
        logdoc: LogDoc
    ) {
        this.profiles = $state(logdoc.profiles);

        this.#logMap = new Map()
        const logIds = []
        for (const log of logdoc.logs) {
            const id = this.#nextId();
            this.#logMap.set(id, log);
            logIds.push(id);
        }
        this.#allLogOrder = $state(logIds);
        this.#updateSignal = $state(false);

        this.logOrder = $derived((() => {
            return this.#allLogOrder.filter(x => {
                this.profiles; // Ensure profiles are reactive
                const profid = this.#logMap.get(x)?.profile_id
                if (profid === undefined) return false;
                const prof = this.profiles.find(p => p.id === profid);
                if (prof === undefined) return false;
                return prof.display !== "hidden";
            })
        })())
    }

    #_nextId = 0
    #nextId() {
        return this.#_nextId++;
    }

    #updateSignal: boolean;
    #emitUpdate() {
        this.#updateSignal = !this.#updateSignal;
    }
    #listenUpdate() {
        this.#updateSignal
    }

    deleteLog(id: number) {
        this.#allLogOrder = this.#allLogOrder.filter(x => x !== id);
        this.#logMap.delete(id);
    }

    getLog(id: number) {
        this.#listenUpdate();
        return this.#logMap.get(id);
    }

    setLog(id: number, log: any) {
        this.#logMap.set(id, log);
        this.#emitUpdate();
    }

    insertLogAfter(id: number) {
        const thisLog = this.#logMap.get(id);
        if (!thisLog) {
            console.warn(`Log with id ${id} not found.`);
            return;
        }
        const newId = this.#nextId();
        this.#logMap.set(newId, {
            message: "",
            profile_id: thisLog.profile_id,
            room_id: thisLog.room_id
        });
        const index = this.#allLogOrder.indexOf(id);
        if (index === -1) {
            this.#allLogOrder = [...this.#allLogOrder, newId];
        } else {
            this.#allLogOrder = [
                ...this.#allLogOrder.slice(0, index + 1),
                newId,
                ...this.#allLogOrder.slice(index + 1),
            ];
        }
        return newId;
    }
}
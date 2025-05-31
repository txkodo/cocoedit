import type { Log, LogDoc, Profile } from "src/logic/model";

export class LogDocEdit {
    profiles: Profile[];
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
        this.logOrder = $state(logIds);
        this.#updateSignal = $state(false);
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
        this.logOrder = this.logOrder.filter(x => x !== id);
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
        const index = this.logOrder.indexOf(id);
        if (index === -1) {
            this.logOrder = [...this.logOrder, newId];
        } else {
            this.logOrder = [
                ...this.logOrder.slice(0, index + 1),
                newId,
                ...this.logOrder.slice(index + 1),
            ];
        }
        return newId;
    }
}
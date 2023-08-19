import mitt from 'mitt'
import type { Emitter, EventType, Handler } from 'mitt'

export class EventEmitter<Events extends Record<EventType, unknown>> {
  bus: Emitter<Events>

  constructor() {
    this.bus = mitt()
  }

  on<Key extends keyof Events>(event: Key, callback: Handler<Events[Key]>) {
    this.bus.on(event, callback)
  }

  removeListener<Key extends keyof Events>(event: Key, callback?: Handler<Events[Key]>) {
    this.bus.off(event, callback)
  }

  emit<Key extends keyof Events>(event: Key, payload?: Events[Key]) {
    // @FIX payload can be undefined
    this.bus.emit(event, payload!)
  }
}
export interface Control {
  connect: (room: number) => void
  disconnect: () => void
  danmakuEventBus: EventEmitter
}

declare global {
  interface Window {
    control: Control
  }
}

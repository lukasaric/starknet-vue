import EventEmitter from 'eventemitter3'
import { AccountInterface } from 'starknet'

/** Connector icons, as base64 encoded svg. */
export type ConnectorIcons = {
  /** Dark-mode icon. */
  dark?: string
  /** Light-mode icon. */
  light?: string
}

/** Connector data. */
export type ConnectorData = {
  /** Connector account. */
  account?: string
  /** Connector network. */
  chainId?: bigint
}

/** Connector events. */
export interface ConnectorEvents {
  /** Emitted when account or network changes. */
  change(data: ConnectorData): void
  /** Emitted when connection is established. */
  connect(data: ConnectorData): void
  /** Emitted when connection is lost. */
  disconnect(): void
}

export class ConnectorEventsEmmiter extends EventEmitter<ConnectorEvents> {}

export interface Connector extends ConnectorEventsEmmiter {
  /** Unique connector id. */
  get id(): string
  /** Connector name. */
  get name(): string
  /** Connector icons. */
  get icon(): ConnectorIcons

  /** Whether connector is available for use */
  available(): boolean
  /** Whether connector is already authorized */
  ready(): Promise<boolean>
  /** Connect wallet. */
  connect(): Promise<ConnectorData>
  /** Disconnect wallet. */
  disconnect(): void
  /** Get current account. */
  account(): AccountInterface
  /** Get current chain id. */
  chainId(): Promise<bigint>
}

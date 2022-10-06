import Dexie from 'dexie'
import { throwIfNotBrowser } from './util'
import { Account, Voter } from "./types"

// INDEX DB Wrappers

/** Provides access to a local cache DB, containing the last known list of registered token addresses */
export class AccountDb extends Dexie {
  accounts: Dexie.Table<Account, string> // string = type of the primkey

  /** Provides access to a local cache DB, containing the last known list of registered token addresses */
  constructor() {
    super('VocdoniPlaza')
    throwIfNotBrowser()

    // For newer model versions, DO NOT REMOVE any lines => ADD new ones below.
    // See https://dexie.org/docs/Tutorial/Design for model upgrades
    this.version(1).stores({ accounts: '&address' })
    this.version(2).stores({ voters: '[address+processId]' })

    // The following line is needed if your typescript
    // is compiled using babel instead of tsc:
    this.accounts = this.table('accounts')
  }

  read(): Promise<Account[]> {
    return this.accounts.toArray()
  }

  write(accounts: Account[]) {
    return Promise.all(accounts.map(account => this.accounts.put(account)))
  }

  update(account: Account) {
    return this.accounts.put(account)
  }
}

/** Provides access to a local cache DB, containing the last known list of registered token addresses */
export class VoterDb extends Dexie {
  voters: Dexie.Table<Voter, string> // string = type of the primkey

  /** Provides access to a local cache DB, containing the last known list of registered token addresses */
  constructor() {
    super('VocdoniPlaza')
    throwIfNotBrowser()

    // For newer model versions, DO NOT REMOVE any lines => ADD new ones below.
    // See https://dexie.org/docs/Tutorial/Design for model upgrades
    this.version(1).stores({ accounts: '&address' })
    // this.version(1).stores({ voters: 'address+processId' })
    this.version(2).stores({ voters: '[address+processId]' })


    // The following line is needed if your typescript
    // is compiled using babel instead of tsc:
    this.voters = this.table('voters')
  }

  read(): Promise<Voter[]> {
    return this.voters.toArray()
  }

  write(voters: Voter[]) {
    return Promise.all(voters.map(voter => this.voters.put(voter)))
  }

  update(voter: Voter) {
    return this.voters.put(voter)
  }
}

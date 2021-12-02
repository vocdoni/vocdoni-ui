export enum AsyncActionState {
  Loading = 'Loading',
  Success = 'Success',
  Failure = 'Failure',
}

export class AsyncAction<T> {
  private _state: AsyncActionState
  private _value: T

  constructor() {
  }

  get value() {
    return this._value
  }

  set state(state: AsyncActionState) {
    this._state = state
  }

  get state() {
    return this._state
  }
  
  
  set value(value: T) {
    this._value = value
  }

  public setValue (value: T): AsyncAction<T> {
    const asyncAction = new AsyncAction<T>()
    asyncAction.state = AsyncActionState.Success
    asyncAction.value = value

    return asyncAction
  }

  public setState(state: AsyncActionState): AsyncAction<T> {
    const asyncAction = new AsyncAction<T>()
    asyncAction.state = state
    asyncAction.value = this.value

    return asyncAction
  }

  public setValueAndState(value: T, state: AsyncActionState): AsyncAction<T> {
    const asyncAction = new AsyncAction<T>()
    asyncAction.state = state
    asyncAction.value = value
    
    return asyncAction
  }

  static CreateLoadingValue<T>(value): AsyncAction<T> {
    const asyncAction = new AsyncAction<T>()
    
    asyncAction.state = AsyncActionState.Loading
    asyncAction.value = value

    return asyncAction
  }

  static 
}

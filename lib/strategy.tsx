import React, { ReactElement } from 'react'


type IEvaluation = () => boolean
type IArgs = any[]

export class ViewStrategy {
  private readonly evaluation: IEvaluation
  public readonly view: ReactElement

  constructor(evaluation: IEvaluation, view: ReactElement) {
    this.evaluation = evaluation
    this.view = view
  }

  public evaluate (): boolean {
    return this.evaluation();
  }
}

export class ViewContext {
  private strategies: ViewStrategy[] 
  constructor(strategies?: ViewStrategy[]){
    this.strategies = strategies? strategies: []
  }

  public addStrategy (strategy: ViewStrategy) {
    this.strategies.push(strategy)
  }

  public addStrategies (strategies: ViewStrategy[]) {
    this.strategies = strategies
  }
  
  public getView() {
    for(let strategy of this.strategies) {
      if (strategy.evaluate()) {
        return strategy.view
      }
    }
  }
}

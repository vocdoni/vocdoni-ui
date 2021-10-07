import { Features } from '@recoil/atoms/account-features'
import { selectorFamily } from 'recoil'

const FEATURES_KEY = 'features'

export const accountFeaturesSelector = selectorFamily<Features[], string>({
  key: 'accountFeaturesSelector',
  get: (accountId: string) => async () => {
    const features = typeof window !== 'undefined' && window.localStorage.getItem(FEATURES_KEY)
    console.log(features)
    return features? JSON.parse(features)[accountId] : []
  }
})
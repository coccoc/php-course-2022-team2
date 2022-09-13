import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'token', // this key is using to store data in local storage
  storage: localStorage, // configurate which stroage will be used to store the data
})

export const tokenState = atom({
  key: 'token',
  default: {
    token: null,
  },
  effects_UNSTABLE: [persistAtom],
})

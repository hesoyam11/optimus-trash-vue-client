/*




// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'




// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
    state: { ... },
    mutations: {
        // we can use the ES2015 computed property name feature
        // to use a constant as the function name
        [SOME_MUTATION] (state) {
            // mutate state
        }
    }
})




*/
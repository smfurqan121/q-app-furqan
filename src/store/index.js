import { createStore } from 'redux'
import reducer from './reducers/themeReducers'

const store = createStore(reducer)

export default store
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { userInfo } from './userInfo.js'
import { article } from './article.js'

const rootReducer = combineReducers({
  userInfo,
  article,
  routing: routerReducer,
})


export default rootReducer

import { legacy_createStore as createStore, combineReducers } from "redux"
import updateCollapsedReducer from './reducer/Collapsed'
import updateLoadReducer from "./reducer/Loading";
import { persistStore, persistReducer } from 'redux-persist'//持久化处理
import storage from 'redux-persist/lib/storage'
const persistConfig = {
    key: "state",
    storage,
    blacklist: ['updateLoadReducer'],//黑名单
    // whitelist:[]//白名单
}
const reducer = combineReducers({
    updateCollapsedReducer,
    updateLoadReducer
})
const PersistReducer = persistReducer(persistConfig, reducer)
const store = createStore(PersistReducer);
const persistor = persistStore(store);

export { store, persistor };
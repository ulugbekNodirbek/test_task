import { createStore } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { reducer } from './reducer'

const persistConfig = {
    key: "craft-meets-design",
    storage
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(
    persistedReducer, {},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export default store

export const persist = persistStore(store)
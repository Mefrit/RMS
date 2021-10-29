import { ADD_MESSAGE, SHOW_LOADER, HIDE_LOADER } from './types'

const initialState = {

    loading: false,
    alert: null,
    messages: []
}

export const appReducer = (state = initialState, action) => {
    // содержится тот контенк, которых мы укажем в обработчикек action.payload
    console.log("appReducer => ", action, state);
    switch (action.type) {
        case ADD_MESSAGE:
            return { ...state, messages: state.messages.concat(action.payload) }
        case SHOW_LOADER:
            return { ...state, loading: true }
        case HIDE_LOADER:
            return { ...state, loading: false }
        default:
            return state
    }
}

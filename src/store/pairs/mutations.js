export const setData = (state, payload) => { state.data.ohlcv = payload; };
export const updatePair = (state, payload) => { state.model = payload; };
export const updateShowGraphState = (state, payload) => { state.showGraph = payload; };

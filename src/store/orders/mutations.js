export const newOrder = (state, payload) => state.data.push(payload);
export const cancel = (state, payload) => state.data.splice(payload, 1);
export const addTx = (state, payload) => { state.tx = payload; };
export const addSelectedAddress = (state, payload) => { state.selectedAddress = payload; };

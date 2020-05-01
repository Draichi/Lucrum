export const newOrder = (state, payload) => state.data.push(payload);
export const cancel = (state, payload) => state.data.splice(payload, 1);

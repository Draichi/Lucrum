export const newOrder = (state, payload) => {
  debugger;
  const ifExists = state.data.find(
    (item) => item.etherscan === payload.etherscan,
  );
  if (ifExists === -1 || ifExists === undefined) {
    state.data.push(payload);
  }
};
export const cancel = (state, payload) => state.data.splice(payload, 1);
export const addTx = (state, payload) => { state.tx = payload; };
export const addSelectedAddress = (state, payload) => { state.selectedAddress = payload; };

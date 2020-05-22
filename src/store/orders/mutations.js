export const newOrder = (state, payload) => {
  // debugger; cannot build with debugger
  const ifExists = state.data.find(
    (item) => item.etherscan === payload.etherscan,
  );
  if (ifExists === -1 || ifExists === undefined) {
    state.data.unshift(payload);
  }
};
export const clearData = (state) => {
  state.data = [];
};
export const markExecuted = (state, payload) => {
  const ifExists = state.data.findIndex(
    (item) => item.etherscan === payload.etherscan,
  );
  if (ifExists !== -1 && ifExists !== undefined) {
    state.data[ifExists].isExecuted = true;
  }
};
export const markWithdrawn = (state, payload) => {
  const ifExists = state.data.findIndex(
    (item) => item.etherscan === payload.etherscan,
  );
  if (ifExists !== -1 && ifExists !== undefined) {
    state.data[ifExists].isExecuted = true;
    state.data[ifExists].isWithdrawn = true;
  }
};
export const updateOrder = (state, payload) => {
  const ifExists = state.data.findIndex(
    (item) => item.etherscan === payload.etherscan,
  );
  if (ifExists !== -1 && ifExists !== undefined) {
    state.data[ifExists].dstAmount = payload.dstAmount;
  }
};
export const cancel = (state, payload) => state.data.splice(payload, 1);
export const addTx = (state, payload) => { state.tx = payload; };
export const addSelectedAddress = (state, payload) => { state.selectedAddress = payload; };

import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  Cell,
  contractAddress,
  beginCell,
  SendMode,
  Dictionary,
  TupleBuilder,
   toNano
} from "ton-core";

const Opcodes = {
  deploy: 0,
  withdraw: 1,
  place_up: 2,
  place_down: 3,
  withdraw_winning: 5
};

export default class BetsWallet implements Contract {

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  async getRounds(provider: ContractProvider) {
    const result = await provider.get('get_rounds', []);
    let cell = result.stack.readCell();
    let dict = cell.beginParse().loadDictDirect(Dictionary.Keys.Uint(256), Dictionary.Values.Address());
    return dict.values();
  }
}

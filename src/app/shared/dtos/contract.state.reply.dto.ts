import { Contract } from "../models/contract";

export interface ContractStateReplyDTO {
  contract: Contract
  isAccepted: boolean
}

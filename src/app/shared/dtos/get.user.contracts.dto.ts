import {Contract} from "../models/contract";

export interface getUserContractsDTO {
  personalContract: Contract[],
  domainContracts: Contract[]
}

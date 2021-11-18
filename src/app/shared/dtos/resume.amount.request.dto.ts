import {Resume} from "../models/resume";
import {ResumeDTO} from "./resumeDTO";

export interface ResumeAmountRequestDTO {
  resumes: ResumeDTO[]
  excludeContract?: number
}

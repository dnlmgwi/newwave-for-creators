import { BenefitStatus } from "../../utils/enums/BenefitStatus";

export interface BenefitDTO {
  id: string;
  name: string;
  description: string;
  benefactorId: string;
  status: BenefitStatus;
  createdAt: string;
}

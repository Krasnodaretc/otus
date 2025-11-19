import { EvaluationContext } from '../../common/types';

export type RequestContext = EvaluationContext & {
  ip?: string;
};

export type ResponseResult = {
  status: number;
  location?: string;
  matchedRuleId?: string;
};



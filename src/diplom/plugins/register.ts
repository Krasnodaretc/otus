import { registerAction, registerCondition } from '../rules-engine/registry';
import { skillCondition } from './conditions/skill';
import { geoCondition } from './conditions/geo';
import { localeCondition } from './conditions/locale';
import { deviceCondition } from './conditions/device';
import { osCondition } from './conditions/os';
import { browserCondition } from './conditions/browser';
import { timeWindowCondition } from './conditions/timeWindow';
import { abBucketCondition } from './conditions/abBucket';
import { capacityCondition } from './conditions/capacity';
import { referrerCondition } from './conditions/referrer';
import { sourceCondition } from './conditions/source';
import { featureFlagCondition } from './conditions/featureFlag';
import { redirectAction } from './actions/redirect';
import { appendUtmAction } from './actions/appendUtm';
import { webhookAction } from './actions/webhook';
import { deeplinkAction } from './actions/deeplink';

export const registerBuiltInPlugins = () => {
  registerCondition(skillCondition);
  registerCondition(geoCondition);
  registerCondition(localeCondition);
  registerCondition(deviceCondition);
  registerCondition(osCondition);
  registerCondition(browserCondition);
  registerCondition(timeWindowCondition);
  registerCondition(abBucketCondition);
  registerCondition(capacityCondition);
  registerCondition(referrerCondition);
  registerCondition(sourceCondition);
  registerCondition(featureFlagCondition);
  registerAction(redirectAction);
  registerAction(appendUtmAction);
  registerAction(webhookAction);
  registerAction(deeplinkAction);
};



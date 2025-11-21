import { RedirectFacade } from "./RedirectFacade";
import { PipelineFactory } from "./PipelineFactory";
import {MongoRedirectResolver} from "./service";

export const redirectFacadeFactory = async () => {
    const mongoRedirectResolver = new MongoRedirectResolver()
    const factory = await PipelineFactory.createWithNatsFallback(mongoRedirectResolver);
    const facade = new RedirectFacade(factory.build());

    return facade;
};

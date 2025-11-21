import { RedirectFacade } from "./RedirectFacade";
import { PipelineFactory } from "./PipelineFactory";

export const redirectFacadeFactory = async () => {
    const factory = await PipelineFactory.createWithNatsFallback();
    const facade = new RedirectFacade(factory.build());

    return facade;
};
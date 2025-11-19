import { IApiKeyRepository, ICampaignRepository, ISmartLinkRepository, IVacancyRepository } from '../domain/IRepositories';

export class CreateCampaignHandler {
  constructor(private readonly repo: ICampaignRepository) {}
  execute(payload: any) {
    return this.repo.create(payload);
  }
}
export class ListCampaignsHandler {
  constructor(private readonly repo: ICampaignRepository) {}
  execute(query?: any) {
    return this.repo.list(query);
  }
}

export class CreateSmartLinkHandler {
  constructor(private readonly repo: ISmartLinkRepository) {}
  execute(payload: any) {
    return this.repo.create(payload);
  }
}
export class ListSmartLinksHandler {
  constructor(private readonly repo: ISmartLinkRepository) {}
  execute(query?: any) {
    return this.repo.list(query);
  }
}

export class CreateVacancyHandler {
  constructor(private readonly repo: IVacancyRepository) {}
  execute(payload: any) {
    return this.repo.create(payload);
  }
}
export class ListVacanciesHandler {
  constructor(private readonly repo: IVacancyRepository) {}
  execute(query?: any) {
    return this.repo.list(query);
  }
}

export class IssueApiKeyHandler {
  constructor(private readonly repo: IApiKeyRepository) {}
  execute(payload: any) {
    return this.repo.create(payload);
  }
}
export class ListApiKeysHandler {
  constructor(private readonly repo: IApiKeyRepository) {}
  execute(query?: any) {
    return this.repo.list(query);
  }
}



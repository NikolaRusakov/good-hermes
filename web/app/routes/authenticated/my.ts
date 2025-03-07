import Route from "@ember/routing/route";
import RSVP from "rsvp";
import { inject as service } from "@ember/service";
import ConfigService from "hermes/services/config";
import { DocumentsRouteParams } from "hermes/types/document-routes";
import AlgoliaService from "hermes/services/algolia";

export default class AuthenticatedMyRoute extends Route {
  @service declare algolia: AlgoliaService;
  @service("config") declare configSvc: ConfigService;

  queryParams = {
    docType: {
      refreshModel: true,
    },
    owners: {
      refreshModel: true,
    },
    page: {
      refreshModel: true,
    },
    product: {
      refreshModel: true,
    },
    sortBy: {
      refreshModel: true,
    },
    status: {
      refreshModel: true,
    },
  };

  async model(params: DocumentsRouteParams) {
    const searchIndex =
      params.sortBy === "dateAsc"
        ? this.configSvc.config.algolia_docs_index_name + "_createdTime_asc"
        : this.configSvc.config.algolia_docs_index_name + "_createdTime_desc";
    return RSVP.hash({
      facets: this.algolia.getFacets.perform(searchIndex, params, true),
      results: this.algolia.getDocResults.perform(searchIndex, params, true),
    });
  }
}

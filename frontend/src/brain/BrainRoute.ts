import {
  CheckHealthData,
  CheckHealthResult,
  DocumentRequest,
  FollowUpRequest,
  GenerateDocumentData,
  GenerateFollowUpData,
  GetCustomerInsightsData,
  GetSalesAnalyticsData,
  GetSupabaseConfigData,
  ListDocumentsData,
  SalesAnalyticsRequest,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Get Supabase configuration for client use
   * @tags dbtn/module:supabase
   * @name get_supabase_config
   * @summary Get Supabase Config
   * @request GET:/routes/config
   */
  export namespace get_supabase_config {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSupabaseConfigData;
  }

  /**
   * No description
   * @tags dbtn/module:sales
   * @name get_sales_analytics
   * @summary Get Sales Analytics
   * @request POST:/routes/sales-analytics
   */
  export namespace get_sales_analytics {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SalesAnalyticsRequest;
    export type RequestHeaders = {};
    export type ResponseBody = GetSalesAnalyticsData;
  }

  /**
   * No description
   * @tags dbtn/module:sales
   * @name get_customer_insights
   * @summary Get Customer Insights
   * @request GET:/routes/customer-insights
   */
  export namespace get_customer_insights {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCustomerInsightsData;
  }

  /**
   * No description
   * @tags dbtn/module:sales
   * @name generate_follow_up
   * @summary Generate Follow Up
   * @request POST:/routes/generate-follow-up
   */
  export namespace generate_follow_up {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = FollowUpRequest;
    export type RequestHeaders = {};
    export type ResponseBody = GenerateFollowUpData;
  }

  /**
   * No description
   * @tags dbtn/module:document
   * @name generate_document
   * @summary Generate Document
   * @request POST:/routes/generate-document
   */
  export namespace generate_document {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DocumentRequest;
    export type RequestHeaders = {};
    export type ResponseBody = GenerateDocumentData;
  }

  /**
   * No description
   * @tags dbtn/module:document
   * @name list_documents
   * @summary List Documents
   * @request GET:/routes/documents
   */
  export namespace list_documents {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListDocumentsData;
  }

  /**
   * @description Simple health check endpoint to verify API connectivity. Used by the TestingPage for validating API connections.
   * @tags dbtn/module:health
   * @name check_health
   * @summary Check Health
   * @request GET:/routes/health
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthResult;
  }
}

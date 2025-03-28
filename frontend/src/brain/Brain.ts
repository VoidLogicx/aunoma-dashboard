import {
  CheckHealthData,
  CheckHealthResult,
  DocumentRequest,
  FollowUpRequest,
  GenerateDocumentData,
  GenerateDocumentError,
  GenerateFollowUpData,
  GenerateFollowUpError,
  GetCustomerInsightsData,
  GetSalesAnalyticsData,
  GetSalesAnalyticsError,
  GetSupabaseConfigData,
  ListDocumentsData,
  SalesAnalyticsRequest,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get Supabase configuration for client use
   *
   * @tags dbtn/module:supabase
   * @name get_supabase_config
   * @summary Get Supabase Config
   * @request GET:/routes/config
   */
  get_supabase_config = (params: RequestParams = {}) =>
    this.request<GetSupabaseConfigData, any>({
      path: `/routes/config`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:sales
   * @name get_sales_analytics
   * @summary Get Sales Analytics
   * @request POST:/routes/sales-analytics
   */
  get_sales_analytics = (data: SalesAnalyticsRequest, params: RequestParams = {}) =>
    this.request<GetSalesAnalyticsData, GetSalesAnalyticsError>({
      path: `/routes/sales-analytics`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:sales
   * @name get_customer_insights
   * @summary Get Customer Insights
   * @request GET:/routes/customer-insights
   */
  get_customer_insights = (params: RequestParams = {}) =>
    this.request<GetCustomerInsightsData, any>({
      path: `/routes/customer-insights`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:sales
   * @name generate_follow_up
   * @summary Generate Follow Up
   * @request POST:/routes/generate-follow-up
   */
  generate_follow_up = (data: FollowUpRequest, params: RequestParams = {}) =>
    this.request<GenerateFollowUpData, GenerateFollowUpError>({
      path: `/routes/generate-follow-up`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:document
   * @name generate_document
   * @summary Generate Document
   * @request POST:/routes/generate-document
   */
  generate_document = (data: DocumentRequest, params: RequestParams = {}) =>
    this.request<GenerateDocumentData, GenerateDocumentError>({
      path: `/routes/generate-document`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:document
   * @name list_documents
   * @summary List Documents
   * @request GET:/routes/documents
   */
  list_documents = (params: RequestParams = {}) =>
    this.request<ListDocumentsData, any>({
      path: `/routes/documents`,
      method: "GET",
      ...params,
    });

  /**
   * @description Simple health check endpoint to verify API connectivity. Used by the TestingPage for validating API connections.
   *
   * @tags dbtn/module:health
   * @name check_health
   * @summary Check Health
   * @request GET:/routes/health
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthResult, any>({
      path: `/routes/health`,
      method: "GET",
      ...params,
    });
}

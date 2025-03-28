/** CustomerInsightsResponse */
export interface CustomerInsightsResponse {
  /** Segments */
  segments: CustomerSegment[];
  /** Top Opportunities */
  top_opportunities: object[];
  /** Ai Recommendations */
  ai_recommendations: string[];
}

/** CustomerSegment */
export interface CustomerSegment {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** Size */
  size: number;
  /** Avg Order Value */
  avg_order_value: number;
  /** Purchase Frequency */
  purchase_frequency: number;
  /** Description */
  description: string;
}

/** Document */
export interface Document {
  /** Id */
  id: string;
  /** Title */
  title: string;
  /** Document Type */
  document_type: string;
  /** Content */
  content: string;
  /** Created At */
  created_at: string;
  /** Export Formats */
  export_formats?: string[] | null;
}

/** DocumentListResponse */
export interface DocumentListResponse {
  /** Documents */
  documents: Document[];
}

/** DocumentRequest */
export interface DocumentRequest {
  /** Document Type */
  document_type: string;
  /** Description */
  description: string;
  /** Title */
  title?: string | null;
  /** Format */
  format?: string | null;
}

/** DocumentResponse */
export interface DocumentResponse {
  document: Document;
}

/** FollowUpRequest */
export interface FollowUpRequest {
  /** Context */
  context: string;
  /**
   * Type
   * @default "sales"
   */
  type?: string;
}

/** FollowUpResponse */
export interface FollowUpResponse {
  /** Templates */
  templates: FollowUpTemplate[];
}

/** FollowUpTemplate */
export interface FollowUpTemplate {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** Content */
  content: string;
  /** Type */
  type: string;
  /** Created At */
  created_at: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** SalesAnalyticsRequest */
export interface SalesAnalyticsRequest {
  /**
   * Period
   * @default "monthly"
   */
  period?: string;
}

/** SalesAnalyticsResponse */
export interface SalesAnalyticsResponse {
  /** Period */
  period: string;
  /** Data */
  data: object;
  /** Insights */
  insights: string[];
  /** Recommendations */
  recommendations: string[];
}

/** SupabaseConfigResponse */
export interface SupabaseConfigResponse {
  /** Url */
  url: string;
  /** Anon Key */
  anon_key: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** HealthResponse */
export interface AppApisHealthHealthResponse {
  /** Status */
  status: string;
  /** Version */
  version: string;
}

/** HealthResponse */
export interface DatabuttonAppMainHealthResponse {
  /** Status */
  status: string;
}

export type CheckHealthData = DatabuttonAppMainHealthResponse;

export type GetSupabaseConfigData = SupabaseConfigResponse;

export type GetSalesAnalyticsData = SalesAnalyticsResponse;

export type GetSalesAnalyticsError = HTTPValidationError;

export type GetCustomerInsightsData = CustomerInsightsResponse;

export type GenerateFollowUpData = FollowUpResponse;

export type GenerateFollowUpError = HTTPValidationError;

export type GenerateDocumentData = DocumentResponse;

export type GenerateDocumentError = HTTPValidationError;

export type ListDocumentsData = DocumentListResponse;

export type CheckHealthResult = AppApisHealthHealthResponse;

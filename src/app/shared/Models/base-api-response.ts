import { ApiResponse } from "./api-response";

export interface BaseApiResponse<T> extends ApiResponse {
    data:T
}

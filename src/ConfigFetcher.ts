import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";
import axios from "axios";
import type {
  IConfigFetcher,
  IFetchResponse,
  OptionsBase,
} from "configcat-common";
import { FetchError } from "configcat-common";

export class HttpConfigFetcher implements IConfigFetcher {
  async fetchLogic(
    options: OptionsBase,
    lastEtag: string | null
  ): Promise<IFetchResponse> {
    // If we are not running in browser set the If-None-Match header.
    const headers: AxiosRequestHeaders | { "If-None-Match": string } =
      typeof window !== "undefined" || !lastEtag
        ? ({} as AxiosRequestHeaders)
        : { "If-None-Match": lastEtag };

    const axiosConfig: AxiosRequestConfig<string> = {
      method: "get",
      timeout: options.requestTimeoutMs,
      url: options.getUrl(),
      headers: headers,
      responseType: "text",
      transformResponse: (data: any) => data,
    };

    let response: AxiosResponse<string> | undefined;
    try {
      response = await axios(axiosConfig);
    }
    catch (err) {
      ({ response } = err as AxiosError<string>);
      if (response) {
        const { status: statusCode, statusText: reasonPhrase } = response;
        return { statusCode, reasonPhrase };
      }
      else if ((err as AxiosError<string>).request) {
        const { code, message } = err as AxiosError<string>;
        switch (code) {
          case "ERR_CANCELED":
            throw new FetchError("abort");
          case "ECONNABORTED":
            // Axios ambiguously use ECONNABORTED instead of ETIMEDOUT, so we need this additional check to detect timeout
            // (see https://github.com/axios/axios/issues/1543#issuecomment-558166483)
            if (message.indexOf("timeout") >= 0) {
              throw new FetchError("timeout", options.requestTimeoutMs);
            }
            break;
          default:
            break;
        }
        throw new FetchError("failure", err);
      }

      throw err;
    }

    if (!response) {
      throw new Error("Response is undefined");
    }

    const { status: statusCode, statusText: reasonPhrase } = response;
    if (response.status === 200) {
      const eTag = response.headers.etag as string;
      return { statusCode, reasonPhrase, eTag, body: response.data };
    }

    return { statusCode, reasonPhrase };
  }
}

import type { IConfigFetcher, IFetchResponse, OptionsBase } from "configcat-common";

export class HttpConfigFetcher implements IConfigFetcher {
  fetchLogic(options: OptionsBase, _: string | null): Promise<IFetchResponse> {
    return new Promise<IFetchResponse>((resolve, reject) => {
      options.logger.debug("HttpConfigFetcher.fetchLogic() called.");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.requestTimeoutMs);

      fetch(options.getUrl(), {
        method: "GET",
        signal: controller.signal
      }).then(response => {
        const statusCode = response.status;
        const reasonPhrase = response.statusText;
        if (statusCode === 200) {
          const eTag: string | undefined = response.headers.get("ETag") ?? void 0;
          response.text().then(body => {
            resolve({ statusCode, eTag, body, reasonPhrase });
          });
        }
        else if (statusCode) {
          resolve({ statusCode, reasonPhrase });
        }
      })
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
    });
  }
}

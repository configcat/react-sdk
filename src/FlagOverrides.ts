import { type FlagOverrides, OverrideBehaviour, type SettingValue, createFlagOverridesFromMap } from "configcat-common";

const DEFAULT_PARAM_PREFIX = "cc-";
const FORCE_STRING_VALUE_SUFFIX = ";str";

export interface IQueryStringProvider {
  readonly currentValue?: string | { [key: string]: string | ReadonlyArray<string> };
}

class DefaultQueryStringProvider implements IQueryStringProvider {
  get currentValue() { return window?.location.search; }
}

let defaultQueryStringProvider: DefaultQueryStringProvider | undefined;

type SettingMap = { [name: string]: Setting };

export class QueryParamsOverrideDataSource implements IOverrideDataSource {
  private readonly watchChanges?: boolean;
  private readonly paramPrefix: string;
  private readonly queryStringProvider: IQueryStringProvider;
  private queryString: string | undefined;
  private settings: SettingMap;

  constructor(watchChanges?: boolean, paramPrefix?: string, queryStringProvider?: IQueryStringProvider) {
    this.watchChanges = watchChanges;
    this.paramPrefix = paramPrefix ?? DEFAULT_PARAM_PREFIX;

    queryStringProvider ??= defaultQueryStringProvider ??= new DefaultQueryStringProvider();
    this.queryStringProvider = queryStringProvider;

    const currentQueryStringOrParams = queryStringProvider.currentValue;
    this.settings = extractSettings(currentQueryStringOrParams, this.paramPrefix);
    this.queryString = getQueryString(currentQueryStringOrParams);
  }

  getOverrides(): Promise<SettingMap> {
    return Promise.resolve(this.getOverridesSync());
  }

  getOverridesSync(): SettingMap {
    if (this.watchChanges) {
      const currentQueryStringOrParams = this.queryStringProvider.currentValue;
      const currentQueryString = getQueryString(currentQueryStringOrParams);
      if (this.queryString !== currentQueryString) {
        this.settings = extractSettings(currentQueryStringOrParams, this.paramPrefix);
        this.queryString = currentQueryString;
      }
    }

    return this.settings;
  }
}

function getQueryString(queryStringOrParams: string | { [key: string]: string | ReadonlyArray<string> } | undefined) {
  if (queryStringOrParams == null) {
    return "";
  }

  if (typeof queryStringOrParams === "string") {
    return queryStringOrParams;
  }

  let queryString = "", separator = "?";

  for (const key in queryStringOrParams) {
    if (!Object.prototype.hasOwnProperty.call(queryStringOrParams, key)) continue;

    const values = queryStringOrParams[key] as string | string[];
    let value: string, length: number;

    if (!Array.isArray(values)) value = values, length = 1;
    else if (values.length) value = values[0], length = values.length;
    else continue;

    for (let i = 0; ;) {
      queryString += separator + encodeURIComponent(key) + "=" + encodeURIComponent(value);
      if (++i >= length) break;
      separator = "&";
      value = values[i];
    }
  }

  return queryString;
}

function extractSettings(queryStringOrParams: string | { [key: string]: string | ReadonlyArray<string> } | undefined, paramPrefix: string) {
  const settings: SettingMap = {};

  if (typeof queryStringOrParams === "string") {
    extractSettingFromQueryString(queryStringOrParams, paramPrefix, settings);
  }
  else if (queryStringOrParams != null) {
    extractSettingsFromQueryParams(queryStringOrParams, paramPrefix, settings);
  }

  return settings;
}

function extractSettingsFromQueryParams(queryParams: { [key: string]: string | ReadonlyArray<string> } | undefined, paramPrefix: string, settings: SettingMap) {
  for (const key in queryParams) {
    if (!Object.prototype.hasOwnProperty.call(queryParams, key)) continue;

    const values = queryParams[key] as string | string[];
    let value: string, length: number;

    if (!Array.isArray(values)) value = values, length = 1;
    else if (values.length) value = values[0], length = values.length;
    else continue;

    for (let i = 0; ;) {
      extractSettingFromQueryParam(key, value, paramPrefix, settings);
      if (++i >= length) break;
      value = values[i];
    }
  }
}

function extractSettingFromQueryString(queryString: string, paramPrefix: string, settings: SettingMap) {
  if (!queryString
    || queryString.lastIndexOf("?", 0) < 0) { // identical to `!queryString.startsWith("?")`
    return;
  }

  const parts = queryString.substring(1).split("&");
  for (let part of parts) {
    part = part.replace(/\+/g, " ");
    const index = part.indexOf("=");

    const key = decodeURIComponent(index >= 0 ? part.substring(0, index) : part);
    const value = index >= 0 ? decodeURIComponent(part.substring(index + 1)) : "";

    extractSettingFromQueryParam(key, value, paramPrefix, settings);
  }
}

function extractSettingFromQueryParam(key: string, value: string, paramPrefix: string, settings: SettingMap) {
  if (!key
    || key.length <= paramPrefix.length
    || key.lastIndexOf(paramPrefix, 0) < 0) { // identical to `!key.startsWith(paramPrefix)`
    return;
  }

  key = key.substring(paramPrefix.length);

  const interpretValueAsString = key.length > FORCE_STRING_VALUE_SUFFIX.length
    && key.indexOf(FORCE_STRING_VALUE_SUFFIX, key.length - FORCE_STRING_VALUE_SUFFIX.length) >= 0; // identical to `key.endsWith(strSuffix)`

  if (interpretValueAsString) {
    key = key.substring(0, key.length - FORCE_STRING_VALUE_SUFFIX.length);
  }
  else {
    value = parseSettingValue(value) as unknown as string;
  }

  settings[key] = settingConstuctor.fromValue(value);
}

function parseSettingValue(value: string): NonNullable<SettingValue> {
  switch (value.toLowerCase()) {
    case "false":
      return false;
    case "true":
      return true;
    default:
      const number = parseFloatStrict(value);
      return !isNaN(number) ? number : value;
  }
}

function parseFloatStrict(value: string): number {
  // NOTE: JS's float to string conversion is too forgiving, it converts whitespace string to 0 and accepts hex numbers.

  if (!value.length || /^\s*$|^\s*0[^\d.e]/.test(value)) {
    return NaN;
  }

  return +value;
}

// The following types and functions aren't part of configcat-common's public API,
// so for now we need this hack to make things work.
// TODO: move the flag override data source into the new unified JS SDK and
// get rid of this workaround as soon as it's released.

type IOverrideDataSource = FlagOverrides["dataSource"];

type Setting = ReturnType<IOverrideDataSource["getOverridesSync"]>[""];

type FlagOverridesConstructor = {
  new(dataSource: IOverrideDataSource, behaviour: OverrideBehaviour): FlagOverrides;
}

type SettingConstructor = {
  fromValue(value: NonNullable<SettingValue>): Setting;
};

const [flagOverridesConstructor, settingConstuctor] = (() => {
  const dummyFlagOverrides = createFlagOverridesFromMap({ "$": 0 }, OverrideBehaviour.LocalOnly);
  const dummySetting = dummyFlagOverrides.dataSource.getOverridesSync()["$"];
  return [
    (dummyFlagOverrides as any).constructor as FlagOverridesConstructor,
    (dummySetting as any).constructor as SettingConstructor
  ];
})();

export { flagOverridesConstructor };

import { type FlagOverrides, OverrideBehaviour, type SettingValue, createFlagOverridesFromMap } from "configcat-common";

export interface IQueryStringProvider {
  readonly currentValue?: string;
}

class DefaultQueryStringProvider implements IQueryStringProvider {
  get currentValue() { return window?.location.search; }
}

let defaultQueryStringProvider: DefaultQueryStringProvider | undefined;

export class QueryParamsOverrideDataSource implements IOverrideDataSource {
  private readonly watchChanges?: boolean;
  private readonly paramPrefix: string;
  private readonly queryStringProvider: IQueryStringProvider;
  private queryString: string | undefined;
  private settings: { [name: string]: Setting };

  constructor(watchChanges?: boolean, paramPrefix?: string, queryStringProvider?: IQueryStringProvider) {
    this.watchChanges = watchChanges;
    this.paramPrefix = paramPrefix ?? "cc-";

    queryStringProvider ??= defaultQueryStringProvider ??= new DefaultQueryStringProvider();
    this.queryStringProvider = queryStringProvider;

    const currentQueryString = queryStringProvider.currentValue;
    this.queryString = currentQueryString;
    this.settings = extractSettingsFromQueryString(currentQueryString, this.paramPrefix);
  }

  getOverrides(): Promise<{ [name: string]: Setting }> {
    return Promise.resolve(this.getOverridesSync());
  }

  getOverridesSync(): { [name: string]: Setting } {
    if (this.watchChanges) {
      const currentQueryString = this.queryStringProvider.currentValue;
      if (currentQueryString !== this.queryString) {
        this.queryString = currentQueryString;
        this.settings = extractSettingsFromQueryString(currentQueryString, this.paramPrefix);
      }
    }

    return this.settings;
  }
}

function extractSettingsFromQueryString(queryString: string | undefined, paramPrefix: string) {
  const settings: { [name: string]: Setting } = {};

  if (!queryString
    || queryString.lastIndexOf("?", 0) < 0) { // identical to `queryString.startsWith("?")`
    return settings;
  }

  const parts = queryString.substring(1).split("&");
  for (let part of parts) {
    part = part.replace(/\+/g, " ");
    const index = part.indexOf("=");

    let key = decodeURIComponent(index >= 0 ? part.substring(0, index) : part);
    if (!key
      || key.length <= paramPrefix.length
      || key.lastIndexOf(paramPrefix, 0) < 0) { // identical to `!key.startsWith(paramPrefix)`
      continue;
    }
    key = key.substring(paramPrefix.length);

    const strSuffix = ";str";
    const forceInterpretValueAsString = key.length > strSuffix.length
      && key.indexOf(strSuffix, key.length - strSuffix.length) >= 0; // identical to `key.endsWith(strSuffix)`

    let value: boolean | string | number = index > -1 ? decodeURIComponent(part.substring(index + 1)) : "";

    if (forceInterpretValueAsString) {
      key = key.substring(0, key.length - strSuffix.length);
    }
    else {
      value = parseQueryStringValue(value);
    }

    settings[key] = settingConstuctor.fromValue(value);
  }

  return settings;
}

function parseQueryStringValue(value: string): boolean | string | number {
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

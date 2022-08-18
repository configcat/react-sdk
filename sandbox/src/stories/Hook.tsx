import React, { useCallback, useState } from 'react';
import { useConfigCatClient, useFeatureFlag, ConfigCatProvider } from 'configcat-react';

export const HookComponent = (args: { featureFlagKey: string }) => {
  const client = useConfigCatClient();
  const isFeatureEnabled = useFeatureFlag(args.featureFlagKey, false);
  return (
    <div>
      <div>
        <button onClick={useCallback(async () => { await client.forceRefreshAsync() }, [client])} >Force refresh</button>
      </div>

      <div>
        {args.featureFlagKey} evaluated to {isFeatureEnabled ? 'True' : 'False'}
      </div>

    </div>
  );
};


export const HookPage = (args: { sdkKey: string, pollIntervalSeconds: number, featureFlagKey: string }) => {

  const [configLastChanged, setConfigLastChanged] = useState<Date | undefined>(undefined);
  const [logs, setLogs] = useState<string>('');

  const log = (message: string, level: string) => {
    setLogs(prev => { return new Date().toISOString() + ' - ' + level + ': ' + message + '\n' + prev })
  }
  return (
    <article>
      <h1>Auto poll tests</h1>
      <p></p>
      <ConfigCatProvider sdkKey={args.sdkKey} options={{
        pollIntervalSeconds: args.pollIntervalSeconds,
        logger: {
          debug(message) { log(message, 'debug'); },
          info(message) { log(message, 'info'); },
          error(message) { log(message, 'error'); },
          warn(message) { log(message, 'warn'); },
          log(message) { log(message, 'log'); },
        },
        configChanged: () => {
          setConfigLastChanged(new Date());
        }
      }}>
        <HookComponent featureFlagKey={args.featureFlagKey}></HookComponent>
        <div>Config last changed at: {configLastChanged?.toISOString() ?? 'N/A'}</div>

        <div>
          ConfigCatClient Logs:
          <textarea readOnly value={logs} style={{ "height": "auto", "width": "100%" }} rows={30} />
        </div>
      </ConfigCatProvider>
    </article>
  );
};

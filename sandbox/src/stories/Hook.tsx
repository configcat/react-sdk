import React, { useCallback, useState } from 'react';
import { useConfigCatClient, useFeatureFlag, ConfigCatProvider, LogLevel } from 'configcat-react';

export const HookComponent = (args: { featureFlagKey: string }) => {
  const client = useConfigCatClient();
  const userObject = {identifier: 'asdad121212sd'};
  const { value: isFeatureEnabled, loading } = useFeatureFlag(args.featureFlagKey, false, userObject);

  return (
    <div>
      <div>
        <button onClick={useCallback(async () => { await client.forceRefreshAsync() }, [client])} >Force refresh</button>
      </div>

      {loading ?
        (<div>Loading...</div>) :
        (<div>
          {args.featureFlagKey} evaluated to {isFeatureEnabled ? 'True' : 'False'}
        </div>)}
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
          level: LogLevel.Debug,
          debug(message) { log(message, 'debug'); },
          info(message) { log(message, 'info'); },
          error(message) { log(message, 'error'); },
          warn(message) { log(message, 'warn'); },
          log(message) { log(message, 'log'); },
        },
        setupHooks: (hooks) => {
          hooks.on('clientReady', ()=>setConfigLastChanged(new Date()));
          hooks.on('configChanged', newConfig =>setConfigLastChanged(new Date(newConfig.Timestamp)));
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

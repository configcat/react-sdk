import { useCallback, useState } from 'react';
import { useConfigCatClient, useFeatureFlag, ConfigCatProvider, LogLevel, User } from 'configcat-react';

export const HookComponent = (args: { featureFlagKey: string }) => {
  const client = useConfigCatClient();
  const userObject = new User('asdad121212sd');
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
          log(level, _eventId, message, _ex) { log(message.toString(), LogLevel[level].toLowerCase()); }
        },
        setupHooks: (hooks) => {
          hooks.on('clientReady', () => setConfigLastChanged(new Date()));
          hooks.on('configChanged', _newConfig => setConfigLastChanged(new Date()));
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

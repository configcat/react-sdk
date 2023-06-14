import React, { useState } from 'react';
import { ConfigCatProvider, LogLevel, withConfigCatClient, WithConfigCatClientProps } from 'configcat-react';


class HocComponent extends React.Component<
  { featureFlagKey: string } & WithConfigCatClientProps,
  { isEnabled: boolean, loading: boolean }
> {
  constructor(props: { featureFlagKey: string } & WithConfigCatClientProps) {
    super(props);

    this.state = { isEnabled: false, loading: true };
  }

  componentDidMount() {
    this.evaluateFeatureFlag();
  }

  componentDidUpdate(prevProps: any) {
    // To achieve hot reload on config.json updates.
    if (prevProps?.lastUpdated !== this.props.lastUpdated) {
      this.evaluateFeatureFlag();
    }
  }

  evaluateFeatureFlag() {
    this.props
      .getValue(this.props.featureFlagKey, false)
      .then((v: boolean) => this.setState({ isEnabled: v, loading: false }));
  }

  render() {
    return this.state.loading ?
      (<div>Loading...</div>) : (
        <div>
          {this.props.featureFlagKey} evaluated to {this.state.isEnabled ? 'True' : 'False'}
        </div>
      );
  }
}

const ConfigCatHocComponent = withConfigCatClient(HocComponent);

export const HocPage = (args: { sdkKey: string, pollIntervalSeconds: number, featureFlagKey: string }) => {

  const [configLastChanged, setConfigLastChanged] = useState<Date | undefined>(undefined);
  const [logs, setLogs] = useState<string>('');

  const log = (message: string, level: string) => {
    setLogs(prev => { return new Date().toISOString() + ' - ' + level + ': ' + message + '\n' + prev })
  }
  return (
    <article>
      <h1>HOC tests</h1>
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
        <ConfigCatHocComponent featureFlagKey={args.featureFlagKey}></ConfigCatHocComponent>
        <div>Config last changed at: {configLastChanged?.toISOString() ?? 'N/A'}</div>

        <div>
          ConfigCatClient Logs:
          <textarea readOnly value={logs} style={{ "height": "auto", "width": "100%" }} rows={30} />
        </div>
      </ConfigCatProvider>
    </article>
  );
};

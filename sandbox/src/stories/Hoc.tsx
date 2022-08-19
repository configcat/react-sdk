import React, { useState } from 'react';
import { ConfigCatProvider, withConfigCatClient, WithConfigCatClientProps } from 'configcat-react';


class HocComponent extends React.Component<
  { featureFlagKey: string } & WithConfigCatClientProps,
  { isEnabled: boolean }
> {
  constructor(props: { featureFlagKey: string } & WithConfigCatClientProps) {
    super(props);

    this.state = { isEnabled: false };
  }

  componentDidMount() {
    this.evaluateFeatureFlag();
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps?.lastUpdated !== this.props.lastUpdated) {
      this.evaluateFeatureFlag();
    }
  }

  evaluateFeatureFlag() {
    this.props
      .getValue(this.props.featureFlagKey, false)
      .then((v: boolean) => this.setState({ isEnabled: v }));
  }

  render() {
    return (
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

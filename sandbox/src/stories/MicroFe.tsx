import React from 'react';
import { useFeatureFlag, ConfigCatProvider, User } from 'configcat-react';

export const C1 = (args: { featureFlagKey: string }) => {

  const userObject = new User('microFrontendUser1');
  const { value: isFeatureEnabled, loading } = useFeatureFlag(args.featureFlagKey, false, userObject);

  return (
    <div>
      {loading ?
        (<div>Loading...</div>) :
        (<div>
          {args.featureFlagKey} evaluated to {isFeatureEnabled ? 'True' : 'False'}
        </div>)}
    </div>
  );
};

export const C2 = (args: { featureFlagKey: string }) => {

  return (
    <div>
      <ConfigCatProvider sdkKey="fnvWCKwpfPETf3O6BQgQAg/PcumoL97MEW-6NVcM7oKMQ" options={{pollIntervalSeconds:7}}>
        <C1 featureFlagKey={args.featureFlagKey}></C1>
      </ConfigCatProvider>
    </div>
  );
};

export const MicroFePage = () => {

  return (
    <article>
      <h1>Embeded provider test</h1>

        <div>
          <ConfigCatProvider sdkKey="fnvWCKwpfPETf3O6BQgQAg/iMRmhH6DmECovlBvRtjpDw" options={{pollIntervalSeconds:10}}>
            
            <C1 featureFlagKey={"isDebugModeOn"}></C1>
            

            <ConfigCatProvider sdkKey="configcat-sdk-1/fnvWCKwpfPETf3O6BQgQAg/Idklvfo85EaPWoX9zOygNA" options={{pollIntervalSeconds:10}}>
              <C1 featureFlagKey={"sharedfeature1"}></C1>

              <C2 featureFlagKey={"mySecondFlag"}></C2>

            </ConfigCatProvider>

          </ConfigCatProvider>
        </div>
        
    </article>
  );
};

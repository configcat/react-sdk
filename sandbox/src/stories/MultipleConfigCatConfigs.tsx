import React from 'react';
import { ConfigCatProvider, User, useFeatureFlagByConfigId, withConfigCatClient } from 'configcat-react';
import { HocComponent} from  './Hoc';


const CC_CONFIGID = { BACKEND: "BACKEND", SHARED: "SHARED"};

const CC_SDK = { 
  BACKEND: "TODO - INSERT BACKEND SDK KEY",
  SHARED:"TODO - INSERT SHARED SDK KEY"}

const userObject = new User('microFrontendUser1');

export const C1 = (args: { featureFlagKey: string, configId: string }) => {

  const { value: isFeatureEnabled, loading } = useFeatureFlagByConfigId(args.configId, args.featureFlagKey, false, userObject);

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

const ConfigCatHocComponent = withConfigCatClient(HocComponent, CC_CONFIGID.BACKEND)

export const MultipleConfigCatConfigs = () => {

  return (
    <article>
      <h1>Embeded provider test</h1>

        <div>
          <ConfigCatProvider sdkKey={CC_SDK.SHARED} options={{pollIntervalSeconds:10}} configId={CC_CONFIGID.SHARED}>
            
            <C1 featureFlagKey={"sharedfeature1"} configId={CC_CONFIGID.SHARED}></C1>

            <ConfigCatProvider sdkKey={CC_SDK.BACKEND} options={{pollIntervalSeconds:10}} configId={CC_CONFIGID.BACKEND}>
              <C1 featureFlagKey={"isDebugModeOn"} configId={CC_CONFIGID.BACKEND}></C1>
              <C1 featureFlagKey={"sharedfeature1"} configId={CC_CONFIGID.SHARED}></C1>
            

            {/* Higher-Order Components sample */}
              <ConfigCatHocComponent featureFlagKey={"isDebugModeOn"} user={userObject}/>
            </ConfigCatProvider>

          </ConfigCatProvider>
        </div>
        
    </article>
  );
};

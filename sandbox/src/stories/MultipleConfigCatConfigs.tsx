import React from 'react';
import { ConfigCatProvider, useFeatureFlag, User, withConfigCatClient } from 'configcat-react';
import { HocComponent} from  './Hoc';


const CC_CONFIGID = { BACKEND: "BACKEND", SHARED: "SHARED"};

const CC_SDK = { 
  BACKEND: "TODO - INSERT SDKKEY",
  SHARED:"TODO - INSERT SDKKEY"}

const userObject = new User('microFrontendUser1');

export const C1 = (args: { featureFlagKey: string, providerId: string }) => {

  const { value: isFeatureEnabled, loading } = useFeatureFlag(args.featureFlagKey, false, userObject, args.providerId);

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

const ConfigCatHocComponentBackEnd = withConfigCatClient(HocComponent, CC_CONFIGID.BACKEND)
const ConfigCatHocComponentShared = withConfigCatClient(HocComponent, CC_CONFIGID.SHARED)

export const MultipleConfigCatConfigs = () => {

  return (
    <article>
      <h1>Embeded provider test</h1>

        <div>
          <ConfigCatProvider sdkKey={CC_SDK.SHARED} options={{pollIntervalSeconds:10}} id={CC_CONFIGID.SHARED}> 
                Level1
                <C1 featureFlagKey={"sharedfeature1"} providerId={CC_CONFIGID.SHARED}></C1>
                <br />
                <ConfigCatProvider sdkKey={CC_SDK.BACKEND} options={{pollIntervalSeconds:10}} id={CC_CONFIGID.BACKEND}>
                    Level2 - Functional Component samples

                    <C1 featureFlagKey={"isDebugModeOn"} providerId={CC_CONFIGID.BACKEND}></C1>
                    <C1 featureFlagKey={"sharedfeature1"} providerId={CC_CONFIGID.SHARED}></C1>
                    <br />
                    Level2 - Higher-Order Component samples

                    <ConfigCatHocComponentBackEnd featureFlagKey={"isDebugModeOn"} user={userObject}/>
                    <ConfigCatHocComponentShared featureFlagKey={"sharedfeature1"} user={userObject}/>
                </ConfigCatProvider>
          </ConfigCatProvider>
        </div>
        
    </article>
  );
};

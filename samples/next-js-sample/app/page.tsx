import { ConfigCatProvider } from "../../../lib/types";
import { ClientFlagDemo } from "./ClientFlagDemo";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Home() {
  return (
    <ConfigCatProvider sdkKey="zVPVCO5_LS9VnDcpIDE84g/zVPVCBScEzDn-VNq0dnYog">
      <ClientFlagDemo />
    </ConfigCatProvider>
  );
}

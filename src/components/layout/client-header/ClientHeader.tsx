import MobileView from "./MobileView";
import DesktopView from "./DesktopView";

export default function ClientHeader() {
  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}
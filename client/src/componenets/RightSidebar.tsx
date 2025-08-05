import Suggetion from "./Suggetion";
import Chattmodel from "./Chattmodel";

const RightSidebar = () => {
  return (
    <>
      <div className="w-[20%] px-5 py-4 flex-col gap-3 sm:flex hidden">
        <Suggetion />
        <Chattmodel />
      </div>
    </>
  );
};

export default RightSidebar;

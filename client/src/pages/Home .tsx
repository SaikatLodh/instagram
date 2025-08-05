import Feed from "../componenets/post/Feed ";
import RightSidebar from "../componenets/RightSidebar";

const Home = () => {
  return (
    <div className="flex w-full">
      <div className="flex-grow sm:m-0 m-3">
        {/* <Feed /> */}
        <Feed />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;

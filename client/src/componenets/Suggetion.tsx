import { useSuggestedUser } from "../../hooks/react-query/query-hooks/userqueryhook";
import { Link } from "react-router-dom";

const Suggetion = () => {
  const { data: suggetionUsers } = useSuggestedUser();
console.log(suggetionUsers);
  return (
    <>
      {suggetionUsers && suggetionUsers?.length > 0 && (
        <div className="h-[44%] overflow-y-auto feed">
          <div>
            <h6 className="text-[23px]">Suggested for you</h6>
          </div>

          <div className="flex flex-col gap-4">
            {suggetionUsers &&
              suggetionUsers?.map((item) => {
                return (
                  <Link to={`/otheraccount/${item._id}`}>
                    <div key={item?._id}>
                      <div className="flex items-center p-4 bg-card rounded-lg shadow-md">
                        <img
                          src={item.profilePicture?.url}
                          alt="Profile picture of Julia Clarke"
                          className="rounded-full mr-3 w-[50px] h-[50px] object-cover"
                        />

                        <div>
                          <h2 className="text-lg font-semibold text-foreground">
                            {item.username}
                          </h2>
                          {/* <p className="text-muted-foreground">{item.bio}</p> */}
                        </div>

                        {/* <button className="ml-auto p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                          <img
                            aria-hidden="true"
                            alt="Chat icon"
                            src="https://openui.fly.dev/openui/24x24.svg?text=💬"
                            className="w-5 h-5"
                          />
                        </button> */}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default Suggetion;

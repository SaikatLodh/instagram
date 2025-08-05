import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useContextApi } from "../../../context/Contextapi";
import { useDebouncedCallback } from "use-debounce";
import { useSearchUser } from "../../../hooks/react-query/query-hooks/userqueryhook";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
const Search = () => {
  const { setShow } = useContextApi();
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");
  const { user: currentuser } = useSelector((state: RootState) => state.auth);
  const debounced = useDebouncedCallback(
    (value) => {
      setSearch(value);
    },

    100
  );
  debounced(value);
  const { data: recentSearches } = useSearchUser(search);

  return (
    <>
      <div
        className="overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99] h-[100%] overflow-y-auto  w-full bg-black opacity-50"
        onClick={() => setShow(false)}
      ></div>
      <div className="sm:w-full w-[90%] max-w-md mx-auto  bg-white rounded-xl shadow-lg overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99] sm:h-[500px] h-[400px] overflow-y-auto">
        <div className="p-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold mb-2">Search</h2>
          <div className="flex items-center gap-2 bg-white border border-zinc-700 rounded-md px-3 py-2">
            <FaSearch className="text-zinc-400 text-sm" />
            <input
              type="text"
              placeholder="Search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm placeholder-zinc-400"
            />
          </div>
        </div>

        <div className="p-4">
          {recentSearches &&
            recentSearches.map((user) => (
              <Link
                to={`${
                  currentuser?._id === user?._id
                    ? `/profile`
                    : `/otheraccount/${user._id}`
                }`}
                key={user?._id}
                onClick={() => setShow(false)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.profilePicture?.url}
                      alt={user?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold">{user?.username}</p>
                      <p className="text-xs text-zinc-400">
                        {user.username} •{" "}
                        {user._id !== currentuser?._id && (
                          <>
                            <h6 className="text-[#86a6fd] cursor-pointer">
                              {user?.followers.includes(
                                currentuser?._id as string
                              )
                                ? "Following"
                                : "Follow"}
                            </h6>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Search;

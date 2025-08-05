import React from "react";
import { PostType } from "../../types";
import Postallcommentshow from "./Postallcommentshow";
import { useLocation } from "react-router-dom";
const Postpopup = ({
  items,
  open,
  setOpen,
}: {
  items: PostType | undefined;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" || location.pathname === "/explore" ? (
        <>
          <div className={`${open ? "block" : "hidden"}`}>
            <div
              className={`popup-overlay fixed w-full h-full z-[8] bg-[#0000004d] top-0 left-0`}
              onClick={() => setOpen(false)}
            ></div>

            <div className="flex justify-center items-center fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:w-[70%] w-[90%] h-[90%] ] z-90">
              <div className="fixed w-full h-full bg-[white] sm:px-8 px-2 py-8">
                <div className="popup-content w-full h-full">
                  <div className="flex w-full h-full">
                    <div className="w-[60%] h-full sm:block hidden">
                      <img
                        src={items?.contant?.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="sm:px-3 overflow-y-auto w-full">
                      <Postallcommentshow items={items} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={`${open ? "block" : "hidden"}`}>
            <div
              className={`popup-overlay fixed w-full h-full z-[8] bg-[#0000004d] top-0 left-0`}
              onClick={() => setOpen(false)}
            ></div>

            <div className="flex justify-center items-center fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[90%] z-9">
              <div className="fixed w-full h-full bg-[white] px-8 py-8">
                <div className="popup-content w-full h-full">
                  <div className="flex w-full h-full">
                    <div className="w-[60%] h-full">
                      <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        controls
                        src={items?.contant?.url}
                      ></video>
                    </div>

                    <div className="px-3 overflow-y-auto w-full">
                      <Postallcommentshow items={items} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Postpopup;

import React, { useEffect, useState } from "react";
import { FaCodePullRequest } from "react-icons/fa6";
import { BiDetail } from "react-icons/bi";
import { Avatar, Badge, Card, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../contexts/authContext";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import RequestContribModal from "./RequestContribModal";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
const { Meta } = Card;
const PostCard = ({ post, isMyProfile, deletePost }) => {
  const [liked, setLiked] = useState();
  const [likesCount, setLikesCount] = useState(post?.likes?.length);
  const [auth] = useAuth();
  const [open, setOpen] = useState(false);
  const [ContributionRequestStatus, setContributionRequestStatus] = useState(
    (post?.contributionRequests && post?.contributionRequests?.length) || 0
  );
  console.log(post);
  const navigate = useNavigate();
  useEffect(() => {
    setLiked(post?.likes?.includes(auth?.user?.id?.toString()));
  }, [post?.likes, auth, post]);

  const handleLike = async (id, status) => {
    if (status == 1 && auth?.user) {
      const { data } = await axios.put("/api/v1/posts/addlike", {
        userID: auth?.user?.id,
        id,
      });
      setLiked(true);
      setLikesCount(data?.likesCount);
    } else if (status === 0 && auth?.user) {
      const { data } = await axios.put("/api/v1/posts/removeLike", {
        userID: auth?.user?.id,
        id,
      });
      setLiked(false);
      setLikesCount(data?.likesCount);
    } else {
      navigate("/login");
    }
  };

  return (
    <div key={post?.id} className="mb-5 flex justify-center lg:ml-1 mx-2">
      <Card
        className="shadow-md hover:drop-shadow-xl  "
        style={{ width: 320 }}
        cover={
          <>
            <img
              className="hover:cursor-pointer"
              // src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              src={`http://localhost:5000${
                post?.thumbnailImgURL?.split("/")?.length > 1
                  ? post.thumbnailImgURL
                  : "/uploads/default.gif"
              }`}
              loading="lazy"
              alt="Thumbnail"
              onClick={() => navigate(`/detailsPost/${post?.id}`)}
            />
          </>
        }
        actions={[
          <>
            <span className="flex justify-center ml-5 mt-0 text-red-500 ">
              {liked ? (
                <FaHeart
                  key={"liked"}
                  onClick={() => handleLike(post?.id, 0)}
                  className="text-red-600 "
                  size={23}
                />
              ) : (
                <FaRegHeart
                  key={"unliked"}
                  onClick={() => handleLike(post?.id, 1)}
                  className="text-red-600"
                  size={23}
                />
              )}
              <Badge
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "black",
                  userSelect: "none",
                }}
                count={likesCount}
                className="mx-1 "
              />
            </span>
          </>,
          <>
            <span className="flex justify-center items-center mt-0 text-blue-500 ">
              {isMyProfile ? (
                <AiFillDelete
                  size={25}
                  onClick={() => deletePost({ id: post?.id })}
                  className=""
                />
              ) : !ContributionRequestStatus ? (
                <FaCodePullRequest
                  key={"request"}
                  size={18}
                  onClick={() => {
                    if (!auth?.user) {
                      return navigate("/login");
                    }
                    setOpen(true);
                  }}
                />
              ) : (
                <>
                  <IoCheckmarkDoneCircleSharp
                    className="text-green-500"
                    size={25}
                  />
                </>
              )}
            </span>
          </>,
          <>
            <span className="flex justify-center items-center mt-0 text-gray-600">
              <BiDetail
                onClick={() => navigate(`/detailsPost/${post?.id}`)}
                key="ellipsis"
                size={24}
              />
            </span>
          </>,
        ]}
      >
        <Meta
          avatar={
            <Avatar
              className="font-bold"
              style={{
                backgroundColor: "#B9D9EB",
                color: "#0070FF",
              }}
            >
              {post?.user?.toString().slice(0, 1)?.toUpperCase()}
            </Avatar>
          }
          title={
            <>
              <div>
                <span
                  className="hover:cursor-pointer hover:text-blue-300"
                  onClick={() => navigate(`/detailsPost/${post?.id}`)}
                >
                  {post?.name?.length > 20
                    ? post?.name?.substring(0, 20) + "..."
                    : post?.name}
                </span>
                {/* {!isMyProfile && (
                  <span className="float-end">
                    <button
                      style={{
                        fontSize: "12px",
                        paddingInline: "10px",
                      }}
                      className=" flex justify-center items-center bg-gray-700 text-white rounded-xl p-0.5"
                    >
                      <span>
                        <RiUserFollowLine size={15} className="mr-1" />
                      </span>
                      Follow
                    </button>
                  </span>
                )} */}
              </div>
            </>
          }
          {...console.log(post?.technologiesUsed)}
          description={post?.technologiesUsed?.map((item, i) => (
            <Tag key={i} color={"blue"} className="p-1  m-1">
              <span className="text-blue-600 font-semibold">
                {item?.toUpperCase()}
              </span>
            </Tag>
          ))}
        />
      </Card>
      <div>
        <RequestContribModal
          open={open}
          setOpen={setOpen}
          postData={post}
          setContributionRequestStatus={setContributionRequestStatus}
        />
      </div>
    </div>
  );
};

export default PostCard;

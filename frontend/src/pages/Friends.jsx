import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Button from "../components/Button";
import axios from "axios";

const Friends = () => {
  const [id, setId] = useState();
  const [friends, setFriends] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get("http://localhost:3000/user/discover", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setFriends(response.data.friends);
        console.log(friends);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const addFriend = async (id) => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3000/friend/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setLoading(false);
        if (response.data.status === "ok") {
          alert(
            `You successfully sent a friend request to ${response.data.name} `
          );
        } else {
          alert(`You are already friends with ${response.data.name} `);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <div>
      <h2>friends</h2>
      {loading || friends == undefined ? (
        <Loading />
      ) : (
        <div>
          {friends.map((friend, index) => (
            <div
              key={friend._id}
              className="flex items-center bg-sky-400 h-20 justify-evenly w-60 text-left m-[5px]"
            >
              <div>{index + 1}</div>
              <div>{friend.username}</div>
              <input
                className=" bg-red-600 h-[40px] w-[100px] rounded-2xl text-amber-50 hover:opacity-80 cursor-pointer"
                type="submit"
                value="add"
                onClick={() => addFriend(friend._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;

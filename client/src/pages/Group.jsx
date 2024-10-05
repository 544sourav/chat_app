import { useState, useEffect } from "react";
import { createGroup, fetchMyFriends } from "../service/operations/chatAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export const Group = () => {
 
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]); 
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState(""); 
  const {token} = useSelector((state)=>state.auth)
   
    const dispatch = useDispatch()
   
    const navigate = useNavigate();


  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetchMyFriends(token,dispatch,navigate)  
        setMembers(response);
      } catch (error) {
        console.error("Error fetching members", error);
      }
    };

    fetchMembers();
  }, []);


  const handleMemberSelection = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    );
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMembers.length<2){ 
      setError("Please select at least 2 members");
    } 
    
    else{
      try {
        await createGroup(token, groupName, selectedMembers);
      } catch (error) {
        console.error("Error creating group", error);
      }
    }
    
  };

  return (
    <div className="w-11/12 mx-auto  overflow-x-hidden p-8">
      <div className=" w-11/12  mx-auto p-6">
        <h2 className="text-xl font-bold mb-4 text-center text-white pt-10">
          Create Group
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col ">
          {/* Group Name Input */}
          <div className="mb-4">
            <label
              className=" mb-2 text-[0.875rem] leading-[1.375rem] text-white text-sm  "
              htmlFor="groupName"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2  bg-deepblue-800 border-gray-300  focus:outline-none "
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Members Selection */}
          <div className="mb-4">
            <label
              className=" mb-2 text-[0.875rem] leading-[1.375rem] text-white text-sm "
              htmlFor="members"
            >
              Select Members
            </label>

            <div className="flex flex-wrap">
              {members.map((member) => {
                const isSelected = selectedMembers.includes(member.members[0]);

                return (
                  <div
                    key={member._id}
                    onClick={() => handleMemberSelection(member.members[0])}
                    className={`cursor-pointer flex  border  items-center mr-4 my-2 p-2  transition-colors duration-100 ${
                      isSelected
                        ? "border-tele-100 bg-deepblue-900"
                        : "border-deepblue-700 bg-deepblue-800"
                    }`}
                  >
                    <img
                      src={member.image}
                      alt={member.chatName}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-sm  text-white font-medium">
                      {member.chatName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-tele-100 mx-auto text-white px-4 py-2  hover:bg-blue-600"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};



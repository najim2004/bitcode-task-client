import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function RoadmapItem({ item, onUpvote, onClick }) {
  const { user: authUser } = useContext(AuthContext);

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {item.title}
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium
              ${
                item.category === "Feature"
                  ? "bg-blue-100 text-blue-700"
                  : item.category === "Bug"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {item.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium
              ${
                item.status === "Planned"
                  ? "bg-gray-100 text-gray-700"
                  : item.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {item.status}
            </span>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>Posted by {item.author}</span>
            <span className="mx-2">•</span>
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(item._id);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button
            ${
              item.upvotes.includes(authUser?._id)
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
        >
          <i className="fas fa-arrow-up text-sm"></i>
          <span className="font-medium">{item.upvotes.length}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap !rounded-button">
          <i className="fas fa-comment text-sm"></i>
          <span className="font-medium">{item.commentsCount || 0}</span>
        </button>
      </div>
    </div>
  );
}

export default RoadmapItem;

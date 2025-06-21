import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import RoadmapItem from "./RoadmapItem";
import Filters from "./Filters";
import CommentSection from "./CommentSection";

function RoadmapList() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/roadmap", {
          params: {
            category: category !== "all" ? category : undefined,
            status: status !== "all" ? status.replace("-", " ") : undefined,
            sort: sortBy === "popular" ? "popularity" : "createdAt",
          },
          withCredentials: true,
        });
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch roadmap items:", err);
      }
    };
    fetchItems();
  }, [category, status, sortBy]);

  const handleUpvote = async (itemId) => {
    if (!user) return alert("Please log in to upvote");
    try {
      const item = items.find((item) => item._id === itemId);
      if (!item) return;
      const updatedItem = {
        ...item,
        upvotes: item.upvotes.includes(user._id)
          ? item.upvotes.filter((uid) => uid !== user._id)
          : [...item.upvotes, user._id],
      };
      setItems(items.map((i) => (i._id === itemId ? updatedItem : i)));
      await axios.post(
        `http://localhost:5000/api/roadmap/${itemId}/upvote`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      setItems([...items]); // Rollback
      alert("Failed to upvote");
    }
  };

  const openModal = (item) => {
    console.log("Item clicked:", item); // Add this line
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const filteredItems = items.filter((item) => {
    if (category !== "all" && item.category.toLowerCase() !== category)
      return false;
    if (
      status !== "all" &&
      item.status.replace(" ", "-").toLowerCase() !== status
    )
      return false;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.upvotes.length - a.upvotes.length;
    }
  });

  return (
    <div className="max-w-3xl w-full mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Product Roadmap</h1>
      <Filters
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <div className="space-y-4">
        {sortedItems.map((item) => (
          <RoadmapItem
            key={item._id}
            item={item}
            user={user}
            onUpvote={handleUpvote}
            onClick={() => openModal(item)}
          />
        ))}
        {sortedItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <i className="fas fa-search text-4xl text-gray-300 mb-3"></i>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No items found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
      {(isModalOpen && selectedItem) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedItem.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="overflow-y-auto p-6 flex-grow">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    selectedItem.category === "Feature"
                      ? "bg-blue-100 text-blue-700"
                      : selectedItem.category === "Bug"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {selectedItem.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    selectedItem.status === "Planned"
                      ? "bg-gray-100 text-gray-700"
                      : selectedItem.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {selectedItem.status}
                </span>
                <button
                  onClick={() => handleUpvote(selectedItem._id)}
                  className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button
                    ${
                      selectedItem.upvotes.includes(user?._id)
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <i className="fas fa-arrow-up text-sm"></i>
                  <span className="font-medium">
                    {selectedItem.upvotes.length}
                  </span>
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">{selectedItem.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Posted by {selectedItem.author}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <CommentSection roadmapItemId={selectedItem._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoadmapList;

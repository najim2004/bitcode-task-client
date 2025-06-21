import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function CommentSection({ roadmapItemId }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/comments", {
          params: { roadmapItem: roadmapItemId },
          withCredentials: true,
        });
        console.log("Fetched comments:", res.data); // Debug log
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };
    fetchComments();
  }, [roadmapItemId]);

  const handleAddComment = async () => {
    if (!user) return alert("Please log in to comment");
    if (!newComment.trim()) return;
    if (newComment.length > 300)
      return alert("Comment cannot exceed 300 characters");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/comments",
        { content: newComment, roadmapItem: roadmapItemId, parentId: null },
        { withCredentials: true }
      );
      setComments([...comments, { ...res.data, replies: [] }]);
      setNewComment("");
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setEditingComment(null);
  };

  const submitReply = async () => {
    if (!user) return alert("Please log in to reply");
    if (!replyText.trim() || !replyingTo) return;
    if (replyText.length > 300)
      return alert("Reply cannot exceed 300 characters");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/comments",
        {
          content: replyText,
          roadmapItem: roadmapItemId,
          parentId: replyingTo,
        },
        { withCredentials: true }
      );
      setComments(addCommentToTree(comments, res.data, replyingTo));
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      alert("Failed to add reply");
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.content);
    setReplyingTo(null);
  };

  const submitEdit = async () => {
    if (!editText.trim() || !editingComment) return;
    if (editText.length > 300)
      return alert("Comment cannot exceed 300 characters");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/comments/${editingComment}`,
        { content: editText },
        { withCredentials: true }
      );
      setComments(updateCommentInTree(comments, editingComment, res.data));
      setEditText("");
      setEditingComment(null);
    } catch (err) {
      alert("Failed to edit comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!user) return alert("Please log in to delete comments");
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        withCredentials: true,
      });
      setComments(removeCommentFromTree(comments, commentId));
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  const addCommentToTree = (comments, newComment, parentId) => {
    if (!parentId) return [...comments, { ...newComment, replies: [] }];
    return comments.map((comment) => {
      if (comment._id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), { ...newComment, replies: [] }],
        };
      }
      return {
        ...comment,
        replies: addCommentToTree(comment.replies || [], newComment, parentId),
      };
    });
  };

  const updateCommentInTree = (comments, id, updatedComment) => {
    return comments.map((comment) => {
      if (comment._id === id) return { ...comment, ...updatedComment };
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies || [], id, updatedComment),
      };
    });
  };

  const removeCommentFromTree = (comments, id) => {
    return comments
      .filter((comment) => comment._id !== id)
      .map((comment) => ({
        ...comment,
        replies: removeCommentFromTree(comment.replies || [], id),
      }));
  };

  const renderComments = (comments, depth = 0) => {
    if (!comments || comments.length === 0) return null;
    return (
      <div
        className={`space-y-4 ${
          depth > 0 ? "ml-8 pl-4 border-l border-gray-200" : ""
        }`}
      >
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {comment.user?.email[0]?.toUpperCase() || "?"}
                </div>
                <div className="ml-3">
                  <span className="font-medium text-gray-900">
                    {comment.user?.email || "Unknown"}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {comment.depth < 3 && (
                  <button
                    onClick={() => handleReply(comment._id)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className="fas fa-reply"></i>
                  </button>
                )}
                {user?._id === comment.user?._id && (
                  <>
                    <button
                      onClick={() => handleEdit(comment)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap !rounded-button"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap !rounded-button"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
            {editingComment === comment._id ? (
              <div className="mt-3">
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                ></textarea>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setEditingComment(null)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitEdit}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-600">
                {comment.content || "No content"}
              </p>
            )}
            {replyingTo === comment._id && (
              <div className="mt-3">
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                ></textarea>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReply}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            )}
            {renderComments(comment.replies || [], depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
      <div className="mb-6">
        <textarea
          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
          >
            Post Comment
          </button>
        </div>
      </div>
      {renderComments(comments.filter((c) => !c.parentId))}
      {comments.filter((c) => !c.parentId).length === 0 && (
        <div className="text-center py-8">
          <i className="fas fa-comments text-4xl text-gray-300 mb-3"></i>
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </div>
  );
}

export default CommentSection;

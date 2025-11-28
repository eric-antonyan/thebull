import React from "react";

interface MentionPopupProps {
  search: string;
  users: { id: string; name: string }[];
  onSelect: (user: any) => void;
}

const MentionPopup: React.FC<MentionPopupProps> = ({
  search,
  users,
  onSelect,
}) => {
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!search.trim() || filtered.length === 0) return null;

  return (
    <div className="absolute bottom-16 left-4 w-56 bg-gray-900 text-white rounded-xl shadow-lg z-[999] p-2">
      {filtered.map((u) => (
        <button
          key={u.id}
          onClick={() => onSelect(u)}
          className="w-full p-2 text-left rounded-lg hover:bg-gray-800"
        >
          @{u.name}
        </button>
      ))}
    </div>
  );
};

export default MentionPopup;

"use client";

interface CreateClientButtonProps {
  onClick: () => void;
}

export default function CreateClientButton({
  onClick,
}: CreateClientButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span className="hidden sm:inline">Create New Client</span>
      <span className="sm:hidden">New</span>
    </button>
  );
}

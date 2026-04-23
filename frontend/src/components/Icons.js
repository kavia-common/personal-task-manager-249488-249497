import React from "react";

function BaseIcon({ children }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

// PUBLIC_INTERFACE
export function PlusIcon() {
  /** Plus icon. */
  return (
    <BaseIcon>
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

// PUBLIC_INTERFACE
export function CheckIcon() {
  /** Checkmark icon. */
  return (
    <BaseIcon>
      <path
        d="M5 12.5l4 4L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

// PUBLIC_INTERFACE
export function DeleteIcon() {
  /** Trash/delete icon. */
  return (
    <BaseIcon>
      <path
        d="M9 3h6m-8 5h10m-1 0-.7 12.1a2 2 0 0 1-2 1.9H9.7a2 2 0 0 1-2-1.9L7 8m3 3v7m4-7v7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

// PUBLIC_INTERFACE
export function EditIcon() {
  /** Pencil/edit icon. */
  return (
    <BaseIcon>
      <path
        d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.8l-.2-.2a2 2 0 0 0-2.8 0L5 17v3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

// PUBLIC_INTERFACE
export function SaveIcon() {
  /** Disk/save icon. */
  return (
    <BaseIcon>
      <path
        d="M6 3h11l1 2v16H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 3v6h8V3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 21v-7h8v7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </BaseIcon>
  );
}

// PUBLIC_INTERFACE
export function XIcon() {
  /** Close/X icon. */
  return (
    <BaseIcon>
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

// PUBLIC_INTERFACE
export function FilterIcon() {
  /** Filter/funnel icon. */
  return (
    <BaseIcon>
      <path
        d="M4 5h16l-6 7v6l-4 2v-8L4 5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

// PUBLIC_INTERFACE
export function ClipboardIcon() {
  /** Clipboard icon. */
  return (
    <BaseIcon>
      <path
        d="M9 3h6a2 2 0 0 1 2 2v2H7V5a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 7h10v14H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 11h6M9 15h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

// PUBLIC_INTERFACE
export function ReorderIcon() {
  /** Reorder/drag handle icon. */
  return (
    <BaseIcon>
      <path
        d="M8 7h12M8 12h12M8 17h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 7h.01M5 12h.01M5 17h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

"use client";

import { useState } from "react";

export default function CopyPublicProfileLink({
  playerId,
}: {
  playerId: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const profileUrl = `${window.location.origin}/recruiting/player/${playerId}`;

    await navigator.clipboard.writeText(profileUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={copyLink}
      className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
    >
      {copied ? "Copied Public Link!" : "Copy Public Profile Link"}
    </button>
  );
}
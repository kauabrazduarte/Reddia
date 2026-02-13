"use client";

import React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import copy from "copy-to-clipboard";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function PixValue() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    copy("pix@kaua.dev.br", {
      debug: true,
      message: "Press #{key} to copy",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroupInput
        placeholder="pix@kaua.dev.br"
        className="placeholder:text-zinc-50 placeholder:opacity-100"
        disabled
        readOnly
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton aria-label="Copy" onClick={handleCopy} size="icon-xs">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

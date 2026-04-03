"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function DocumentAddForm({
  isWorking,
  onAdd,
}: {
  isWorking: boolean;
  onAdd: (formData: FormData) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
    if (file) formData.set("file", file);
    onAdd(formData);
    setTitle("");
    setContent("");
    setFile(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Add note title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Example: Tone guardrails"
          className="bg-muted/50"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Paste repository content</Label>
        <Textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste new guidance or extracted notes..."
          className="bg-muted/50"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Or upload .txt / .md</Label>
        <Input
          type="file"
          accept=".txt,.md,text/plain,text/markdown"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="bg-muted/50 file:text-muted-foreground"
        />
      </div>

      <Button type="submit" disabled={isWorking} className="w-full">
        Add document
      </Button>
    </form>
  );
}

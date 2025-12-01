import { useState, useRef, useCallback } from "react";
import { Bold, Italic, Code, List, ListOrdered, Link, Image, Heading1, Heading2, Quote, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const MarkdownEditor = ({ value, onChange, placeholder = "Write your content here...", minHeight = "300px" }: MarkdownEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertAtCursor = useCallback((before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  }, [value, onChange]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      insertAtCursor(`![${file.name}](`, ")", base64);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [insertAtCursor]);

  const toolbarActions = [
    { icon: Heading1, action: () => insertAtCursor("# ", "", "Heading"), title: "Heading 1" },
    { icon: Heading2, action: () => insertAtCursor("## ", "", "Heading"), title: "Heading 2" },
    { icon: Bold, action: () => insertAtCursor("**", "**", "bold text"), title: "Bold" },
    { icon: Italic, action: () => insertAtCursor("*", "*", "italic text"), title: "Italic" },
    { icon: Code, action: () => insertAtCursor("```\n", "\n```", "code"), title: "Code Block" },
    { icon: Quote, action: () => insertAtCursor("> ", "", "quote"), title: "Quote" },
    { icon: List, action: () => insertAtCursor("- ", "", "item"), title: "Bullet List" },
    { icon: ListOrdered, action: () => insertAtCursor("1. ", "", "item"), title: "Numbered List" },
    { icon: Link, action: () => insertAtCursor("[", "](url)", "link text"), title: "Link" },
    { icon: Image, action: () => fileInputRef.current?.click(), title: "Upload Image" },
  ];

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering
    let html = text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-foreground mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-foreground mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-foreground mt-4 mb-2">$1</h1>')
      // Bold and Italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm font-mono text-foreground">$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-cyan hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images (including base64)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-cyan pl-4 italic text-muted-foreground my-2">$1</blockquote>')
      // Unordered lists
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="my-2">')
      .replace(/\n/g, '<br />');
    
    return `<div class="prose prose-invert max-w-none"><p class="my-2">${html}</p></div>`;
  };

  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          {toolbarActions.map(({ icon: Icon, action, title }) => (
            <Button
              key={title}
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
              onClick={action}
              title={title}
              disabled={isPreview}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={!isPreview ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setIsPreview(false)}
          >
            <Edit className="mr-1 h-3 w-3" />
            Write
          </Button>
          <Button
            type="button"
            variant={isPreview ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setIsPreview(true)}
          >
            <Eye className="mr-1 h-3 w-3" />
            Preview
          </Button>
        </div>
      </div>

      {/* Editor / Preview */}
      {isPreview ? (
        <div 
          className={cn("p-4 text-foreground overflow-auto", !value && "text-muted-foreground")}
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ 
            __html: value ? renderMarkdown(value) : "<p>Nothing to preview</p>" 
          }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none font-mono text-sm"
          style={{ minHeight }}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default MarkdownEditor;

import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContentPageEditorProps = {
  title: string;
  imageUrl: string;
  content: string;
  onTitleChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onContentChange: (value: string) => void;
};

export function ContentPageEditor({
  title,
  imageUrl,
  content,
  onTitleChange,
  onImageUrlChange,
  onContentChange,
}: ContentPageEditorProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="content-page-title">Title</Label>
        <Input
          id="content-page-title"
          placeholder="Enter slide title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content-page-image">Image URL (Optional)</Label>
        <Input
          id="content-page-image"
          placeholder="https://... (leave empty to skip image)"
          value={imageUrl}
          onChange={(event) => onImageUrlChange(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Leave this blank if the slide should not include an image.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="content-page-markdown">Markdown Content</Label>
          <Textarea
            id="content-page-markdown"
            placeholder="Write your markdown content here..."
            className="min-h-[260px]"
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Markdown Preview</Label>
          <div className="prose prose-slate min-h-[260px] rounded-md border bg-muted/20 p-3 text-sm dark:prose-invert">
            <ReactMarkdown>{content || "_No markdown content yet._"}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TitlePageEditorProps = {
  title: string;
  onTitleChange: (value: string) => void;
};

export function TitlePageEditor({ title, onTitleChange }: TitlePageEditorProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="title-page-input">Title</Label>
      <Input
        id="title-page-input"
        placeholder="Enter title slide heading"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
      />
    </div>
  );
}

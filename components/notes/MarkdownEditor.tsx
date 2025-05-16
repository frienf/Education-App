import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  content: string;
  onChange: (content: string) => void;
};

export default function MarkdownEditor({ content, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Markdown Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your Markdown here..."
          className="min-h-[300px]"
        />
      </CardContent>
    </Card>
  );
}
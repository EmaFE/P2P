import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Post({ title, content }) {
  return (
    <Card className="mb-4 transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  );
}
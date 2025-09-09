import ReactMarkdown from "react-markdown";
import readmeContent from "../../README.md?raw"; // vite supports `?raw` import

export default function About() {
  return (
    <div className="card p-6 rounded-2xl max-w-4xl mx-auto shadow-lg hover:shadow-2xl transition-all text-left prose dark:prose-invert">
      <ReactMarkdown>{readmeContent}</ReactMarkdown>
    </div>
  );
}

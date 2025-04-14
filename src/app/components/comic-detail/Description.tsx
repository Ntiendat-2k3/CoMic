interface DescriptionProps {
    content: string;
  }
  
  const Description = ({ content }: DescriptionProps) => (
    <div
      className="prose prose-invert max-w-none prose-p:text-gray-300 
        prose-strong:text-white prose-headings:text-white border-t border-gray-800 pt-6 text-gray-300"
    >
      <h3 className="text-xl font-semibold mb-4">Nội dung</h3>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
  
  export default Description;
interface DescriptionProps {
  content: string
}

const Description = ({ content }: DescriptionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <span className="text-blue-400 text-lg">📖</span>
      <h3 className="text-lg font-semibold text-white">Nội dung truyện</h3>
    </div>

    <div className="bg-gray-600 rounded-lg p-4">
      <div
        className="prose prose-invert max-w-none
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-strong:text-white prose-strong:font-semibold
          prose-headings:text-white
          prose-a:text-blue-400 prose-a:hover:text-blue-300
          prose-blockquote:border-l-blue-400 prose-blockquote:bg-blue-900/20
          prose-code:text-blue-400 prose-code:bg-blue-900/20"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  </div>
)

export default Description

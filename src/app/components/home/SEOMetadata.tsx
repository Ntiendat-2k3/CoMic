interface SEOMetadataProps {
    seoData?: {
      titleHead?: string;
      descriptionHead?: string;
      og_type?: string;
      og_image?: string[];
    };
  }
  
  const SEOMetadata = ({ seoData }: SEOMetadataProps) => (
    <div className="hidden">
      <meta property="og:title" content={seoData?.titleHead} />
      <meta property="og:description" content={seoData?.descriptionHead} />
      <meta property="og:type" content={seoData?.og_type} />
      {seoData?.og_image?.map((img, index) => (
        <meta
          key={`og-image-${index}`}
          property="og:image"
          content={`https://img.otruyenapi.com${img}`}
        />
      ))}
    </div>
  );
  
  export default SEOMetadata;
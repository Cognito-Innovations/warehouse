import React from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

interface Document {
  id: string;
  document_name: string;
  document_url: string;
  category: string;
}

interface ExpandedPackageSectionProps {
  documents: Document[];
}

const ExpandedPackageSection: React.FC<ExpandedPackageSectionProps> = ({ documents }) => {
  if (!documents?.length) {
    return (
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <p className="text-gray-500 text-sm italic">Document is not uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="bg-white p-2 rounded border border-gray-200 shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {documents.map((doc) => {
            if (!doc || !doc.document_url) {
              return null;
            }
            const isPdf = doc.document_name.toLowerCase().endsWith(".pdf");
            return (
              <div key={doc.id} className="relative text-center w-20">
                {isPdf ? (
                  <div
                    onClick={() => window.open(doc.document_url, "_blank")}
                    className="w-20 h-15 flex items-center justify-center bg-gray-100 rounded border border-gray-200 cursor-pointer hover:bg-gray-200"
                  >
                    <PictureAsPdfIcon className="text-gray-600 text-3xl" />
                  </div>
                ) : (
                  <img
                    src={doc.document_url}
                    alt={doc.document_name}
                    onClick={() => window.open(doc.document_url, "_blank")}
                    className="w-20 h-15 object-cover rounded border border-gray-200 cursor-pointer"
                  />
                )}
                <p className="block w-full truncate text-xs text-gray-500 mt-1">
                  {doc.document_name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExpandedPackageSection;
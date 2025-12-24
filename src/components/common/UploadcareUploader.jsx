import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

export default function UploadcareUploader({ onUploaded, pubkey }) {
  return (
    <FileUploaderRegular
      pubkey={pubkey}
      multiple={false}
      sourceList="local, camera, facebook, gdrive"
      classNameUploader="uc-light"
      onFileUploadSuccess={(file) => onUploaded(file?.cdnUrl || "")}
    />
  );
}

import { Alert } from "react-native";
import { useCallback, useState } from "react";
import { uploadProductPdfUseCase } from "../../di/storeFactory";

export function useUploadPdfViewModel({
  productId,
  onUploaded,
}: {
  productId: string;
  onUploaded: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [fileUri, setFileUri] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  /**
   * Pick a PDF file from the device.
   *
   * expo-document-picker is not installed in this workspace, so there is no native
   * picker wired here yet. The admin can paste a file URI manually (e.g. from a file
   * copied into the app's documents directory). To enable native picking:
   *   npx expo install expo-document-picker
   * then call DocumentPicker.getDocumentAsyncAsync({ type: "application/pdf" })
   * inside this function and set fileUri/fileName from the result.
   */
  const pickFile = useCallback(() => {
    setServerError(null);
    void Alert.alert(
      "File picker not installed",
      "Install expo-document-picker to pick files natively, or paste a file URI above.",
      [{ text: "OK" }],
    );
  }, []);

  const upload = useCallback(async () => {
    if (!fileUri) {
      setServerError("Please provide a PDF file URI.");
      return;
    }

    setUploading(true);
    setServerError(null);
    try {
      await uploadProductPdfUseCase.execute(productId, {
        uri: fileUri,
        name: fileName || "document.pdf",
        type: "application/pdf",
      });
      onUploaded();
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "PDF upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }, [fileUri, fileName, productId, onUploaded]);

  return {
    fileUri,
    fileName,
    setFileUri,
    setFileName,
    uploading,
    serverError,
    pickFile,
    upload,
  };
}

import supabase from '~/config/supabaseClient';

export function uploadFileWithProgress(bucketName, fileName, file, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Get a signed URL for the upload
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage.from(bucketName).createSignedUploadUrl(fileName);

      if (signedUrlError) {
        throw signedUrlError;
      }

      const { signedUrl } = signedUrlData;

      // Step 2: Upload the file using XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round(
            (event.loaded * 100) / event.total,
          );
          onProgress(percentCompleted);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          // If upload is successful, get the public URL
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
          resolve(publicUrlData.publicUrl);
        } else {
          // Handle upload error
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(
              new Error(
                errorResponse.message ||
                  `Upload failed with status: ${xhr.status}`,
              ),
            );
          } catch (e) {
            reject(
              new Error(
                `Upload failed with status: ${xhr.status} ${xhr.responseText}`,
              ),
            );
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Upload failed due to a network error.'));
      };

      xhr.send(file);
    } catch (error) {
      reject(error);
    }
  });
}

export const removeFileInBucket = async (bucketName, fileName) => {
  const { error } = await supabase.storage.from(bucketName).remove([fileName]);
  if (error) {
    throw new Error(`Failed to remove file: ${error.message}`);
  }
  return true;
};

export async function uploadCoverImage(coverImage, user) {
  const base64Data = coverImage.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = Array.from(byteCharacters).map((char) =>
    char.charCodeAt(0),
  );
  const byteArray = new Uint8Array(byteNumbers);
  const imageBlob = new Blob([byteArray], { type: 'image/jpeg' });

  const coverFileName = `${user.sub}/${Date.now()}_cover.jpg`;
  const { error: coverUploadError } = await supabase.storage
    .from('covers')
    .upload(coverFileName, imageBlob, {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (coverUploadError) throw coverUploadError;

  const { data: coverUrlData } = supabase.storage
    .from('covers')
    .getPublicUrl(coverFileName);

  const coverPublicUrl = coverUrlData?.publicUrl;
  if (!coverPublicUrl) throw new Error('Failed to get public cover URL');

  return coverPublicUrl;
}

export const insertVideo = async (fileUrl, thumbailUrl, description) => {
  const { error } = await supabase.rpc('insert_video', {
    file_url: fileUrl,
    thumb_url: thumbailUrl,
    description: description,
  });
  if (error) {
    throw error;
  }
};

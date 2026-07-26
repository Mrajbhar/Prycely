import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';

export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append('file', file);

    return unwrap(
      api.post<ApiResponse<{ url: string }>>('/upload/image', form, {
        // Let the browser set 'multipart/form-data; boundary=...' itself.
        // Overriding the axios JSON default is what makes the file parse server-side.
        headers: { 'Content-Type': undefined as unknown as string },
      }),
    );
  },
};
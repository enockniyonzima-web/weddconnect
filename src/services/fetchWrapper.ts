/* eslint-disable @typescript-eslint/no-unused-vars */
export async function fetchWrapper(url: string, options: RequestInit) {
     try {
          const response = await fetch(url, options);

          if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
          }

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
               return await response.json();
          }
          return null;
     } catch (error) {
          return null;
     }
}
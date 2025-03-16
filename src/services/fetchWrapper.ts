/* eslint-disable @typescript-eslint/no-unused-vars */

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);

export async function fetchWrapper(url: string, options: RequestInit) {
     try {
          const response = await fetch(url, options);
          clearTimeout(timeout);
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
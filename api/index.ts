import axios from "axios";

const API_KEY = "43881006-d24280c1e83f645ed2ca7f1c3";

const PIXEL_API_URL = `https://pixabay.com/api/?key=${API_KEY}`;

const buildUrl = (queryParams: Record<string, string | number>) => {
  let url = PIXEL_API_URL + "&per_page=25&safesearch=true&editors_choice=true";

  if (!queryParams) {
    return url;
  }

  const queryParamKeys = Object.keys(queryParams);
  queryParamKeys.map((key: string) => {
    const value =
      key === "q" ? encodeURIComponent(queryParams[key]) : queryParams[key];

    url += `&${key}=${value}`;
  });

  return url;
};

export const fetchImages = async (
  queryParams: Record<string, string | number>
) => {
  try {
    const url = buildUrl(queryParams);
    console.log('url', url);
    const response = await axios.get(url);
    console.log('hts', response.data.hits);
    return { data: response.data.hits };
  } catch (error: any) {
    console.log("Error", error);
    return { message: error.message, isError: true, data: null };
  }
};

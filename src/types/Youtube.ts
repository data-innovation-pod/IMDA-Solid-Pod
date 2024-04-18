export type ListResponse<T> = {
  items: T[];
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

export type LikedVideo = {
  kind: string;
  snippet: {
    channelTitle: string;
    description: string;
    title: string;
  };
};

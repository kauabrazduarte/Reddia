interface Article {
  title: string;
  content: string;
}

export default async function getRecentNews(): Promise<Article[]> {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const url = `https://newsapi.org/v2/everything?q=apple&from=${formatDate(yesterday)}&to=${formatDate(today)}&sortBy=popularity&apiKey=${process.env.NEWS_API}&language=pt`;

  const res = await fetch(url, {
    next: { revalidate: 10800 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = await res.json();

  return data.articles.map((article: Article) => ({
    title: article.title,
    content: article.content,
  }));
}

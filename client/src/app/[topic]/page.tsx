// /anything

import { redis } from "@/lib/redis"
import ClientPage from "./ClientPage"

interface PageProps {
  params: {
    topic: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { topic } = params

  // [redis, 3, is, 2, great, 6]
  const initialData = await redis.zrange<(string | number)[]>(
    `room:${topic}`,
    0,
    49,
    {
      withScores: true,
    }
  )

  const words: { text: string; value: number }[] = []

  for (let i = 0; i < initialData.length; i++) {
    const [text, value] = initialData.slice(i, i + 2)

    if (typeof text === "string" && typeof value === "number") {
      words.push({ text, value })
    }
  }

  await redis.incr("served-requests")

  return <ClientPage initialData={words} topicName={topic} />
}

export default Page

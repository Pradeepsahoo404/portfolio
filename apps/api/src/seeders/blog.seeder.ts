import { BlogPost } from "../models/content/blogPost.model.js";
import { CONTENT_STATUS } from "../constants/content.constants.js";
import { BLOG_TITLES } from "./data/static.data.js";
import {
  pickRandomMany,
  randomInt,
  randomDate,
  placeholderImage,
  uniqueSlug,
} from "./utils/helpers.js";
import { SEED_COUNTS } from "./seed.config.js";
import { logger } from "../utils/logger.util.js";
import type { Types } from "mongoose";

interface BlogSeedInput {
  workspaceId: Types.ObjectId;
  authorId: Types.ObjectId;
  createdBy: Types.ObjectId;
  blogCategoryIds: Types.ObjectId[];
  tagIds: Types.ObjectId[];
}

export async function seedBlogs(input: BlogSeedInput): Promise<void> {
  const { workspaceId, authorId, createdBy, blogCategoryIds, tagIds } = input;
  const startDate = new Date("2022-01-01");
  const endDate = new Date();

  for (let i = 0; i < SEED_COUNTS.blogs; i++) {
    const title = BLOG_TITLES[i] ?? `Blog Post ${i + 1}`;
    const slug = uniqueSlug(title, i > BLOG_TITLES.length - 1 ? i - BLOG_TITLES.length + 1 : 0);
    const categories = pickRandomMany(blogCategoryIds, 1, 2);
    const tags = pickRandomMany(tagIds, 2, 5);
    const publishedAt = randomDate(startDate, endDate);
    const readTime = randomInt(4, 15);

    await BlogPost.create({
      workspaceId,
      title,
      slug,
      excerpt: `An in-depth exploration of ${title.toLowerCase()}. Learn practical techniques, best practices, and real-world examples from production experience.`,
      content: generateBlogContent(title),
      coverImage: placeholderImage(`${slug}-blog`, 1200, 630),
      authorId,
      categoryIds: categories,
      tagIds: tags,
      readTimeMinutes: readTime,
      isFeatured: i < 5,
      publishedAt,
      status: CONTENT_STATUS.PUBLISHED,
      order: i,
      createdBy,
      seoTitle: title,
      seoDescription: `Read about ${title.toLowerCase()} - expert insights from Alex Morgan Studio.`,
    });
  }

  logger.info(`Seeded ${SEED_COUNTS.blogs} blog posts`);
}

function generateBlogContent(title: string): string {
  return `
<h2>Introduction</h2>
<p>In this article, we dive deep into <strong>${title}</strong>. Whether you're a seasoned developer or just starting your journey, this guide provides actionable insights backed by real production experience.</p>

<h2>Why This Matters</h2>
<p>The landscape of web development evolves rapidly. Understanding core concepts and modern patterns helps you build applications that are maintainable, scalable, and performant.</p>

<h2>Key Concepts</h2>
<ul>
  <li>Architecture patterns and best practices</li>
  <li>Performance optimization techniques</li>
  <li>Security considerations</li>
  <li>Testing strategies</li>
  <li>Deployment and monitoring</li>
</ul>

<h2>Practical Implementation</h2>
<p>Let's walk through a practical example. The following approach has been battle-tested across multiple production applications serving thousands of users.</p>

<pre><code>// Example implementation pattern
const app = express();
app.use(helmet());
app.use(cors(corsConfig));
app.use('/api/v1', routes);</code></pre>

<h2>Best Practices</h2>
<p>Always prioritize code readability, comprehensive testing, and thorough documentation. These principles compound over time and make your codebase a joy to work with.</p>

<h2>Conclusion</h2>
<p>Mastering ${title.toLowerCase()} is an investment that pays dividends throughout your career. Start applying these concepts in your next project and share your learnings with the community.</p>
`.trim();
}

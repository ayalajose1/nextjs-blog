import { remark } from 'remark';
import html from 'remark-html';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';



// get path the posts directory
const postsDirectory = path.join(process.cwd(), 'posts');
export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  //return a array whith file name under /posts.
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, ''); //return the file name whitout the extension
    // Read markdown file as string - Ruta absoluta de los archivos /posts
    const fullPath = path.join(postsDirectory, fileName);
    // leer el contenido de los archivos y darle el formato standar utf8
    const fileContents = fs.readFileSync(fullPath, 'utf8'); 
    // Use gray-matter to parse the post metadata section - pasamos a metadatos.
    // devuelve 2 objetos - content: texto pricipal y data: que contiene a title:titulo, date:fecha. 
    const matterResult = matter(fileContents);
    // Combine the data with the id - return a array combine id and data.
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  // Get file names under /posts
  // fileNames = [ 'pre-rendering.md', 'ssg-ssr.md' ]
  const fileNames = fs.readdirSync(postsDirectory);
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
// Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

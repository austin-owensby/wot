import maps from '@/data/maps.json'
import { books, chapters } from '@/utilities/book-info'
import { Map } from '@/models/map'

export class MapService {
  public static getMap (book: string, chapter: string) {
    const bookIndex = books.indexOf(book)
    const chapterIndex = bookIndex === -1 ? -1 : chapters[book].indexOf(chapter)

    const map: Map | undefined = maps.find(d => d.bookIndex === bookIndex && d.chapterIndex <= chapterIndex)

    return map ?? ({ bookIndex: bookIndex, chapterIndex: chapterIndex, paths: [], points: [] } as Map)
  }
}

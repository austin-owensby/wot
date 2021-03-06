import summaries from '@/data/summaries.json'
import characters from '@/data/characters.json'
import locations from '@/data/locations.json'
import events from '@/data/events.json'
import glossary from '@/data/glossary.json'
import { books, chapters } from '@/utilities/book-info'
import { Summary } from '@/models/summary'
import { Character } from '@/models/character'
import { Location } from '@/models/location'
import { Event } from '@/models/event'
import { Glossary } from '@/models/glossary'

export class DataService {
  public static getSummary (book: string, chapter: string) {
    const bookIndex = books.indexOf(book)
    const chapterIndex = bookIndex === -1 ? -1 : chapters[book].indexOf(chapter)

    const summary: Summary | undefined = summaries.find(d => d.bookIndex === bookIndex && d.chapterIndex === chapterIndex)

    return summary?.summary
  }

  public static getCharacters (book: string, chapter: string) {
    const bookIndex = books.indexOf(book)
    const chapterIndex = bookIndex === -1 ? -1 : chapters[book].indexOf(chapter)

    const distinctCharacters: string[] = [...new Set(characters.filter(d => (d.bookIndex === bookIndex && d.chapterIndex <= chapterIndex) || d.bookIndex < bookIndex).map(d => d.name))].sort()

    const characterData: Character[] = []

    for (const character of distinctCharacters) {
      const foundCharacter = characters.find(d => d.name === character && ((d.bookIndex === bookIndex && d.chapterIndex <= chapterIndex) || d.bookIndex < bookIndex))

      if (foundCharacter) {
        characterData.push(foundCharacter)
      }
    }

    return characterData
  }

  public static getLocations (book: string, chapter: string) {
    const bookIndex = books.indexOf(book)
    const chapterIndex = bookIndex === -1 ? -1 : chapters[book].indexOf(chapter)

    const distinctLocations: string[] = [...new Set(locations.filter(d => (d.bookIndex === bookIndex && d.chapterIndex <= chapterIndex) || d.bookIndex < bookIndex).map(d => d.name))].sort()

    const locationData: Location[] = []

    for (const location of distinctLocations) {
      const foundLocation = locations.find(d => d.name === location && ((d.bookIndex === bookIndex && d.chapterIndex <= chapterIndex) || d.bookIndex < bookIndex))

      if (foundLocation) {
        locationData.push(foundLocation)
      }
    }

    return locationData
  }

  public static getTimeline (book: string, chapter: string) {
    const bookIndex = books.indexOf(book)
    const chapterIndex = bookIndex === -1 ? -1 : chapters[book].indexOf(chapter)

    const timelineData: Event[] = events.filter(d => d.bookIndex === bookIndex && d.chapterIndex <= chapterIndex)

    return timelineData
  }

  public static getGlossary (book: string, chapter: string) {
    const bookIndex = books.indexOf(book)
    const chapterIndex = bookIndex === -1 ? -1 : chapters[book].indexOf(chapter)

    const distinctGlossary: string[] = [...new Set(glossary.filter(d => (d.bookIndex === bookIndex && d.chapterIndex <= chapterIndex) || d.bookIndex < bookIndex).map(d => d.name))].sort()

    const glossaryData: Glossary[] = []

    for (const glossaryEntry of distinctGlossary) {
      const foundGlossary = glossary.find(d => d.name === glossaryEntry && ((d.bookIndex === bookIndex && d.chapterIndex <= chapterIndex) || d.bookIndex < bookIndex))

      if (foundGlossary) {
        glossaryData.push(foundGlossary)
      }
    }

    glossaryData.push(...this.getCharacters(book, chapter))
    glossaryData.push(...this.getLocations(book, chapter))

    return glossaryData.sort((a, b) => a.name.localeCompare(b.name))
  }
}

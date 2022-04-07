const summaries = require('./src/data/summaries.json')
const characters = require('./src/data/characters.json')
const events = require('./src/data/events.json')
const glossary = require('./src/data/glossary.json')
const locations = require('./src/data/locations.json')
const maps = require('./src/data/maps.json')
const fs = require('fs')

function sortByChapter (a, b) {
  const bookDifference = a.bookIndex - b.bookIndex
  if (bookDifference === 0) {
    return a.chapterIndex - b.chapterIndex
  }

  return bookDifference
}

function sortByChapterReverse (a, b) {
  const bookDifference = b.bookIndex - a.bookIndex
  if (bookDifference === 0) {
    const chapterDifference = b.chapterIndex - a.chapterIndex
    if (chapterDifference === 0) {
      return a.name - b.name
    }

    return chapterDifference
  }

  return bookDifference
}

function sortData () {
  const sortedSummaries = summaries.sort(sortByChapter)
  fs.writeFile('./src/data/summaries.json', JSON.stringify(sortedSummaries, null, 4), function (err) {
    if (err) {
      return console.log(err)
    }
  })

  const sortedCharacters = characters.sort(sortByChapterReverse)
  sortedCharacters.forEach(x => { x.tags.sort() })
  fs.writeFile('./src/data/characters.json', JSON.stringify(sortedCharacters, null, 4), function (err) {
    if (err) {
      return console.log(err)
    }
  })

  const sortedGlossary = glossary.sort(sortByChapterReverse)
  sortedGlossary.forEach(x => { x.tags.sort() })
  fs.writeFile('./src/data/glossary.json', JSON.stringify(sortedGlossary, null, 4), function (err) {
    if (err) {
      return console.log(err)
    }
  })

  const sortedLocations = locations.sort(sortByChapterReverse)
  sortedLocations.forEach(x => { x.tags.sort() })
  fs.writeFile('./src/data/locations.json', JSON.stringify(sortedLocations, null, 4), function (err) {
    if (err) {
      return console.log(err)
    }
  })

  const sortedMaps = maps.sort(sortByChapterReverse)
  fs.writeFile('./src/data/maps.json', JSON.stringify(sortedMaps, null, 4), function (err) {
    if (err) {
      return console.log(err)
    }
  })

  // TODO, add additional sorting rules for events if we have more than 1 event per chapter
  const sortedEvents = events.sort(sortByChapterReverse)
  fs.writeFile('./src/data/events.json', JSON.stringify(sortedEvents, null, 4), function (err) {
    if (err) {
      return console.log(err)
    }
  })
}

sortData()
